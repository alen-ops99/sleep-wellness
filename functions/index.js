const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Anthropic = require('@anthropic-ai/sdk');
const cors = require('cors')({ origin: true });

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

// Cloud Function to chat with Claude
exports.chatWithClaude = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }

        try {
            const { message, userId, conversationHistory = [] } = req.body;

            if (!message) {
                res.status(400).json({ error: 'Message is required' });
                return;
            }

            // Fetch user context if userId provided
            let userContext = 'No user data available.';
            if (userId) {
                userContext = await getUserContext(userId);
            }

            // Build the system prompt with user context
            const systemPrompt = SYSTEM_PROMPT.replace('{USER_CONTEXT}', userContext);

            // Build messages array
            const messages = [
                ...conversationHistory.slice(-10), // Keep last 10 messages for context
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
                error: 'Failed to get response',
                details: error.message
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
        const diarySnapshot = await db.collection('sleepDiary')
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
