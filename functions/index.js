const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Anthropic = require('@anthropic-ai/sdk');
const corsOptions = {
    origin: [
        'https://sleep-wellness.netlify.app',
        'http://localhost:5000',
        'http://localhost:3000',
        'http://127.0.0.1:5000'
    ]
};
const cors = require('cors')(corsOptions);

admin.initializeApp();
const db = admin.firestore();

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: functions.config().anthropic?.key || process.env.ANTHROPIC_API_KEY
});

// System prompt for the sleep assistant
const SYSTEM_PROMPT = `You are the Sleep Wellness Assistant for Dr. Alen Juginovic's sleep consulting practice. Dr. Alen is a Harvard sleep scientist and physician.

YOUR ROLE:
- Provide sleep education and explain sleep science concepts
- Help users understand their sleep data and metrics
- Guide users through the Sleep Wellness portal
- Answer general questions about healthy sleep habits

WHAT YOU CAN DO:
- Explain sleep terms (sleep efficiency, WASO, sleep latency, circadian rhythm, etc.)
- Share evidence-based sleep hygiene tips
- Explain how much sleep adults need (7-9 hours recommended)
- Discuss factors affecting sleep (caffeine, alcohol, light, temperature, stress)
- Summarize user's sleep diary data when provided
- Help navigate portal sections (Dashboard, Assessments, Sleep Diary, Messages, Resources)
- Explain questionnaire scores (ISI, ESS, PSQI, STOP-BANG)

WHAT YOU MUST NOT DO:
- Provide medical diagnoses
- Recommend specific medications or dosages
- Give treatment advice for sleep disorders
- Interpret symptoms as specific conditions
- Replace professional medical consultation

WHEN TO REFER TO DR. ALEN:
If the user asks about:
- Whether they have a sleep disorder (insomnia, sleep apnea, etc.)
- Medication recommendations or dosages
- Treatment options for their condition
- Interpreting concerning symptoms
- Any medical advice

Respond helpfully with general education, then add:
[REFER_TO_DOCTOR]
This signals the system to show a "Contact Dr. Alen" button.

STYLE:
- Be warm, professional, and supportive
- Use clear, simple language
- Keep responses concise but informative
- Format with bullet points or short paragraphs for readability

USER CONTEXT:
{USER_CONTEXT}`;

// ==================== RATE LIMITER ====================
// In-memory rate limiter: Map<key, { count, windowStart }>
// Note: Resets on cold start — that's acceptable as defense-in-depth after auth.
const rateLimitMap = new Map();
const RATE_LIMIT_MAX = 10;          // max requests per window (chatbot)
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const BOOKING_RATE_LIMIT_MAX = 5;   // max bookings per window
const BOOKING_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

/**
 * Prune expired entries from the rate limit map to prevent unbounded growth.
 * Called periodically from checkRateLimit.
 */
let rateLimitPruneCounter = 0;
const PRUNE_EVERY_N_CALLS = 100;

function pruneRateLimitMap() {
    const now = Date.now();
    for (const [key, data] of rateLimitMap.entries()) {
        if (now - data.windowStart > (data.windowMs || RATE_LIMIT_WINDOW_MS)) {
            rateLimitMap.delete(key);
        }
    }
}

/**
 * Generic rate-limit check.
 * @param {string} key - identifier (uid or IP)
 * @param {number} max - max requests per window
 * @param {number} windowMs - window duration in ms
 * @returns {{ limited: boolean, retryAfterMs?: number }}
 */
function checkRateLimit(key, max = RATE_LIMIT_MAX, windowMs = RATE_LIMIT_WINDOW_MS) {
    // Periodically prune expired entries
    rateLimitPruneCounter++;
    if (rateLimitPruneCounter >= PRUNE_EVERY_N_CALLS) {
        rateLimitPruneCounter = 0;
        pruneRateLimitMap();
    }

    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (entry && now - entry.windowStart < windowMs) {
        if (entry.count >= max) {
            return { limited: true, retryAfterMs: windowMs - (now - entry.windowStart) };
        }
        entry.count++;
    } else {
        rateLimitMap.set(key, { count: 1, windowStart: now, windowMs: windowMs });
    }
    return { limited: false };
}

/**
 * Extract client IP from request (respects X-Forwarded-For behind proxies).
 */
function getClientIp(req) {
    return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || 'unknown';
}

/**
 * Verify a Firebase ID token from the Authorization header.
 * Returns the decoded token or null.
 */
async function verifyAuthToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const idToken = authHeader.split('Bearer ')[1];
    try {
        return await admin.auth().verifyIdToken(idToken);
    } catch (err) {
        return null;
    }
}

/**
 * Simple email format validation.
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Cloud Function to chat with Claude
exports.chatWithClaude = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }

        try {
            // --- Authentication: require Firebase ID token ---
            const decodedToken = await verifyAuthToken(req);
            if (!decodedToken) {
                res.status(401).json({ error: 'Authentication required. Please sign in.' });
                return;
            }

            const authenticatedUid = decodedToken.uid;

            const { message, conversationHistory } = req.body;

            // --- Rate limiting (mandatory — uses authenticated uid, IP as fallback) ---
            const rateLimitKey = authenticatedUid || `ip:${getClientIp(req)}`;
            const rl = checkRateLimit(rateLimitKey, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
            if (rl.limited) {
                res.status(429).json({
                    error: 'Too many requests. Please wait a minute before sending another message.',
                    retryAfterMs: rl.retryAfterMs
                });
                return;
            }

            if (!message) {
                res.status(400).json({ error: 'Message is required' });
                return;
            }

            // --- H6: Input length validation ---
            if (typeof message !== 'string' || message.length > 4000) {
                res.status(400).json({ error: 'Message must be a string of 4000 characters or fewer.' });
                return;
            }

            // --- H5: Validate conversationHistory ---
            const MAX_HISTORY_LENGTH = 20;
            const allowedRoles = new Set(['user', 'assistant']);
            let sanitizedHistory = [];
            if (Array.isArray(conversationHistory)) {
                sanitizedHistory = conversationHistory
                    .filter(entry =>
                        entry &&
                        typeof entry === 'object' &&
                        typeof entry.role === 'string' &&
                        allowedRoles.has(entry.role) &&
                        typeof entry.content === 'string' &&
                        entry.content.trim().length > 0
                    )
                    .slice(-MAX_HISTORY_LENGTH)
                    .map(entry => ({ role: entry.role, content: entry.content }));
            }

            // Fetch user context using the authenticated uid
            let userContext = 'No user data available.';
            userContext = await getUserContext(authenticatedUid);

            // Build the system prompt with user context
            const systemPrompt = SYSTEM_PROMPT.replace('{USER_CONTEXT}', userContext);

            // Build messages array
            const messages = [
                ...sanitizedHistory.slice(-10), // Keep last 10 messages for context
                { role: 'user', content: message }
            ];

            // Call Claude API
            const response = await anthropic.messages.create({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1024,
                system: systemPrompt,
                messages: messages
            });

            const assistantMessage = response.content[0].text;

            // Check if we should show the contact button
            const showContactBtn = assistantMessage.includes('[REFER_TO_DOCTOR]');
            const cleanedMessage = assistantMessage.replace('[REFER_TO_DOCTOR]', '').trim();

            // Format response with HTML
            const formattedMessage = formatResponse(cleanedMessage);

            res.json({
                message: formattedMessage,
                showContactBtn: showContactBtn,
                usage: response.usage
            });

        } catch (error) {
            console.error('Error calling Claude:', error);
            res.status(500).json({
                error: 'Service temporarily unavailable. Please try again later.'
            });
        }
    });
});

// Fetch user context from Firestore
async function getUserContext(userId) {
    try {
        const context = [];

        // Get user profile
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
            const user = userDoc.data();
            context.push(`Client type: ${user.clientType || 'general'}`);
            context.push(`Name: ${user.displayName || 'Unknown'}`);
        }

        // Get recent sleep diary entries (last 7 days)
        const diarySnapshot = await db.collection('diaryEntries')
            .where('userId', '==', userId)
            .orderBy('date', 'desc')
            .limit(7)
            .get();

        if (!diarySnapshot.empty) {
            const entries = diarySnapshot.docs.map(doc => doc.data());

            // Calculate averages
            const avgEfficiency = entries.reduce((sum, e) => sum + (e.sleepEfficiency || 0), 0) / entries.length;
            const avgTST = entries.reduce((sum, e) => sum + (e.totalSleepTime || 0), 0) / entries.length;
            const avgLatency = entries.reduce((sum, e) => sum + (e.sleepLatency || 0), 0) / entries.length;
            const avgQuality = entries.reduce((sum, e) => sum + (e.quality || 0), 0) / entries.length;

            const hours = Math.floor(avgTST / 60);
            const mins = Math.round(avgTST % 60);

            context.push(`\nSleep Diary Summary (last ${entries.length} nights):`);
            context.push(`- Average sleep time: ${hours}h ${mins}m`);
            context.push(`- Average sleep efficiency: ${avgEfficiency.toFixed(0)}%`);
            context.push(`- Average sleep latency: ${Math.round(avgLatency)} minutes`);
            context.push(`- Average quality rating: ${avgQuality.toFixed(1)}/5`);
        } else {
            context.push('\nNo sleep diary entries recorded yet.');
        }

        // Get latest assessment results
        const assessmentSnapshot = await db.collection('assessments')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();

        if (!assessmentSnapshot.empty) {
            const assessment = assessmentSnapshot.docs[0].data();
            context.push(`\nLatest Assessment Score: ${assessment.overallScore || 'N/A'}/100`);
            if (assessment.isiScore) context.push(`- ISI Score: ${assessment.isiScore}`);
            if (assessment.essScore) context.push(`- ESS Score: ${assessment.essScore}`);
        }

        return context.join('\n');
    } catch (error) {
        console.error('Error fetching user context:', error);
        return 'Error fetching user data.';
    }
}

// Format response with basic HTML
function formatResponse(text) {
    // Convert markdown-like formatting to HTML
    let html = text
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Bullet points
        .replace(/^[•\-\*]\s+(.+)$/gm, '<li>$1</li>')
        // Numbered lists
        .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
        // Paragraphs
        .split('\n\n').map(p => {
            if (p.includes('<li>')) {
                return '<ul>' + p + '</ul>';
            }
            return '<p>' + p + '</p>';
        }).join('');

    // Clean up nested tags
    html = html.replace(/<p><ul>/g, '<ul>').replace(/<\/ul><\/p>/g, '</ul>');
    html = html.replace(/<p><\/p>/g, '');

    return html;
}

// ==================== GOOGLE CALENDAR INTEGRATION ====================

// Note: To enable Google Calendar, you need to:
// 1. Enable Google Calendar API in Google Cloud Console (same project as Firebase)
// 2. Create OAuth 2.0 credentials (web client)
// 3. Set config: firebase functions:config:set google.client_id="YOUR_ID" google.client_secret="YOUR_SECRET" google.redirect_uri="YOUR_REDIRECT"
// 4. Set admin calendar ID: firebase functions:config:set google.calendar_id="primary"

const { google } = require('googleapis');

// Singleton OAuth2 client — avoids re-registering event listeners per request (T2.14)
let _oauth2Client = null;

function getOAuth2Client() {
    if (_oauth2Client) return _oauth2Client;

    const clientId = functions.config().google?.client_id || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = functions.config().google?.client_secret || process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = functions.config().google?.redirect_uri || process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret) {
        throw new Error('Google OAuth credentials not configured. Run: firebase functions:config:set google.client_id="..." google.client_secret="..."');
    }

    _oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    // Register token-refresh handler once at module scope to avoid listener accumulation
    _oauth2Client.on('tokens', async (tokens) => {
        try {
            await db.collection('adminConfig').doc('googleCalendar').update({
                'tokens.access_token': tokens.access_token,
                ...(tokens.refresh_token && { 'tokens.refresh_token': tokens.refresh_token })
            });
        } catch (err) {
            console.error('Error persisting refreshed OAuth tokens:', err);
        }
    });

    return _oauth2Client;
}

// Admin UID for authorization checks
const ADMIN_UID = 'iHDuOEJXsQe7dL5C4QwA3fLX9zi2';

// Step 1: Admin connects their Google Calendar
exports.getCalendarAuthUrl = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            // --- H7: Require authenticated admin ---
            const decodedToken = await verifyAuthToken(req);
            if (!decodedToken || decodedToken.uid !== ADMIN_UID) {
                res.status(403).json({ error: 'Forbidden. Admin access required.' });
                return;
            }

            const oauth2Client = getOAuth2Client();

            // Generate a state token to verify the callback
            const stateToken = require('crypto').randomBytes(32).toString('hex');
            await db.collection('adminConfig').doc('oauthState').set({
                state: stateToken,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                uid: decodedToken.uid
            });

            const authUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: [
                    'https://www.googleapis.com/auth/calendar.events',
                    'https://www.googleapis.com/auth/calendar.readonly'
                ],
                prompt: 'consent',
                state: stateToken
            });
            res.json({ authUrl });
        } catch (error) {
            console.error('Error generating auth URL:', error);
            res.status(500).json({ error: 'An internal error occurred.' });
        }
    });
});

// Step 2: OAuth callback - exchange code for tokens
exports.calendarAuthCallback = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            const { code, state } = req.query;
            if (!code) {
                res.status(400).send('Missing authorization code');
                return;
            }

            // --- H7: Verify the state token matches what was generated ---
            if (!state) {
                res.status(400).send('Missing state parameter.');
                return;
            }

            const stateDoc = await db.collection('adminConfig').doc('oauthState').get();
            if (!stateDoc.exists || stateDoc.data().state !== state) {
                res.status(403).send('Invalid or expired OAuth state. Please restart the authorization flow.');
                return;
            }

            // Delete the used state token to prevent replay
            await db.collection('adminConfig').doc('oauthState').delete();

            const oauth2Client = getOAuth2Client();
            const { tokens } = await oauth2Client.getToken(code);

            // Store tokens securely in Firestore (admin-only collection)
            await db.collection('adminConfig').doc('googleCalendar').set({
                tokens,
                connectedAt: admin.firestore.FieldValue.serverTimestamp(),
                status: 'connected'
            });

            // Redirect back to admin portal
            res.redirect('/assessment/admin/index.html?calendar=connected#appointments');
        } catch (error) {
            console.error('Calendar auth error:', error);
            res.status(500).send('Calendar connection failed. Please try again.');
        }
    });
});

// Step 3: Get available time slots (public - for booking widget)
exports.getAvailableSlots = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            const configDoc = await db.collection('adminConfig').doc('googleCalendar').get();
            if (!configDoc.exists || !configDoc.data().tokens) {
                res.json({ slots: [], message: 'Calendar not connected' });
                return;
            }

            const oauth2Client = getOAuth2Client();
            oauth2Client.setCredentials(configDoc.data().tokens);

            // Token refresh is handled by the module-scope listener in getOAuth2Client()

            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
            const calendarId = functions.config().google?.calendar_id || 'primary';

            // Get busy times for next 14 days
            const now = new Date();
            const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

            const freeBusy = await calendar.freebusy.query({
                requestBody: {
                    timeMin: now.toISOString(),
                    timeMax: twoWeeksLater.toISOString(),
                    items: [{ id: calendarId }]
                }
            });

            const busySlots = freeBusy.data.calendars[calendarId]?.busy || [];

            // Generate available 45-min slots (9am-5pm, Mon-Fri, Eastern Time)
            // Determine ET offset: EDT (UTC-4) Mar second Sun – Nov first Sun, else EST (UTC-5)
            function getEasternOffsetHours(date) {
                const year = date.getUTCFullYear();
                // Second Sunday of March
                const mar1 = new Date(Date.UTC(year, 2, 1));
                const marSecondSun = new Date(Date.UTC(year, 2, 8 + (7 - mar1.getUTCDay()) % 7));
                marSecondSun.setUTCHours(7); // 2 AM EST = 7 AM UTC
                // First Sunday of November
                const nov1 = new Date(Date.UTC(year, 10, 1));
                const novFirstSun = new Date(Date.UTC(year, 10, 1 + (7 - nov1.getUTCDay()) % 7));
                novFirstSun.setUTCHours(6); // 2 AM EDT = 6 AM UTC
                return (date >= marSecondSun && date < novFirstSun) ? -4 : -5;
            }

            const availableSlots = [];

            // Start from "tomorrow in ET": figure out what day it is in ET right now
            const etOffsetNow = getEasternOffsetHours(now);
            const nowEtMs = now.getTime() + etOffsetNow * 3600000;
            // Midnight ET tomorrow expressed as a UTC Date
            const midnightEtTomorrow = new Date(now);
            // Set to midnight UTC, then adjust for ET offset
            midnightEtTomorrow.setUTCHours(0, 0, 0, 0);
            midnightEtTomorrow.setUTCDate(midnightEtTomorrow.getUTCDate() + 1);
            // This gives us a date counter; we'll compute each slot in UTC using the ET offset

            let dayCounter = new Date(midnightEtTomorrow);

            while (dayCounter < twoWeeksLater && availableSlots.length < 20) {
                // Determine ET offset for this day
                const etOffset = getEasternOffsetHours(dayCounter);
                // Compute the UTC date/day by interpreting dayCounter as an ET date
                // Midnight ET of this day in UTC:
                const midnightEtInUtc = new Date(dayCounter.getTime() - etOffset * 3600000);
                const dayOfWeek = midnightEtInUtc.getUTCDay();
                // Adjust: dayOfWeek should be based on ET date, not UTC
                const etDayOfWeek = dayCounter.getUTCDay();

                if (etDayOfWeek >= 1 && etDayOfWeek <= 5) { // Mon-Fri in ET
                    for (let hour = 9; hour < 17; hour++) {
                        // Slot start: this ET hour converted to UTC
                        const slotStartUtc = new Date(midnightEtInUtc.getTime() + hour * 3600000);
                        const slotEndUtc = new Date(slotStartUtc.getTime() + 45 * 60000);

                        // Check if slot conflicts with busy times
                        const isBusy = busySlots.some(busy => {
                            const busyStart = new Date(busy.start);
                            const busyEnd = new Date(busy.end);
                            return slotStartUtc < busyEnd && slotEndUtc > busyStart;
                        });

                        if (!isBusy && slotStartUtc > now) {
                            // Format display in Eastern Time
                            const etHour = hour > 12 ? hour - 12 : hour;
                            const ampm = hour >= 12 ? 'PM' : 'AM';
                            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                            const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                            const displayDay = days[etDayOfWeek];
                            const displayMonth = months[dayCounter.getUTCMonth()];
                            const displayDate = dayCounter.getUTCDate();

                            availableSlots.push({
                                start: slotStartUtc.toISOString(),
                                end: slotEndUtc.toISOString(),
                                display: `${displayDay}, ${displayMonth} ${displayDate} at ${etHour}:00 ${ampm} ET`
                            });
                        }
                    }
                }
                dayCounter.setUTCDate(dayCounter.getUTCDate() + 1);
            }

            res.json({ slots: availableSlots });
        } catch (error) {
            console.error('Error getting slots:', error);
            res.json({ slots: [], error: 'Unable to retrieve available slots. Please try again later.' });
        }
    });
});

// Step 4: Book an appointment (creates tentative calendar event)
exports.bookAppointment = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }

        try {
            const { name, email, slotStart, slotEnd, notes, clientType } = req.body;

            if (!name || !email || !slotStart) {
                res.status(400).json({ error: 'Name, email, and time slot are required' });
                return;
            }

            // --- Email format validation ---
            if (!isValidEmail(email)) {
                res.status(400).json({ error: 'Invalid email format' });
                return;
            }

            // --- Optional auth: use token uid if provided, otherwise IP ---
            const decodedToken = await verifyAuthToken(req);
            const bookingRateLimitKey = decodedToken
                ? `booking:${decodedToken.uid}`
                : `booking:ip:${getClientIp(req)}`;

            // --- Rate limit: max 5 bookings per hour ---
            const rl = checkRateLimit(bookingRateLimitKey, BOOKING_RATE_LIMIT_MAX, BOOKING_RATE_LIMIT_WINDOW_MS);
            if (rl.limited) {
                res.status(429).json({
                    error: 'Too many booking requests. Please try again later.',
                    retryAfterMs: rl.retryAfterMs
                });
                return;
            }

            // Save appointment to Firestore
            const appointment = {
                clientName: name,
                clientEmail: email,
                clientType: clientType || 'general',
                startTime: new Date(slotStart),
                endTime: new Date(slotEnd || new Date(new Date(slotStart).getTime() + 45 * 60000)),
                notes: notes || '',
                status: 'pending',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await db.collection('appointments').add(appointment);

            // Try to create Google Calendar event if connected
            const configDoc = await db.collection('adminConfig').doc('googleCalendar').get();
            if (configDoc.exists && configDoc.data().tokens) {
                try {
                    const oauth2Client = getOAuth2Client();
                    oauth2Client.setCredentials(configDoc.data().tokens);
                    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
                    const calendarId = functions.config().google?.calendar_id || 'primary';

                    const event = await calendar.events.insert({
                        calendarId,
                        requestBody: {
                            summary: `Sleep Wellness: ${name}`,
                            description: `Client: ${name}\nEmail: ${email}\nType: ${clientType || 'General'}\nNotes: ${notes || 'None'}\n\nStatus: Pending confirmation`,
                            start: { dateTime: slotStart },
                            end: { dateTime: slotEnd || new Date(new Date(slotStart).getTime() + 45 * 60000).toISOString() },
                            status: 'tentative',
                            attendees: [{ email }]
                        }
                    });

                    await db.collection('appointments').doc(docRef.id).update({
                        calendarEventId: event.data.id
                    });
                } catch (calError) {
                    console.warn('Calendar event creation failed (appointment still saved):', calError.message);
                }
            }

            // Create notification for admin
            await db.collection('notifications').add({
                userId: 'iHDuOEJXsQe7dL5C4QwA3fLX9zi2', // Admin UID
                type: 'appointment_request',
                title: 'New Appointment Request',
                message: `${name} has requested an appointment on ${new Date(slotStart).toLocaleDateString()}.`,
                read: false,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                data: { appointmentId: docRef.id }
            });

            res.json({ success: true, appointmentId: docRef.id });
        } catch (error) {
            console.error('Booking error:', error);
            res.status(500).json({ error: 'Failed to book appointment' });
        }
    });
});

// ==================== PUSH NOTIFICATION CLOUD FUNCTIONS ====================

/**
 * Helper: Get a user's FCM token from their Firestore profile
 * Returns null if no token is stored.
 */
async function getUserFcmToken(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            console.log(`No user document found for userId: ${userId}`);
            return null;
        }
        const token = userDoc.data().fcmToken;
        if (!token) {
            console.log(`No FCM token stored for userId: ${userId}`);
            return null;
        }
        return token;
    } catch (error) {
        console.error(`Error fetching FCM token for userId ${userId}:`, error);
        return null;
    }
}

/**
 * Helper: Send a push notification to a specific user
 * @param {string} userId - The user's Firestore UID
 * @param {string} title - Notification title
 * @param {string} body - Notification body text
 * @param {string} type - Notification type (for routing on click)
 * @param {string} clickAction - URL to open on notification click
 */
async function sendPushNotification(userId, title, body, type = 'general', clickAction = '/assessment/account.html') {
    try {
        const token = await getUserFcmToken(userId);
        if (!token) {
            console.log(`Skipping push notification for userId ${userId}: no FCM token`);
            return false;
        }

        const message = {
            token: token,
            notification: {
                title: title,
                body: body
            },
            webpush: {
                notification: {
                    icon: '/apple-touch-icon.png',
                    badge: '/apple-touch-icon.png',
                    tag: type,
                    requireInteraction: false
                },
                fcmOptions: {
                    link: clickAction
                }
            },
            data: {
                type: type,
                title: title,
                body: body,
                clickAction: clickAction
            }
        };

        const response = await admin.messaging().send(message);
        console.log(`Push notification sent successfully to userId ${userId}:`, response);
        return true;
    } catch (error) {
        // Handle expired or invalid tokens
        if (error.code === 'messaging/registration-token-not-registered' ||
            error.code === 'messaging/invalid-registration-token') {
            console.warn(`Invalid/expired FCM token for userId ${userId}, removing token`);
            try {
                await db.collection('users').doc(userId).update({ fcmToken: null });
            } catch (updateError) {
                console.error('Error removing invalid FCM token:', updateError);
            }
        } else {
            console.error(`Error sending push notification to userId ${userId}:`, error);
        }
        return false;
    }
}

/**
 * 1. onTaskAssigned
 * Triggered when a new task is created in the 'clientTasks' collection.
 * Sends a push notification to the assigned client.
 */
exports.onTaskAssigned = functions.firestore
    .document('clientTasks/{taskId}')
    .onCreate(async (snapshot, context) => {
        try {
            const taskData = snapshot.data();
            const clientId = taskData.clientId;
            const taskTitle = taskData.title || 'New Task';

            if (!clientId) {
                console.log('Task created without clientId, skipping notification');
                return null;
            }

            await sendPushNotification(
                clientId,
                'New Task Assigned',
                `You have a new task: ${taskTitle}`,
                'task_assigned',
                '/assessment/account.html#tasks'
            );

            return null;
        } catch (error) {
            console.error('Error in onTaskAssigned:', error);
            return null;
        }
    });

/**
 * 2. onAppointmentReminder
 * Runs every hour via Cloud Scheduler.
 * Checks for confirmed appointments starting within the next 24 hours
 * and sends a reminder notification if one hasn't been sent yet.
 */
exports.onAppointmentReminder = functions.pubsub
    .schedule('every 1 hours')
    .onRun(async (context) => {
        try {
            const now = new Date();
            const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

            // Query confirmed appointments in the next 24 hours
            // Note: bookAppointment saves the field as 'startTime', not 'dateTime'
            const snapshot = await db.collection('appointments')
                .where('status', '==', 'confirmed')
                .where('startTime', '>=', now)
                .where('startTime', '<=', in24Hours)
                .get();

            if (snapshot.empty) {
                console.log('No upcoming appointments requiring reminders');
                return null;
            }

            const sendPromises = [];

            for (const doc of snapshot.docs) {
                const appointment = doc.data();

                // Skip if reminder already sent
                if (appointment.reminderSent) {
                    continue;
                }

                const userId = appointment.userId;
                if (!userId) continue;

                // Format the appointment time
                const appointmentTime = appointment.startTime.toDate();
                const timeStr = appointmentTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                const dateStr = appointmentTime.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                });

                // Send the push notification
                const sendPromise = sendPushNotification(
                    userId,
                    'Appointment Reminder',
                    `Your appointment is on ${dateStr} at ${timeStr}`,
                    'appointment_reminder',
                    '/assessment/account.html#appointments'
                ).then(async () => {
                    // Mark reminder as sent to avoid duplicates
                    await db.collection('appointments').doc(doc.id).update({
                        reminderSent: true,
                        reminderSentAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                });

                sendPromises.push(sendPromise);
            }

            await Promise.all(sendPromises);
            console.log(`Processed ${sendPromises.length} appointment reminders`);
            return null;
        } catch (error) {
            console.error('Error in onAppointmentReminder:', error);
            return null;
        }
    });

/**
 * 3. onQuestionnaireAssigned
 * Triggered when a new questionnaire assignment is created.
 * Sends a push notification to the assigned client.
 */
exports.onQuestionnaireAssigned = functions.firestore
    .document('questionnaireAssignments/{assignmentId}')
    .onCreate(async (snapshot, context) => {
        try {
            const assignmentData = snapshot.data();
            const userId = assignmentData.userId;
            const questionnaireName = assignmentData.instrumentName || 'New Questionnaire';

            if (!userId) {
                console.log('Questionnaire assigned without userId, skipping notification');
                return null;
            }

            // Skip auto-assigned system questionnaires to avoid notification spam during onboarding
            if (assignmentData.assignedBy === 'system') {
                console.log('System-assigned questionnaire, skipping push notification');
                return null;
            }

            await sendPushNotification(
                userId,
                'New Questionnaire',
                `You've been assigned: ${questionnaireName}`,
                'questionnaire_assigned',
                '/assessment/account.html#questionnaires'
            );

            return null;
        } catch (error) {
            console.error('Error in onQuestionnaireAssigned:', error);
            return null;
        }
    });

/**
 * 4. onNewMessage
 * Triggered when a new message is created in a conversation's messages subcollection.
 * Sends a push notification to the recipient (the other participant).
 */
exports.onNewMessage = functions.firestore
    .document('conversations/{conversationId}/messages/{messageId}')
    .onCreate(async (snapshot, context) => {
        try {
            const messageData = snapshot.data();
            const senderId = messageData.senderId;
            const conversationId = context.params.conversationId;

            if (!senderId) {
                console.log('Message created without senderId, skipping notification');
                return null;
            }

            // Get the conversation to find participants
            const conversationDoc = await db.collection('conversations').doc(conversationId).get();
            if (!conversationDoc.exists) {
                console.log('Conversation not found:', conversationId);
                return null;
            }

            const conversation = conversationDoc.data();
            const participants = conversation.participants || [];

            // Find the recipient (the participant who is NOT the sender)
            const recipients = participants.filter(id => id !== senderId);

            if (recipients.length === 0) {
                console.log('No recipients found for message notification');
                return null;
            }

            // Get sender's display name for the notification
            let senderName = 'Dr. Alen';
            try {
                const senderDoc = await db.collection('users').doc(senderId).get();
                if (senderDoc.exists) {
                    const senderData = senderDoc.data();
                    if (senderData.role === 'admin') {
                        senderName = 'Dr. Alen';
                    } else {
                        senderName = senderData.displayName || senderData.email || 'Someone';
                    }
                }
            } catch (e) {
                // Use default name if lookup fails
            }

            // Create a message preview (truncate to 100 chars)
            const messagePreview = (messageData.text || '').substring(0, 100) +
                (messageData.text && messageData.text.length > 100 ? '...' : '');

            // Send notification to each recipient
            const sendPromises = recipients.map(recipientId =>
                sendPushNotification(
                    recipientId,
                    `New Message from ${senderName}`,
                    messagePreview || 'You have a new message.',
                    'new_message',
                    '/assessment/account.html#messages'
                )
            );

            await Promise.all(sendPromises);
            return null;
        } catch (error) {
            console.error('Error in onNewMessage:', error);
            return null;
        }
    });
