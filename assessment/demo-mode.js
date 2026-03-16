/**
 * Demo Mode for Sleep Wellness Client Portal
 *
 * Supports three persona-specific demos:
 *   ?demo=true    — Individual/executive client (Alex Morgan)
 *   ?demo=hotel   — Hotel guest experience (James Richardson @ The Ritz-Carlton)
 *   ?demo=athlete — Athlete experience (Marcus Thompson, Boston Celtics)
 *
 * Detects URL param, overrides FirebaseDB methods with persona-appropriate mock data,
 * and creates fake auth objects so the dashboard works without Firebase.
 */

(function() {
    'use strict';

    // ==================== DETECTION ====================

    /**
     * Returns the active demo persona, or null if not in demo mode.
     * Recognized values: 'individual', 'hotel', 'athlete'
     */
    function getDemoPersona() {
        const params = new URLSearchParams(window.location.search);
        const demo = params.get('demo');
        if (demo === 'hotel') return 'hotel';
        if (demo === 'athlete') return 'athlete';
        if (demo === 'true' || sessionStorage.getItem('demoMode') === 'true') {
            // Restore saved persona, or default to individual
            return sessionStorage.getItem('demoPersona') || 'individual';
        }
        return null;
    }

    function isDemoMode() {
        return getDemoPersona() !== null;
    }

    if (!isDemoMode()) return;

    const PERSONA = getDemoPersona();

    // Persist across navigation within the session
    sessionStorage.setItem('demoMode', 'true');
    sessionStorage.setItem('demoPersona', PERSONA);

    console.log(`[Demo Mode] Activated — persona: ${PERSONA}`);

    // ==================== SHARED UTILITIES ====================

    const DEMO_UID = 'demo-user-001';
    const DAY = 86400000;

    function makeTimestamp(date) {
        const d = date instanceof Date ? date : new Date(date);
        return {
            toDate: () => d,
            seconds: Math.floor(d.getTime() / 1000),
            nanoseconds: 0
        };
    }

    function daysAgo(n) { return new Date(Date.now() - n * DAY); }
    function daysFromNow(n) { return new Date(Date.now() + n * DAY); }

    function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }
    function jitter(base, range) { return base + Math.round((Math.random() - 0.5) * range); }

    // ==================== INDIVIDUAL PERSONA (Alex Morgan) ====================

    function buildIndividualPersona() {
        const user = {
            uid: DEMO_UID,
            email: 'alex.morgan@demo.sleepwellness.com',
            displayName: 'Alex Morgan',
            emailVerified: true,
            isAnonymous: false,
            metadata: {
                creationTime: daysAgo(30).toISOString(),
                lastSignInTime: new Date().toISOString()
            },
            getIdToken: () => Promise.resolve('demo-token'),
            reload: () => Promise.resolve()
        };

        const profile = {
            uid: DEMO_UID,
            email: user.email,
            displayName: 'Alex Morgan',
            phone: '+1 (555) 012-3456',
            clientType: 'individual',
            role: 'client',
            sessionsRemaining: 3,
            totalSessions: 6,
            onboardingComplete: true,
            consentGiven: true,
            consentTimestamp: daysAgo(30),
            createdAt: daysAgo(30),
            lastActive: new Date()
        };

        function diaryEntries() {
            const entries = [];
            const now = new Date();
            for (let i = 13; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const progress = 1 - (i / 13);
                entries.push({
                    id: `diary-${dateStr}`,
                    userId: DEMO_UID,
                    date: dateStr,
                    bedTime: `${22 + (i > 7 ? 1 : 0)}:${i % 2 === 0 ? '30' : '00'}`,
                    wakeTime: `${6 + (i > 7 ? 1 : 0)}:${i % 2 === 0 ? '00' : '30'}`,
                    totalSleepTime: clamp(jitter(330 + Math.round(progress * 90), 30), 300, 480),
                    sleepEfficiency: clamp(jitter(65 + Math.round(progress * 20), 5), 55, 98),
                    sleepOnsetLatency: clamp(jitter(40 - Math.round(progress * 25), 8), 5, 60),
                    wakeAfterSleepOnset: clamp(jitter(50 - Math.round(progress * 30), 10), 5, 70),
                    sleepQuality: clamp(jitter(4 + Math.round(progress * 4), 2), 1, 10),
                    mood: clamp(jitter(5 + Math.round(progress * 4), 2), 3, 10),
                    caffeine: i > 7 ? 3 : (i > 3 ? 2 : 1),
                    alcohol: i > 10 ? 2 : 0,
                    exercise: i % 3 !== 0,
                    notes: i === 0 ? 'Feeling much more rested this week!' : (i === 7 ? 'Started new wind-down routine' : ''),
                    createdAt: makeTimestamp(date)
                });
            }
            return entries;
        }

        function assessments() {
            return [
                {
                    id: 'assess-baseline', odcId: 'assess-baseline', userId: DEMO_UID,
                    type: 'sleep-assessment', overallScore: 62,
                    categories: {
                        sleepQuality: { score: 55, label: 'Sleep Quality' },
                        sleepDuration: { score: 50, label: 'Sleep Duration' },
                        sleepEfficiency: { score: 65, label: 'Sleep Efficiency' },
                        sleepLatency: { score: 60, label: 'Sleep Latency' },
                        daytimeFunction: { score: 70, label: 'Daytime Function' },
                        sleepEnvironment: { score: 75, label: 'Sleep Environment' },
                        sleepHygiene: { score: 58, label: 'Sleep Hygiene' }
                    },
                    recommendations: [
                        'Establish a consistent wake time \u2014 even on weekends',
                        'Reduce caffeine after 2pm',
                        'Create a 30-minute wind-down routine before bed',
                        'Keep bedroom temperature between 65-68\u00b0F'
                    ],
                    completedAt: makeTimestamp(daysAgo(28)),
                    createdAt: makeTimestamp(daysAgo(28))
                },
                {
                    id: 'assess-followup', odcId: 'assess-followup', userId: DEMO_UID,
                    type: 'sleep-assessment', overallScore: 78,
                    categories: {
                        sleepQuality: { score: 75, label: 'Sleep Quality' },
                        sleepDuration: { score: 72, label: 'Sleep Duration' },
                        sleepEfficiency: { score: 82, label: 'Sleep Efficiency' },
                        sleepLatency: { score: 78, label: 'Sleep Latency' },
                        daytimeFunction: { score: 85, label: 'Daytime Function' },
                        sleepEnvironment: { score: 80, label: 'Sleep Environment' },
                        sleepHygiene: { score: 74, label: 'Sleep Hygiene' }
                    },
                    recommendations: [
                        'Great progress! Continue with your wind-down routine',
                        'Consider adding morning light exposure (15-20 min)',
                        'Your sleep efficiency is improving \u2014 keep consistent bed/wake times'
                    ],
                    completedAt: makeTimestamp(daysAgo(3)),
                    createdAt: makeTimestamp(daysAgo(3))
                }
            ];
        }

        function messages() {
            return [
                { id: 'msg-001', senderId: 'admin', senderName: 'Dr. Alen',
                  text: 'Welcome to the Sleep Wellness program, Alex! I\'ve reviewed your initial assessment and set up your personalized plan. Let me know if you have any questions.',
                  timestamp: makeTimestamp(daysAgo(27)), read: true },
                { id: 'msg-002', senderId: DEMO_UID, senderName: 'Alex Morgan',
                  text: 'Thanks Dr. Alen! I\'ve been following the wind-down routine for a week now. My sleep onset is definitely improving \u2014 down from 40 min to about 15 min most nights.',
                  timestamp: makeTimestamp(daysAgo(5)), read: true },
                { id: 'msg-003', senderId: 'admin', senderName: 'Dr. Alen',
                  text: 'That\'s excellent progress! A drop from 40 to 15 minutes is significant. Let\'s review your diary data in our next session and discuss phase 2 of your plan.',
                  timestamp: makeTimestamp(daysAgo(4)), read: true }
            ];
        }

        function appointments() {
            const upcoming = new Date(daysFromNow(5)); upcoming.setHours(10, 0, 0, 0);
            const past = new Date(daysAgo(14)); past.setHours(14, 0, 0, 0);
            return [
                { id: 'appt-001', userId: DEMO_UID, type: 'follow-up', dateTime: makeTimestamp(upcoming),
                  duration: 30, status: 'confirmed', notes: 'Phase 2 review \u2014 sleep efficiency progress',
                  createdAt: makeTimestamp(daysAgo(7)) },
                { id: 'appt-002', userId: DEMO_UID, type: 'initial', dateTime: makeTimestamp(past),
                  duration: 45, status: 'completed', notes: 'Initial consultation \u2014 baseline assessment review',
                  createdAt: makeTimestamp(daysAgo(20)) }
            ];
        }

        function tasks() {
            return [
                { id: 'task-001', clientId: DEMO_UID, title: 'Complete Follow-Up Assessment',
                  description: 'Take the sleep assessment to track your progress after 4 weeks.',
                  type: 'assessment', status: 'pending',
                  dueDate: makeTimestamp(daysFromNow(2)), createdAt: makeTimestamp(daysAgo(3)) },
                { id: 'task-002', clientId: DEMO_UID, title: 'Log Sleep Diary Daily',
                  description: 'Fill in your sleep diary every morning within 30 minutes of waking.',
                  type: 'diary', status: 'pending',
                  dueDate: makeTimestamp(daysFromNow(7)), createdAt: makeTimestamp(daysAgo(14)) },
                { id: 'task-003', clientId: DEMO_UID, title: 'Complete Baseline Assessment',
                  description: 'Take the initial sleep wellness assessment.',
                  type: 'assessment', status: 'completed',
                  completedAt: makeTimestamp(daysAgo(28)), createdAt: makeTimestamp(daysAgo(30)) }
            ];
        }

        function questionnaires() {
            return [
                { id: 'quest-001', userId: DEMO_UID, instrumentId: 'ISI', instrumentName: 'Insomnia Severity Index',
                  questionnaireId: 'ISI', questionnaireName: 'Insomnia Severity Index',
                  status: 'completed', assignedAt: makeTimestamp(daysAgo(25)),
                  completedAt: makeTimestamp(daysAgo(24)), dueDate: makeTimestamp(daysAgo(20)),
                  score: 14, maxScore: 28, interpretation: 'Moderate', color: '#F57C00',
                  result: { totalScore: 14, severity: 'Moderate', answers: {} } },
                { id: 'quest-002', userId: DEMO_UID, instrumentId: 'ESS', instrumentName: 'Epworth Sleepiness Scale',
                  questionnaireId: 'ESS', questionnaireName: 'Epworth Sleepiness Scale',
                  status: 'pending', assignedAt: makeTimestamp(daysAgo(2)),
                  dueDate: makeTimestamp(daysFromNow(5)), notes: 'Please complete before your next session' }
            ];
        }

        function notifications() {
            return [
                { id: 'notif-001', userId: DEMO_UID, type: 'welcome', title: 'Welcome to Sleep Wellness',
                  message: 'Your account is set up and ready. Start by exploring your dashboard!',
                  read: true, createdAt: makeTimestamp(daysAgo(30)) },
                { id: 'notif-002', userId: DEMO_UID, type: 'reminder', title: 'Session Reminder',
                  message: 'Your follow-up session with Dr. Alen is in 5 days.',
                  read: false, createdAt: makeTimestamp(daysAgo(1)) },
                { id: 'notif-003', userId: DEMO_UID, type: 'assignment', title: 'New Questionnaire Assigned',
                  message: 'Dr. Alen has assigned you the Epworth Sleepiness Scale (ESS). Please complete it before your next session.',
                  read: false, createdAt: makeTimestamp(daysAgo(2)) }
            ];
        }

        return {
            user, profile,
            bannerText: '<strong>Demo Mode</strong> \u2014 Exploring with sample data',
            data: {
                diaryEntries: diaryEntries(),
                assessments: assessments(),
                messages: messages(),
                appointments: appointments(),
                tasks: tasks(),
                questionnaires: questionnaires(),
                notifications: notifications()
            },
            // Hotel-specific overrides (not used for individual)
            guestStay: null,
            hotelPartner: null
        };
    }

    // ==================== HOTEL GUEST PERSONA (James Richardson) ====================

    function buildHotelPersona() {
        const checkInDate = daysAgo(3);
        const checkOutDate = daysFromNow(2);

        const user = {
            uid: DEMO_UID,
            email: 'james.richardson@demo.sleepwellness.com',
            displayName: 'James Richardson',
            emailVerified: true,
            isAnonymous: false,
            metadata: {
                creationTime: daysAgo(3).toISOString(),
                lastSignInTime: new Date().toISOString()
            },
            getIdToken: () => Promise.resolve('demo-token-hotel'),
            reload: () => Promise.resolve()
        };

        const profile = {
            uid: DEMO_UID,
            email: user.email,
            displayName: 'James Richardson',
            phone: '+1 (555) 867-5309',
            clientType: 'hotel',
            role: 'client',
            sessionsRemaining: 0,
            totalSessions: 0,
            onboardingComplete: true,
            consentGiven: true,
            consentTimestamp: checkInDate,
            createdAt: checkInDate,
            lastActive: new Date(),
            // Hotel affiliation data for initHotelGuestMode()
            hotelAffiliation: {
                isHotelGuest: true,
                currentStayId: 'stay-demo-001',
                hotelPartnerId: 'hotel-ritz-boston'
            },
            partnerId: 'hotel-ritz-boston'
        };

        // Guest stay object for FirebaseDB.getGuestStay
        const guestStay = {
            id: 'stay-demo-001',
            guestId: DEMO_UID,
            hotelPartnerId: 'hotel-ritz-boston',
            roomNumber: '1205',
            checkInDate: makeTimestamp(checkInDate),
            checkoutDate: makeTimestamp(checkOutDate),
            stayStatus: 'active',
            roomType: 'Deluxe King',
            sleepPackage: 'premium',
            createdAt: makeTimestamp(checkInDate)
        };

        // Hotel partner object for FirebaseDB.getHotelPartner
        const hotelPartner = {
            id: 'hotel-ritz-boston',
            name: 'The Ritz-Carlton, Boston',
            location: 'Boston, MA',
            tier: 'luxury',
            sleepAmenities: ['weighted blanket', 'blackout curtains', 'white noise machine', 'pillow menu', 'aromatherapy diffuser'],
            contactEmail: 'sleepwellness@ritzcarlton-boston.demo',
            active: true
        };

        function diaryEntries() {
            const entries = [];
            const now = new Date();
            // 5 nights of hotel sleep (night 0 = check-in night, showing improvement)
            for (let i = 4; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];

                // Night 0 (check-in): poor sleep (new environment), then improving
                const nightIndex = 4 - i; // 0=first night, 4=latest
                const progress = nightIndex / 4;

                // First-night effect: worse on night 0, steady improvement with amenities
                const baseTST = nightIndex === 0 ? 310 : (340 + Math.round(progress * 80));
                const baseSE = nightIndex === 0 ? 62 : (68 + Math.round(progress * 18));
                const baseSOL = nightIndex === 0 ? 45 : (35 - Math.round(progress * 20));
                const baseQuality = nightIndex === 0 ? 4 : (5 + Math.round(progress * 3));

                const nightNotes = [
                    'First night \u2014 adjusting to new environment',
                    'Tried the weighted blanket, fell asleep faster',
                    'Used blackout mode + white noise machine',
                    'Best hotel sleep in years \u2014 pillow menu was perfect',
                    'Woke up feeling completely refreshed'
                ];

                entries.push({
                    id: `diary-${dateStr}`,
                    userId: DEMO_UID,
                    date: dateStr,
                    bedTime: nightIndex === 0 ? '23:30' : `${22}:${nightIndex % 2 === 0 ? '15' : '30'}`,
                    wakeTime: nightIndex === 0 ? '7:00' : `${6}:${nightIndex % 2 === 0 ? '30' : '45'}`,
                    totalSleepTime: clamp(jitter(baseTST, 15), 280, 470),
                    sleepEfficiency: clamp(jitter(baseSE, 3), 55, 95),
                    sleepOnsetLatency: clamp(jitter(baseSOL, 5), 5, 50),
                    wakeAfterSleepOnset: clamp(jitter(30 - Math.round(progress * 18), 5), 5, 45),
                    sleepQuality: clamp(jitter(baseQuality, 1), 1, 10),
                    mood: clamp(jitter(baseQuality + 1, 1), 3, 10),
                    caffeine: 1,
                    alcohol: nightIndex <= 1 ? 1 : 0,
                    exercise: nightIndex >= 2,
                    notes: nightNotes[nightIndex] || '',
                    createdAt: makeTimestamp(date)
                });
            }
            return entries;
        }

        function assessments() {
            return [
                {
                    id: 'assess-prestay', odcId: 'assess-prestay', userId: DEMO_UID,
                    type: 'sleep-assessment', overallScore: 58,
                    categories: {
                        sleepQuality: { score: 50, label: 'Sleep Quality' },
                        sleepDuration: { score: 52, label: 'Sleep Duration' },
                        sleepEfficiency: { score: 58, label: 'Sleep Efficiency' },
                        sleepLatency: { score: 48, label: 'Sleep Latency' },
                        daytimeFunction: { score: 62, label: 'Daytime Function' },
                        sleepEnvironment: { score: 65, label: 'Sleep Environment' },
                        sleepHygiene: { score: 55, label: 'Sleep Hygiene' }
                    },
                    recommendations: [
                        'Your sleep environment at home may need improvement',
                        'Consider blackout curtains and cooler room temperature',
                        'Reduce screen time 60 minutes before bed',
                        'Try a consistent wind-down routine during your stay'
                    ],
                    completedAt: makeTimestamp(daysAgo(3)),
                    createdAt: makeTimestamp(daysAgo(3))
                },
                {
                    id: 'assess-midstay', odcId: 'assess-midstay', userId: DEMO_UID,
                    type: 'sleep-assessment', overallScore: 72,
                    categories: {
                        sleepQuality: { score: 70, label: 'Sleep Quality' },
                        sleepDuration: { score: 68, label: 'Sleep Duration' },
                        sleepEfficiency: { score: 76, label: 'Sleep Efficiency' },
                        sleepLatency: { score: 72, label: 'Sleep Latency' },
                        daytimeFunction: { score: 78, label: 'Daytime Function' },
                        sleepEnvironment: { score: 82, label: 'Sleep Environment' },
                        sleepHygiene: { score: 66, label: 'Sleep Hygiene' }
                    },
                    recommendations: [
                        'Great improvement! The room environment changes are working',
                        'Keep using the weighted blanket \u2014 it reduced your sleep onset by 20 min',
                        'Consider taking these habits home: blackout curtains, cool temperature (67\u00b0F)'
                    ],
                    completedAt: makeTimestamp(daysAgo(1)),
                    createdAt: makeTimestamp(daysAgo(1))
                }
            ];
        }

        function messages() {
            return [
                { id: 'msg-h01', senderId: 'admin', senderName: 'Sleep Concierge',
                  text: 'Welcome to The Ritz-Carlton, Mr. Richardson! I\'m your Sleep Wellness concierge. Your room has been set up with our premium sleep package: weighted blanket, pillow menu selection, and aromatherapy diffuser. The blackout curtains are voice-activated \u2014 just say "room, blackout mode."',
                  timestamp: makeTimestamp(daysAgo(3)), read: true },
                { id: 'msg-h02', senderId: DEMO_UID, senderName: 'James Richardson',
                  text: 'Thank you! The first night was a bit rough \u2014 I always have trouble sleeping in new places. But the weighted blanket helped a lot. Any other tips?',
                  timestamp: makeTimestamp(daysAgo(2)), read: true },
                { id: 'msg-h03', senderId: 'admin', senderName: 'Sleep Concierge',
                  text: 'The "first-night effect" is completely normal! Tonight, try the white noise machine on the "rainfall" setting and set the thermostat to 67\u00b0F. I\'ve also placed a lavender pillow spray on your nightstand. Your sleep data from last night shows your onset latency was 45 min \u2014 let\'s get that under 15.',
                  timestamp: makeTimestamp(daysAgo(2)), read: true },
                { id: 'msg-h04', senderId: DEMO_UID, senderName: 'James Richardson',
                  text: 'Last night was incredible \u2014 slept 7.5 hours straight! The rainfall sound and cooler temperature made a huge difference. Can I get these products for home?',
                  timestamp: makeTimestamp(daysAgo(1)), read: true },
                { id: 'msg-h05', senderId: 'admin', senderName: 'Sleep Concierge',
                  text: 'Wonderful to hear! I\'ll have our "Sleep Wellness Take-Home" catalog sent to your room. It includes the same weighted blanket, white noise machine, and pillow type. Your checkout sleep report will also include personalized recommendations for recreating this environment at home.',
                  timestamp: makeTimestamp(daysAgo(1)), read: true }
            ];
        }

        function appointments() {
            // Hotel guests don't have typical appointments, but may have a checkout consultation
            const checkoutConsult = new Date(checkOutDate);
            checkoutConsult.setHours(9, 0, 0, 0);
            return [
                { id: 'appt-h01', userId: DEMO_UID, type: 'follow-up',
                  dateTime: makeTimestamp(checkoutConsult), duration: 15,
                  status: 'confirmed', notes: 'Checkout sleep report review \u2014 take-home recommendations',
                  createdAt: makeTimestamp(daysAgo(1)) }
            ];
        }

        function tasks() {
            return [
                { id: 'task-h01', clientId: DEMO_UID, title: 'Try the weighted blanket tonight',
                  description: 'Your room includes a 15 lb weighted blanket. Studies show it reduces sleep onset by 20 minutes on average.',
                  type: 'action', status: 'completed',
                  completedAt: makeTimestamp(daysAgo(2)), createdAt: makeTimestamp(daysAgo(3)) },
                { id: 'task-h02', clientId: DEMO_UID, title: 'Use blackout mode on room controls',
                  description: 'Say "room, blackout mode" or press the moon button on the bedside panel to activate full blackout curtains.',
                  type: 'action', status: 'completed',
                  completedAt: makeTimestamp(daysAgo(1)), createdAt: makeTimestamp(daysAgo(2)) },
                { id: 'task-h03', clientId: DEMO_UID, title: 'Complete morning sleep survey',
                  description: 'A quick 2-minute survey about last night\'s sleep quality. Helps us optimize your room for tonight.',
                  type: 'assessment', status: 'pending',
                  dueDate: makeTimestamp(daysFromNow(0)), createdAt: makeTimestamp(daysAgo(1)) }
            ];
        }

        function questionnaires() {
            return [
                { id: 'quest-h01', userId: DEMO_UID, instrumentId: 'HOTEL-EVE', instrumentName: 'Evening Check-In',
                  questionnaireId: 'HOTEL-EVE', questionnaireName: 'Evening Check-In',
                  status: 'completed', assignedAt: makeTimestamp(daysAgo(2)),
                  completedAt: makeTimestamp(daysAgo(2)), dueDate: makeTimestamp(daysAgo(1)),
                  score: 8, maxScore: 10, interpretation: 'Ready for Sleep', color: '#4CAF50',
                  result: { totalScore: 8, severity: 'Good', answers: {} } },
                { id: 'quest-h02', userId: DEMO_UID, instrumentId: 'HOTEL-MORN', instrumentName: 'Morning Sleep Assessment',
                  questionnaireId: 'HOTEL-MORN', questionnaireName: 'Morning Sleep Assessment',
                  status: 'pending', assignedAt: makeTimestamp(daysAgo(0)),
                  dueDate: makeTimestamp(daysFromNow(0)),
                  notes: 'Rate last night\'s sleep to help us optimize your room for tonight' }
            ];
        }

        function notifications() {
            return [
                { id: 'notif-h01', userId: DEMO_UID, type: 'welcome',
                  title: 'Welcome to Sleep Wellness at The Ritz-Carlton',
                  message: 'Your premium sleep package is ready in Room 1205. Explore your dashboard for personalized sleep tips.',
                  read: true, createdAt: makeTimestamp(daysAgo(3)) },
                { id: 'notif-h02', userId: DEMO_UID, type: 'score',
                  title: 'Your sleep score improved to 72!',
                  message: 'Up from 58 at check-in. The room environment optimizations are making a real difference.',
                  read: false, createdAt: makeTimestamp(daysAgo(1)) },
                { id: 'notif-h03', userId: DEMO_UID, type: 'recommendation',
                  title: 'New room adjustment recommendation',
                  message: 'Based on last night\'s data: try setting the thermostat to 66\u00b0F and using the "ocean waves" white noise preset tonight.',
                  read: false, createdAt: makeTimestamp(daysAgo(0)) }
            ];
        }

        return {
            user, profile,
            bannerText: '<strong>Hotel Guest Demo</strong> \u2014 Exploring the Sleep Wellness hotel experience',
            data: {
                diaryEntries: diaryEntries(),
                assessments: assessments(),
                messages: messages(),
                appointments: appointments(),
                tasks: tasks(),
                questionnaires: questionnaires(),
                notifications: notifications()
            },
            guestStay,
            hotelPartner
        };
    }

    // ==================== ATHLETE PERSONA (Marcus Thompson) ====================

    function buildAthletePersona() {
        const user = {
            uid: DEMO_UID,
            email: 'marcus.thompson@demo.sleepwellness.com',
            displayName: 'Marcus Thompson',
            emailVerified: true,
            isAnonymous: false,
            metadata: {
                creationTime: daysAgo(60).toISOString(),
                lastSignInTime: new Date().toISOString()
            },
            getIdToken: () => Promise.resolve('demo-token-athlete'),
            reload: () => Promise.resolve()
        };

        const profile = {
            uid: DEMO_UID,
            email: user.email,
            displayName: 'Marcus Thompson',
            phone: '+1 (555) 243-7890',
            clientType: 'athlete',
            role: 'client',
            sessionsRemaining: 5,
            totalSessions: 12,
            onboardingComplete: true,
            consentGiven: true,
            consentTimestamp: daysAgo(60),
            createdAt: daysAgo(60),
            lastActive: new Date(),
            sport: 'Basketball',
            team: 'Boston Celtics',
            position: 'Point Guard',
            age: 27,
            sex: 'male',
            height: '6\'2"',
            weight: '195',
            timezone: 'America/New_York',
            sleepGoal: '8.5',
            notes: 'Focus on game-day protocols and travel recovery. History of difficulty sleeping after late games.',
            athleteMetrics: {
                recoveryScore: 85,
                reactionTimeTrend: [248, 245, 251, 239, 242, 236, 233, 238, 231, 228, 235, 226, 224, 229],
                averageHRV: 68,
                peakPerformanceWindow: '2:00 PM - 6:00 PM'
            }
        };

        function diaryEntries() {
            const entries = [];
            const now = new Date();

            // 14 days showing game-day vs rest-day patterns
            // Games on days 13, 10, 8, 5, 3, 1 (counting back from today)
            const gameDays = new Set([13, 10, 8, 5, 3, 1]);
            // Travel days: day before away games
            const travelDays = new Set([11, 6]);

            for (let i = 13; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];

                const isGameDay = gameDays.has(i);
                const isTravelDay = travelDays.has(i);
                const isPostGame = gameDays.has(i + 1);
                const progress = 1 - (i / 13); // overall improvement trend

                // Game days: later bedtime (adrenaline), worse sleep
                // Rest days: better sleep, following protocol
                // Travel days: disrupted
                let baseTST, baseSE, baseSOL, baseWASO, baseQuality, bedHour, bedMin, wakeHour;

                if (isGameDay) {
                    bedHour = 23; bedMin = '45';
                    wakeHour = 8;
                    baseTST = 370 + Math.round(progress * 40);
                    baseSE = 68 + Math.round(progress * 10);
                    baseSOL = 35 - Math.round(progress * 15);
                    baseWASO = 40 - Math.round(progress * 15);
                    baseQuality = 5 + Math.round(progress * 2);
                } else if (isTravelDay) {
                    bedHour = 23; bedMin = '15';
                    wakeHour = 7;
                    baseTST = 350 + Math.round(progress * 30);
                    baseSE = 65 + Math.round(progress * 12);
                    baseSOL = 40 - Math.round(progress * 18);
                    baseWASO = 35 - Math.round(progress * 12);
                    baseQuality = 4 + Math.round(progress * 2);
                } else if (isPostGame) {
                    bedHour = 0; bedMin = '30'; // post-game = very late from previous night
                    wakeHour = 9;
                    baseTST = 390 + Math.round(progress * 50);
                    baseSE = 72 + Math.round(progress * 12);
                    baseSOL = 25 - Math.round(progress * 12);
                    baseWASO = 30 - Math.round(progress * 15);
                    baseQuality = 6 + Math.round(progress * 2);
                } else {
                    // Rest day: protocol followed, good sleep
                    bedHour = 22; bedMin = '15';
                    wakeHour = 7;
                    baseTST = 420 + Math.round(progress * 60);
                    baseSE = 80 + Math.round(progress * 12);
                    baseSOL = 15 - Math.round(progress * 8);
                    baseWASO = 15 - Math.round(progress * 8);
                    baseQuality = 7 + Math.round(progress * 2);
                }

                const gameNotes = isGameDay ? 'Game day \u2014 home vs. ' + ['76ers', 'Knicks', 'Heat', 'Bucks', 'Hawks', 'Nets'][i % 6]
                    : isTravelDay ? 'Travel day \u2014 flight to away game'
                    : isPostGame ? 'Recovery day after game'
                    : (i === 0 ? 'Rest day \u2014 recovery protocol, feeling sharp' : 'Rest day \u2014 followed sleep protocol');

                entries.push({
                    id: `diary-${dateStr}`,
                    userId: DEMO_UID,
                    date: dateStr,
                    bedTime: `${bedHour}:${bedMin}`,
                    wakeTime: `${wakeHour}:${i % 2 === 0 ? '00' : '15'}`,
                    totalSleepTime: clamp(jitter(baseTST, 20), 300, 540),
                    sleepEfficiency: clamp(jitter(baseSE, 4), 55, 98),
                    sleepOnsetLatency: clamp(jitter(baseSOL, 5), 5, 50),
                    wakeAfterSleepOnset: clamp(jitter(baseWASO, 5), 5, 50),
                    sleepQuality: clamp(jitter(baseQuality, 1), 1, 10),
                    mood: clamp(jitter(baseQuality + 1, 1), 3, 10),
                    caffeine: isGameDay ? 2 : 1,
                    alcohol: 0,
                    exercise: true,
                    notes: gameNotes,
                    // Athlete-specific extras
                    isGameDay: isGameDay,
                    isTravelDay: isTravelDay,
                    createdAt: makeTimestamp(date)
                });
            }
            return entries;
        }

        function assessments() {
            return [
                {
                    id: 'assess-preseason', odcId: 'assess-preseason', userId: DEMO_UID,
                    type: 'sleep-assessment', overallScore: 65,
                    categories: {
                        sleepQuality: { score: 60, label: 'Sleep Quality' },
                        sleepDuration: { score: 55, label: 'Sleep Duration' },
                        sleepEfficiency: { score: 68, label: 'Sleep Efficiency' },
                        sleepLatency: { score: 58, label: 'Sleep Latency' },
                        daytimeFunction: { score: 72, label: 'Daytime Function' },
                        sleepEnvironment: { score: 70, label: 'Sleep Environment' },
                        sleepHygiene: { score: 62, label: 'Sleep Hygiene' }
                    },
                    recommendations: [
                        'Game-day sleep is suffering \u2014 implement a 90-min wind-down protocol post-game',
                        'Travel days: use melatonin (0.5 mg) at destination bedtime to reset circadian rhythm',
                        'Reduce blue light exposure after 8 PM on all days',
                        'Target 8.5 hours sleep opportunity on rest days to build sleep reserves'
                    ],
                    completedAt: makeTimestamp(daysAgo(45)),
                    createdAt: makeTimestamp(daysAgo(45))
                },
                {
                    id: 'assess-midseason', odcId: 'assess-midseason', userId: DEMO_UID,
                    type: 'sleep-assessment', overallScore: 79,
                    categories: {
                        sleepQuality: { score: 78, label: 'Sleep Quality' },
                        sleepDuration: { score: 72, label: 'Sleep Duration' },
                        sleepEfficiency: { score: 84, label: 'Sleep Efficiency' },
                        sleepLatency: { score: 80, label: 'Sleep Latency' },
                        daytimeFunction: { score: 85, label: 'Daytime Function' },
                        sleepEnvironment: { score: 82, label: 'Sleep Environment' },
                        sleepHygiene: { score: 76, label: 'Sleep Hygiene' }
                    },
                    recommendations: [
                        'Excellent improvement! Game-day sleep onset is down from 35 to 18 min',
                        'Your reaction time has improved 9% \u2014 correlating with better sleep consistency',
                        'Continue melatonin protocol for travel days \u2014 it\'s working',
                        'Next focus: optimize post-game nutrition timing for faster sleep onset'
                    ],
                    completedAt: makeTimestamp(daysAgo(5)),
                    createdAt: makeTimestamp(daysAgo(5))
                }
            ];
        }

        function messages() {
            return [
                { id: 'msg-a01', senderId: 'admin', senderName: 'Dr. Alen \u2014 Team Sleep Coach',
                  text: 'Welcome to the Celtics Sleep Performance Program, Marcus! I\'ve reviewed your pre-season baseline and created a game-day protocol tailored to your schedule. Key focus: post-game wind-down and travel sleep management.',
                  timestamp: makeTimestamp(daysAgo(44)), read: true },
                { id: 'msg-a02', senderId: DEMO_UID, senderName: 'Marcus Thompson',
                  text: 'The post-game protocol is a game-changer. I\'m falling asleep 20 minutes faster after games. The cold shower + magnesium combo before bed really works.',
                  timestamp: makeTimestamp(daysAgo(7)), read: true },
                { id: 'msg-a03', senderId: 'admin', senderName: 'Dr. Alen \u2014 Team Sleep Coach',
                  text: 'Great to hear! Your HRV data confirms it \u2014 recovery scores are up 15% on post-game mornings. For tomorrow\'s game, remember: no caffeine after 2 PM, start wind-down at 10:30 PM if it\'s a 7:30 tipoff.',
                  timestamp: makeTimestamp(daysAgo(6)), read: true },
                { id: 'msg-a04', senderId: DEMO_UID, senderName: 'Marcus Thompson',
                  text: 'We\'ve got a road game Friday \u2014 flying to Milwaukee. Should I adjust the melatonin timing since it\'s the same timezone?',
                  timestamp: makeTimestamp(daysAgo(3)), read: true },
                { id: 'msg-a05', senderId: 'admin', senderName: 'Dr. Alen \u2014 Team Sleep Coach',
                  text: 'Same timezone, so no melatonin shift needed. But hotel sleep can be disrupted \u2014 bring your own pillow and the portable white noise machine. Request room temp at 66\u00b0F at check-in. Your travel-day checklist is updated in Tasks.',
                  timestamp: makeTimestamp(daysAgo(2)), read: true }
            ];
        }

        function appointments() {
            const upcoming = new Date(daysFromNow(4)); upcoming.setHours(11, 0, 0, 0);
            const past = new Date(daysAgo(10)); past.setHours(10, 0, 0, 0);
            return [
                { id: 'appt-a01', userId: DEMO_UID, type: 'follow-up',
                  dateTime: makeTimestamp(upcoming), duration: 30,
                  status: 'confirmed', notes: 'Mid-season review \u2014 game-day sleep patterns & recovery metrics',
                  createdAt: makeTimestamp(daysAgo(5)) },
                { id: 'appt-a02', userId: DEMO_UID, type: 'initial',
                  dateTime: makeTimestamp(past), duration: 45,
                  status: 'completed', notes: 'Bi-weekly check-in \u2014 travel protocol adjustment',
                  createdAt: makeTimestamp(daysAgo(14)) }
            ];
        }

        function tasks() {
            return [
                { id: 'task-a01', clientId: DEMO_UID, title: 'No screens 90 min before bed',
                  description: 'Use blue-light blocking glasses if you must use a device. Prefer audiobooks or music for pre-sleep routine.',
                  type: 'action', status: 'pending',
                  dueDate: makeTimestamp(daysFromNow(1)), createdAt: makeTimestamp(daysAgo(7)) },
                { id: 'task-a02', clientId: DEMO_UID, title: 'Take melatonin at 9:30 PM (travel day)',
                  description: '0.5 mg melatonin, 90 minutes before target sleep time. Only on travel/away-game days.',
                  type: 'action', status: 'pending',
                  dueDate: makeTimestamp(daysFromNow(3)), createdAt: makeTimestamp(daysAgo(2)) },
                { id: 'task-a03', clientId: DEMO_UID, title: 'Complete recovery questionnaire',
                  description: 'Post-game recovery survey \u2014 track how last night\'s game affected your sleep and readiness.',
                  type: 'assessment', status: 'pending',
                  dueDate: makeTimestamp(daysFromNow(0)), createdAt: makeTimestamp(daysAgo(1)) },
                { id: 'task-a04', clientId: DEMO_UID, title: 'Implement post-game wind-down protocol',
                  description: 'Cold shower (2 min), magnesium glycinate (400 mg), 10 min guided breathing.',
                  type: 'action', status: 'completed',
                  completedAt: makeTimestamp(daysAgo(1)), createdAt: makeTimestamp(daysAgo(14)) }
            ];
        }

        function questionnaires() {
            return [
                { id: 'quest-a01', userId: DEMO_UID, instrumentId: 'ATHLETE-SCREEN', instrumentName: 'Athlete Sleep Screening',
                  questionnaireId: 'ATHLETE-SCREEN', questionnaireName: 'Athlete Sleep Screening',
                  status: 'completed', assignedAt: makeTimestamp(daysAgo(45)),
                  completedAt: makeTimestamp(daysAgo(44)), dueDate: makeTimestamp(daysAgo(40)),
                  score: 18, maxScore: 30, interpretation: 'Moderate Risk', color: '#F57C00',
                  result: { totalScore: 18, severity: 'Moderate Risk', answers: {} } },
                { id: 'quest-a02', userId: DEMO_UID, instrumentId: 'POST-GAME-RECOVERY', instrumentName: 'Post-Game Recovery Survey',
                  questionnaireId: 'POST-GAME-RECOVERY', questionnaireName: 'Post-Game Recovery Survey',
                  status: 'pending', assignedAt: makeTimestamp(daysAgo(1)),
                  dueDate: makeTimestamp(daysFromNow(1)),
                  notes: 'Rate your recovery after last night\'s game' }
            ];
        }

        function notifications() {
            return [
                { id: 'notif-a01', userId: DEMO_UID, type: 'protocol',
                  title: 'Game-day sleep protocol activated',
                  message: 'You have a home game tonight. Reminder: no caffeine after 2 PM, wind-down starts 90 min post-game.',
                  read: false, createdAt: makeTimestamp(daysAgo(1)) },
                { id: 'notif-a02', userId: DEMO_UID, type: 'score',
                  title: 'Your recovery score: 85%',
                  message: 'Your 7-day average sleep quality is trending up. Reaction time improved 9% since pre-season.',
                  read: false, createdAt: makeTimestamp(daysAgo(0)) },
                { id: 'notif-a03', userId: DEMO_UID, type: 'reminder',
                  title: 'Post-game recovery survey due',
                  message: 'Quick 2-minute survey to track how last night\'s game affected your sleep. Tap to complete.',
                  read: false, createdAt: makeTimestamp(daysAgo(0)) }
            ];
        }

        return {
            user, profile,
            bannerText: '<strong>Athlete Demo</strong> \u2014 Exploring the Sleep Wellness sports performance program',
            data: {
                diaryEntries: diaryEntries(),
                assessments: assessments(),
                messages: messages(),
                appointments: appointments(),
                tasks: tasks(),
                questionnaires: questionnaires(),
                notifications: notifications()
            },
            guestStay: null,
            hotelPartner: null
        };
    }

    // ==================== BUILD ACTIVE PERSONA ====================

    const personaBuilders = {
        individual: buildIndividualPersona,
        hotel: buildHotelPersona,
        athlete: buildAthletePersona
    };

    const activePersona = personaBuilders[PERSONA]();
    const DEMO_USER = activePersona.user;
    const DEMO_PROFILE = activePersona.profile;
    const demoData = activePersona.data;

    // ==================== DEMO TOAST ====================

    function showDemoToast(msg) {
        const existing = document.getElementById('demo-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'demo-toast';
        toast.textContent = msg || 'This action is disabled in demo mode';
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1a2744',
            color: '#c9a962',
            padding: '12px 24px',
            fontSize: '13px',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: '500',
            zIndex: '100001',
            opacity: '0',
            transition: 'opacity 0.3s',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        });
        document.body.appendChild(toast);
        requestAnimationFrame(() => { toast.style.opacity = '1'; });
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // ==================== FIREBASEDB OVERRIDES ====================

    function overrideFirebaseDB() {
        if (typeof FirebaseDB === 'undefined') {
            console.warn('[Demo Mode] FirebaseDB not found, retrying...');
            setTimeout(overrideFirebaseDB, 50);
            return;
        }

        // --- Read methods: return demo data ---

        FirebaseDB.getUserProfile = async (uid) => {
            return DEMO_PROFILE;
        };

        FirebaseDB.isAdmin = async (uid) => {
            return false;
        };

        FirebaseDB.getUserAssessments = async (userId) => {
            return demoData.assessments;
        };

        FirebaseDB.getDiaryEntries = async (userId, limit) => {
            const entries = demoData.diaryEntries;
            return limit ? entries.slice(-limit) : entries;
        };

        FirebaseDB.getUserAppointments = async (userId) => {
            return demoData.appointments;
        };

        FirebaseDB.getUserUnlocks = async (userId) => {
            return [
                { id: 'unlock-001', moduleId: 'sleep-science', moduleName: 'Sleep Science Fundamentals', grantedAt: makeTimestamp(daysAgo(28)) }
            ];
        };

        FirebaseDB.getOrCreateConversation = async (userId, adminId) => {
            return { id: 'demo-conversation', participants: [userId, adminId], createdAt: makeTimestamp(new Date()) };
        };

        FirebaseDB.getMessagesListener = (conversationId, callback) => {
            // Fire callback once with demo messages
            setTimeout(() => callback(demoData.messages), 100);
            // Return unsubscribe function
            return () => {};
        };

        FirebaseDB.getUserTasks = async (userId, status) => {
            if (status === 'completed') return demoData.tasks.filter(t => t.status === 'completed');
            if (status === 'pending') return demoData.tasks.filter(t => t.status === 'pending');
            return demoData.tasks;
        };

        FirebaseDB.getUserQuestionnaires = async (userId) => {
            return demoData.questionnaires;
        };

        FirebaseDB.getUserPendingQuestionnaires = async (userId) => {
            return demoData.questionnaires.filter(q => q.status === 'pending');
        };

        FirebaseDB.getQuestionnaireAssignment = async (assignmentId) => {
            return demoData.questionnaires.find(q => q.id === assignmentId) || null;
        };

        FirebaseDB.getUserQuestionnaireResults = async (userId) => {
            return demoData.questionnaires.filter(q => q.status === 'completed');
        };

        FirebaseDB.getUnreadNotifications = async (userId) => {
            return demoData.notifications.filter(n => !n.read);
        };

        FirebaseDB.getUserModuleRequests = async (userId) => {
            return [];
        };

        FirebaseDB.hasRequestedModule = async (userId, moduleId) => {
            return false;
        };

        // --- Hotel-specific read methods ---

        FirebaseDB.getGuestStay = async (stayId) => {
            return activePersona.guestStay || null;
        };

        FirebaseDB.getHotelPartner = async (partnerId) => {
            return activePersona.hotelPartner || null;
        };

        // --- Write methods: show toast, no-op ---

        FirebaseDB.saveDiaryEntry = async (userId, entry) => {
            showDemoToast('Demo mode \u2014 diary entry not saved');
            return { id: 'demo-diary-new' };
        };

        FirebaseDB.saveAssessment = async (userId, results) => {
            showDemoToast('Demo mode \u2014 assessment not saved');
            return { id: 'demo-assess-new' };
        };

        FirebaseDB.sendMessage = async (conversationId, senderId, text) => {
            showDemoToast('Demo mode \u2014 message not sent');
            return { id: 'demo-msg-new' };
        };

        FirebaseDB.createAppointment = async (userId, data) => {
            showDemoToast('Demo mode \u2014 appointment not created');
            return { id: 'demo-appt-new' };
        };

        FirebaseDB.completeTask = async (taskId) => {
            showDemoToast('Demo mode \u2014 task not updated');
        };

        FirebaseDB.requestModuleAccess = async (userId, moduleId, moduleName, reason) => {
            showDemoToast('Demo mode \u2014 request not sent');
            return { id: 'demo-req-new' };
        };

        FirebaseDB.startQuestionnaire = async (assignmentId) => {
            showDemoToast('Demo mode \u2014 questionnaire not started');
        };

        FirebaseDB.submitQuestionnaireResult = async (assignmentId, answers, result) => {
            showDemoToast('Demo mode \u2014 results not submitted');
        };

        FirebaseDB.markNotificationRead = async (notificationId) => {
            // Silently mark as read in local data
            const notif = demoData.notifications.find(n => n.id === notificationId);
            if (notif) notif.read = true;
        };

        FirebaseDB.createUserProfile = async (user, data) => {
            return DEMO_PROFILE;
        };

        FirebaseDB.createNotification = async () => {};
        FirebaseDB.createClientTask = async () => {};

        console.log('[Demo Mode] FirebaseDB methods overridden');
    }

    // ==================== AUTH OVERRIDE ====================

    function overrideAuth() {
        // Prevent real Firebase auth from redirecting
        if (typeof auth !== 'undefined' && auth.onAuthStateChanged) {
            const originalOnAuthStateChanged = auth.onAuthStateChanged.bind(auth);
            auth.onAuthStateChanged = function(callback) {
                // Wrap the callback to inject demo user
                const wrappedCallback = (user) => {
                    if (!user && isDemoMode()) {
                        // Instead of getting null (which triggers redirect), inject demo user
                        callback(DEMO_USER);
                        return;
                    }
                    callback(user);
                };
                return originalOnAuthStateChanged(wrappedCallback);
            };
        }

        // Override Auth.logout to exit demo mode
        if (typeof Auth !== 'undefined') {
            Auth.logout = function() {
                sessionStorage.removeItem('demoMode');
                sessionStorage.removeItem('demoPersona');
                window.location.href = 'auth.html';
            };
            Auth.isLoggedIn = function() { return true; };
            Auth.isAdmin = function() { return false; };
            Auth.requireAuth = function() {};
        }
    }

    // ==================== DEMO BANNER ====================

    function showDemoBanner() {
        const banner = document.createElement('div');
        banner.id = 'demo-banner';
        banner.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 15px; flex-wrap: wrap;">
                <span style="font-size: 13px;">
                    ${activePersona.bannerText}
                </span>
                <a href="auth.html" onclick="sessionStorage.removeItem('demoMode'); sessionStorage.removeItem('demoPersona');"
                   style="background: white; color: #1a2744; padding: 6px 18px; font-size: 12px; font-weight: 600; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 2px;">
                    Sign Up for Real
                </a>
            </div>
        `;
        Object.assign(banner.style, {
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(135deg, #1a2744, #243352)',
            color: '#c9a962',
            padding: '10px 20px',
            textAlign: 'center',
            zIndex: '100000',
            fontFamily: 'Montserrat, sans-serif',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.2)'
        });
        document.body.appendChild(banner);
        // Add bottom padding to body so banner doesn't overlap content
        document.body.style.paddingBottom = '50px';
    }

    // ==================== INIT ====================

    // Override FirebaseDB as soon as it's available
    overrideFirebaseDB();

    // Override auth when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            overrideAuth();
            showDemoBanner();
        });
    } else {
        overrideAuth();
        showDemoBanner();
    }

    // Expose for external checks
    window.isDemoMode = isDemoMode;
    window.getDemoPersona = getDemoPersona;
    window.DEMO_USER = DEMO_USER;
    window.DEMO_PROFILE = DEMO_PROFILE;

})();
