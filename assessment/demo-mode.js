/**
 * Demo Mode for Sleep Wellness Client Portal
 *
 * Detects ?demo=true URL param, overrides FirebaseDB methods with mock data,
 * and creates fake auth objects so the dashboard works without Firebase.
 */

(function() {
    'use strict';

    // ==================== DETECTION ====================

    function isDemoMode() {
        return new URLSearchParams(window.location.search).get('demo') === 'true'
            || sessionStorage.getItem('demoMode') === 'true';
    }

    if (!isDemoMode()) return;

    // Persist across navigation within the session
    sessionStorage.setItem('demoMode', 'true');

    console.log('[Demo Mode] Activated');

    // ==================== DEMO USER CONSTANTS ====================

    const DEMO_UID = 'demo-user-001';

    const DEMO_USER = {
        uid: DEMO_UID,
        email: 'alex.morgan@demo.sleepwellness.com',
        displayName: 'Alex Morgan',
        emailVerified: true,
        isAnonymous: false,
        metadata: {
            creationTime: new Date(Date.now() - 30 * 86400000).toISOString(),
            lastSignInTime: new Date().toISOString()
        },
        getIdToken: () => Promise.resolve('demo-token'),
        reload: () => Promise.resolve()
    };

    const DEMO_PROFILE = {
        uid: DEMO_UID,
        email: DEMO_USER.email,
        displayName: 'Alex Morgan',
        phone: '+1 (555) 012-3456',
        clientType: 'athlete',
        role: 'client',
        sessionsRemaining: 3,
        totalSessions: 6,
        onboardingComplete: true,
        consentGiven: true,
        consentTimestamp: new Date(Date.now() - 30 * 86400000),
        createdAt: new Date(Date.now() - 30 * 86400000),
        lastActive: new Date()
    };

    // ==================== DEMO DATA GENERATORS ====================

    function makeTimestamp(date) {
        const d = date instanceof Date ? date : new Date(date);
        return {
            toDate: () => d,
            seconds: Math.floor(d.getTime() / 1000),
            nanoseconds: 0
        };
    }

    function generateDiaryEntries() {
        const entries = [];
        const now = new Date();
        for (let i = 13; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // Gradually improving sleep over 2 weeks
            const progress = 1 - (i / 13);
            const baseTST = 330 + Math.round(progress * 90) + Math.round((Math.random() - 0.5) * 30);
            const baseSE = 65 + Math.round(progress * 20) + Math.round((Math.random() - 0.5) * 5);
            const baseSOL = 40 - Math.round(progress * 25) + Math.round((Math.random() - 0.5) * 8);
            const baseWASO = 50 - Math.round(progress * 30) + Math.round((Math.random() - 0.5) * 10);
            const baseQuality = 4 + Math.round(progress * 4) + Math.round((Math.random() - 0.5) * 2);

            entries.push({
                id: `diary-${dateStr}`,
                userId: DEMO_UID,
                date: dateStr,
                bedTime: `${22 + (i > 7 ? 1 : 0)}:${i % 2 === 0 ? '30' : '00'}`,
                wakeTime: `${6 + (i > 7 ? 1 : 0)}:${i % 2 === 0 ? '00' : '30'}`,
                totalSleepTime: Math.max(300, Math.min(480, baseTST)),
                sleepEfficiency: Math.max(55, Math.min(98, baseSE)),
                sleepOnsetLatency: Math.max(5, Math.min(60, baseSOL)),
                wakeAfterSleepOnset: Math.max(5, Math.min(70, baseWASO)),
                sleepQuality: Math.max(1, Math.min(10, baseQuality)),
                mood: Math.max(3, Math.min(10, baseQuality + Math.round((Math.random() - 0.3) * 2))),
                caffeine: i > 7 ? 3 : (i > 3 ? 2 : 1),
                alcohol: i > 10 ? 2 : 0,
                exercise: i % 3 !== 0,
                notes: i === 0 ? 'Feeling much more rested this week!' : (i === 7 ? 'Started new wind-down routine' : ''),
                createdAt: makeTimestamp(date)
            });
        }
        return entries;
    }

    function generateAssessments() {
        const now = new Date();
        return [
            {
                id: 'assess-baseline',
                odcId: 'assess-baseline',
                userId: DEMO_UID,
                type: 'sleep-assessment',
                overallScore: 62,
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
                    'Establish a consistent wake time — even on weekends',
                    'Reduce caffeine after 2pm',
                    'Create a 30-minute wind-down routine before bed',
                    'Keep bedroom temperature between 65-68°F'
                ],
                completedAt: makeTimestamp(new Date(now.getTime() - 28 * 86400000)),
                createdAt: makeTimestamp(new Date(now.getTime() - 28 * 86400000))
            },
            {
                id: 'assess-followup',
                odcId: 'assess-followup',
                userId: DEMO_UID,
                type: 'sleep-assessment',
                overallScore: 78,
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
                    'Your sleep efficiency is improving — keep consistent bed/wake times'
                ],
                completedAt: makeTimestamp(new Date(now.getTime() - 3 * 86400000)),
                createdAt: makeTimestamp(new Date(now.getTime() - 3 * 86400000))
            }
        ];
    }

    function generateMessages() {
        const now = new Date();
        return [
            {
                id: 'msg-001',
                senderId: 'admin',
                senderName: 'Dr. Alen',
                text: 'Welcome to the Sleep Wellness program, Alex! I\'ve reviewed your initial assessment and set up your personalized plan. Let me know if you have any questions.',
                timestamp: makeTimestamp(new Date(now.getTime() - 27 * 86400000)),
                read: true
            },
            {
                id: 'msg-002',
                senderId: DEMO_UID,
                senderName: 'Alex Morgan',
                text: 'Thanks Dr. Alen! I\'ve been following the wind-down routine for a week now. My sleep onset is definitely improving — down from 40 min to about 15 min most nights.',
                timestamp: makeTimestamp(new Date(now.getTime() - 5 * 86400000)),
                read: true
            },
            {
                id: 'msg-003',
                senderId: 'admin',
                senderName: 'Dr. Alen',
                text: 'That\'s excellent progress! A drop from 40 to 15 minutes is significant. Let\'s review your diary data in our next session and discuss phase 2 of your plan.',
                timestamp: makeTimestamp(new Date(now.getTime() - 4 * 86400000)),
                read: true
            }
        ];
    }

    function generateAppointments() {
        const now = new Date();
        const upcoming = new Date(now);
        upcoming.setDate(upcoming.getDate() + 5);
        upcoming.setHours(10, 0, 0, 0);

        const past = new Date(now);
        past.setDate(past.getDate() - 14);
        past.setHours(14, 0, 0, 0);

        return [
            {
                id: 'appt-001',
                userId: DEMO_UID,
                type: 'follow-up',
                dateTime: makeTimestamp(upcoming),
                duration: 30,
                status: 'confirmed',
                notes: 'Phase 2 review — sleep efficiency progress',
                createdAt: makeTimestamp(new Date(now.getTime() - 7 * 86400000))
            },
            {
                id: 'appt-002',
                userId: DEMO_UID,
                type: 'initial',
                dateTime: makeTimestamp(past),
                duration: 45,
                status: 'completed',
                notes: 'Initial consultation — baseline assessment review',
                createdAt: makeTimestamp(new Date(now.getTime() - 20 * 86400000))
            }
        ];
    }

    function generateTasks() {
        const now = new Date();
        return [
            {
                id: 'task-001',
                clientId: DEMO_UID,
                title: 'Complete Follow-Up Assessment',
                description: 'Take the sleep assessment to track your progress after 4 weeks.',
                type: 'assessment',
                status: 'pending',
                dueDate: makeTimestamp(new Date(now.getTime() + 2 * 86400000)),
                createdAt: makeTimestamp(new Date(now.getTime() - 3 * 86400000))
            },
            {
                id: 'task-002',
                clientId: DEMO_UID,
                title: 'Log Sleep Diary Daily',
                description: 'Fill in your sleep diary every morning within 30 minutes of waking.',
                type: 'diary',
                status: 'pending',
                dueDate: makeTimestamp(new Date(now.getTime() + 7 * 86400000)),
                createdAt: makeTimestamp(new Date(now.getTime() - 14 * 86400000))
            },
            {
                id: 'task-003',
                clientId: DEMO_UID,
                title: 'Complete Baseline Assessment',
                description: 'Take the initial sleep wellness assessment.',
                type: 'assessment',
                status: 'completed',
                completedAt: makeTimestamp(new Date(now.getTime() - 28 * 86400000)),
                createdAt: makeTimestamp(new Date(now.getTime() - 30 * 86400000))
            }
        ];
    }

    function generateQuestionnaires() {
        const now = new Date();
        return [
            {
                id: 'quest-001',
                userId: DEMO_UID,
                instrumentId: 'ISI',
                instrumentName: 'Insomnia Severity Index',
                status: 'completed',
                assignedAt: makeTimestamp(new Date(now.getTime() - 25 * 86400000)),
                completedAt: makeTimestamp(new Date(now.getTime() - 24 * 86400000)),
                dueDate: makeTimestamp(new Date(now.getTime() - 20 * 86400000)),
                result: {
                    totalScore: 14,
                    severity: 'Moderate',
                    answers: {}
                }
            },
            {
                id: 'quest-002',
                userId: DEMO_UID,
                instrumentId: 'ESS',
                instrumentName: 'Epworth Sleepiness Scale',
                status: 'pending',
                assignedAt: makeTimestamp(new Date(now.getTime() - 2 * 86400000)),
                dueDate: makeTimestamp(new Date(now.getTime() + 5 * 86400000)),
                notes: 'Please complete before your next session'
            }
        ];
    }

    function generateNotifications() {
        const now = new Date();
        return [
            {
                id: 'notif-001',
                userId: DEMO_UID,
                type: 'welcome',
                title: 'Welcome to Sleep Wellness',
                message: 'Your account is set up and ready. Start by exploring your dashboard!',
                read: true,
                createdAt: makeTimestamp(new Date(now.getTime() - 30 * 86400000))
            },
            {
                id: 'notif-002',
                userId: DEMO_UID,
                type: 'reminder',
                title: 'Session Reminder',
                message: 'Your follow-up session with Dr. Alen is in 5 days.',
                read: false,
                createdAt: makeTimestamp(new Date(now.getTime() - 1 * 86400000))
            },
            {
                id: 'notif-003',
                userId: DEMO_UID,
                type: 'assignment',
                title: 'New Questionnaire Assigned',
                message: 'Dr. Alen has assigned you the Epworth Sleepiness Scale (ESS). Please complete it before your next session.',
                read: false,
                createdAt: makeTimestamp(new Date(now.getTime() - 2 * 86400000))
            }
        ];
    }

    // ==================== CACHED DATA ====================

    const demoData = {
        diaryEntries: generateDiaryEntries(),
        assessments: generateAssessments(),
        messages: generateMessages(),
        appointments: generateAppointments(),
        tasks: generateTasks(),
        questionnaires: generateQuestionnaires(),
        notifications: generateNotifications()
    };

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
                { id: 'unlock-001', moduleId: 'sleep-science', moduleName: 'Sleep Science Fundamentals', grantedAt: makeTimestamp(new Date(Date.now() - 28 * 86400000)) }
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

        // --- Write methods: show toast, no-op ---

        FirebaseDB.saveDiaryEntry = async (userId, entry) => {
            showDemoToast('Demo mode — diary entry not saved');
            return { id: 'demo-diary-new' };
        };

        FirebaseDB.saveAssessment = async (userId, results) => {
            showDemoToast('Demo mode — assessment not saved');
            return { id: 'demo-assess-new' };
        };

        FirebaseDB.sendMessage = async (conversationId, senderId, text) => {
            showDemoToast('Demo mode — message not sent');
            return { id: 'demo-msg-new' };
        };

        FirebaseDB.createAppointment = async (userId, data) => {
            showDemoToast('Demo mode — appointment not created');
            return { id: 'demo-appt-new' };
        };

        FirebaseDB.completeTask = async (taskId) => {
            showDemoToast('Demo mode — task not updated');
        };

        FirebaseDB.requestModuleAccess = async (userId, moduleId, moduleName, reason) => {
            showDemoToast('Demo mode — request not sent');
            return { id: 'demo-req-new' };
        };

        FirebaseDB.startQuestionnaire = async (assignmentId) => {
            showDemoToast('Demo mode — questionnaire not started');
        };

        FirebaseDB.submitQuestionnaireResult = async (assignmentId, answers, result) => {
            showDemoToast('Demo mode — results not submitted');
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
                    <strong>Demo Mode</strong> — Exploring with sample data
                </span>
                <a href="auth.html" onclick="sessionStorage.removeItem('demoMode')"
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
    window.DEMO_USER = DEMO_USER;
    window.DEMO_PROFILE = DEMO_PROFILE;

})();
