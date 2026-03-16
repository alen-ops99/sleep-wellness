/**
 * Demo Mode for Sleep Wellness Admin Dashboard
 *
 * Detects ?demo=true URL param, overrides FirebaseDB methods and db.collection()
 * calls with mock data so the admin dashboard works without Firebase auth.
 */

(function() {
    'use strict';

    // ==================== DETECTION ====================

    function isDemoMode() {
        return new URLSearchParams(window.location.search).get('demo') === 'true'
            || sessionStorage.getItem('demoMode') === 'true';
    }

    if (!isDemoMode()) return;

    sessionStorage.setItem('demoMode', 'true');
    console.log('[Admin Demo Mode] Activated');

    // ==================== DEMO ADMIN CONSTANTS ====================

    const DEMO_ADMIN_UID = 'demo-admin-001';

    const DEMO_ADMIN_USER = {
        uid: DEMO_ADMIN_UID,
        email: 'dr.alen@demo.sleepwellness.com',
        displayName: 'Dr. Alen',
        emailVerified: true,
        isAnonymous: false,
        metadata: {
            creationTime: new Date(Date.now() - 180 * 86400000).toISOString(),
            lastSignInTime: new Date().toISOString()
        },
        getIdToken: () => Promise.resolve('demo-admin-token'),
        reload: () => Promise.resolve()
    };

    const DEMO_ADMIN_PROFILE = {
        uid: DEMO_ADMIN_UID,
        email: DEMO_ADMIN_USER.email,
        displayName: 'Dr. Alen',
        role: 'admin',
        createdAt: { toDate: () => new Date(Date.now() - 180 * 86400000) }
    };

    // ==================== MOCK CLIENTS ====================

    const MOCK_CLIENTS = [
        { id: 'client-001', displayName: 'Michael Chen', email: 'michael.chen@team.com', clientType: 'athlete', role: 'client', phone: '+1 555-0101', sessionsRemaining: 4, totalSessions: 6, onboardingComplete: true, createdAt: { toDate: () => new Date(Date.now() - 45 * 86400000) }, lastActive: { toDate: () => new Date(Date.now() - 1 * 86400000) } },
        { id: 'client-002', displayName: 'Sarah Williams', email: 'sarah@luxuryresort.com', clientType: 'hotel', role: 'client', phone: '+44 20-7946-0958', sessionsRemaining: 2, totalSessions: 4, onboardingComplete: true, createdAt: { toDate: () => new Date(Date.now() - 30 * 86400000) }, lastActive: { toDate: () => new Date(Date.now() - 3 * 86400000) } },
        { id: 'client-003', displayName: 'James Rodriguez', email: 'jrodriguez@corp.com', clientType: 'executive', role: 'client', phone: '+1 555-0303', sessionsRemaining: 5, totalSessions: 6, onboardingComplete: true, createdAt: { toDate: () => new Date(Date.now() - 20 * 86400000) }, lastActive: { toDate: () => new Date(Date.now() - 0.5 * 86400000) } },
        { id: 'client-004', displayName: 'Emma Thompson', email: 'emma.t@athletics.org', clientType: 'athlete', role: 'client', phone: '+1 555-0404', sessionsRemaining: 6, totalSessions: 6, onboardingComplete: false, createdAt: { toDate: () => new Date(Date.now() - 5 * 86400000) }, lastActive: { toDate: () => new Date(Date.now() - 4 * 86400000) } },
        { id: 'client-005', displayName: 'David Park', email: 'dpark@grandhotel.com', clientType: 'hotel', role: 'client', phone: '+82 2-1234-5678', sessionsRemaining: 3, totalSessions: 4, onboardingComplete: true, createdAt: { toDate: () => new Date(Date.now() - 15 * 86400000) }, lastActive: { toDate: () => new Date(Date.now() - 2 * 86400000) } },
        { id: 'client-006', displayName: 'Lisa Anderson', email: 'landerson@tech.com', clientType: 'executive', role: 'client', phone: '+1 555-0606', sessionsRemaining: 1, totalSessions: 6, onboardingComplete: true, createdAt: { toDate: () => new Date(Date.now() - 60 * 86400000) }, lastActive: { toDate: () => new Date(Date.now() - 1 * 86400000) } }
    ];

    function makeTimestamp(date) {
        const d = date instanceof Date ? date : new Date(date);
        return { toDate: () => d, seconds: Math.floor(d.getTime() / 1000), nanoseconds: 0 };
    }

    // ==================== MOCK HOTEL PARTNERS & GUEST STAYS ====================

    const MOCK_HOTEL_PARTNERS = [
        {
            id: 'ritz-carlton-boston',
            name: 'The Ritz-Carlton, Boston',
            contactName: 'Sarah Mitchell',
            contactEmail: 'sarah.mitchell@ritzcarlton-boston.com',
            contactPhone: '+1 617-574-7100',
            logoUrl: null,
            partnershipStatus: 'active',
            address: '10 Avery Street, Boston, MA 02111',
            hotelType: 'luxury',
            starRating: 5,
            totalRooms: 200,
            roomsEnrolled: 48,
            programTier: 'Premium',
            reportSettings: {
                includeGuestName: true,
                emailOnCheckout: true
            },
            createdAt: makeTimestamp(new Date(Date.now() - 120 * 86400000)),
            createdBy: DEMO_ADMIN_UID
        },
        {
            id: 'movenpick-kvarner-bay',
            name: 'Movenpick Resort & Spa, Kvarner Bay',
            contactName: 'Marco Petrovic',
            contactEmail: 'marco.petrovic@movenpick-kvarner.hr',
            contactPhone: '+385 51 710 444',
            logoUrl: null,
            partnershipStatus: 'active',
            address: 'Obala Marshala Tita 1, 51410 Opatija, Croatia',
            hotelType: 'boutique-luxury',
            starRating: 5,
            totalRooms: 126,
            roomsEnrolled: 32,
            programTier: 'Premium',
            reportSettings: {
                includeGuestName: false,
                emailOnCheckout: true
            },
            createdAt: makeTimestamp(new Date(Date.now() - 75 * 86400000)),
            createdBy: DEMO_ADMIN_UID
        }
    ];

    // Guest user profiles (added to MOCK_CLIENTS for user lookups)
    const MOCK_HOTEL_GUEST_USERS = [
        { id: 'demo-guest-001', displayName: 'Sarah Johnson', email: 'sarah.johnson@email.com', role: 'client', clientType: 'hotel', hotelAffiliation: { hotelPartnerId: 'ritz-carlton-boston', isHotelGuest: true }, createdAt: { toDate: () => new Date(Date.now() - 12 * 86400000) } },
        { id: 'demo-guest-002', displayName: 'Michael Chen', email: 'michael.chen.guest@email.com', role: 'client', clientType: 'hotel', hotelAffiliation: { hotelPartnerId: 'ritz-carlton-boston', isHotelGuest: true }, createdAt: { toDate: () => new Date(Date.now() - 8 * 86400000) } },
        { id: 'demo-guest-003', displayName: 'Emma Williams', email: 'emma.williams@email.com', role: 'client', clientType: 'hotel', hotelAffiliation: { hotelPartnerId: 'ritz-carlton-boston', isHotelGuest: true }, createdAt: { toDate: () => new Date(Date.now() - 3 * 86400000) } },
        { id: 'demo-guest-004', displayName: 'Luka Babic', email: 'luka.babic@email.com', role: 'client', clientType: 'hotel', hotelAffiliation: { hotelPartnerId: 'movenpick-kvarner-bay', isHotelGuest: true }, createdAt: { toDate: () => new Date(Date.now() - 18 * 86400000) } },
        { id: 'demo-guest-005', displayName: 'Ana Kovac', email: 'ana.kovac@email.com', role: 'client', clientType: 'hotel', hotelAffiliation: { hotelPartnerId: 'movenpick-kvarner-bay', isHotelGuest: true }, createdAt: { toDate: () => new Date(Date.now() - 5 * 86400000) } }
    ];

    const checkIn1 = new Date(Date.now() - 10 * 86400000);
    const checkout1 = new Date(Date.now() - 3 * 86400000);
    const checkIn2 = new Date(Date.now() - 7 * 86400000);
    const checkout2 = new Date(Date.now() - 1 * 86400000);
    const checkIn3 = new Date(Date.now() - 2 * 86400000);
    const checkout3 = new Date(Date.now() + 3 * 86400000);
    const checkIn4 = new Date(Date.now() - 20 * 86400000);
    const checkout4 = new Date(Date.now() - 13 * 86400000);
    const checkIn5 = new Date(Date.now() - 4 * 86400000);
    const checkout5 = new Date(Date.now() + 2 * 86400000);

    const MOCK_GUEST_STAYS = [
        // Ritz-Carlton, Boston — Guest 1: Completed 7-day stay, dramatic improvement
        {
            id: 'stay-001',
            guestUserId: 'demo-guest-001',
            guestName: 'Sarah Johnson',
            hotelPartnerId: 'ritz-carlton-boston',
            checkInDate: makeTimestamp(checkIn1),
            checkoutDate: makeTimestamp(checkout1),
            actualCheckoutDate: makeTimestamp(checkout1),
            roomNumber: 'Suite 412',
            stayStatus: 'checked-out',
            baselineAssessments: { isi: 21, ess: 16 },
            postStayAssessments: { isi: 8, ess: 7 },
            engagement: {
                chatSessions: 12,
                diaryEntries: 7,
                guidesViewed: 5,
                interventions: ['personalized-schedule', 'room-optimization', 'relaxation-techniques', 'light-therapy', 'sleep-hygiene']
            },
            sleepMetrics: {
                avgSleepDuration: { baseline: 4.8, postStay: 7.4 },
                avgSleepLatency: { baseline: 55, postStay: 12 },
                avgAwakenings: { baseline: 4.1, postStay: 0.8 },
                avgSleepEfficiency: { baseline: 68, postStay: 92 },
                avgRestedness: { baseline: 3.2, postStay: 8.6 },
                avgDaytimeEnergy: { baseline: 3.8, postStay: 8.2 }
            },
            hotelExperience: {
                mattress: 10, pillows: 9, bedding: 9, roomTemp: 9,
                darkness: 10, quietness: 8, airQuality: 9,
                topFactor: 'The blackout curtains and mattress quality were exceptional'
            },
            guestFeedback: {
                rating: 5,
                wouldRecommend: true,
                mostHelpful: 'personalized-schedule',
                comments: 'Life-changing experience! I came here exhausted from chronic insomnia and left feeling like a new person. The personalized sleep schedule and Dr. Alen\'s guidance through the app were incredible. My sleep improved dramatically by day 3.',
                submittedAt: makeTimestamp(checkout1)
            },
            reportPdfUrl: null,
            reportSentAt: null,
            createdAt: makeTimestamp(checkIn1)
        },
        // Ritz-Carlton, Boston — Guest 2: Completed 6-day stay, good improvement
        {
            id: 'stay-002',
            guestUserId: 'demo-guest-002',
            guestName: 'Michael Chen',
            hotelPartnerId: 'ritz-carlton-boston',
            checkInDate: makeTimestamp(checkIn2),
            checkoutDate: makeTimestamp(checkout2),
            actualCheckoutDate: makeTimestamp(checkout2),
            roomNumber: 'Room 308',
            stayStatus: 'checked-out',
            baselineAssessments: { isi: 15, ess: 12 },
            postStayAssessments: { isi: 7, ess: 6 },
            engagement: {
                chatSessions: 8,
                diaryEntries: 5,
                guidesViewed: 3,
                interventions: ['room-optimization', 'relaxation-techniques', 'caffeine-timing']
            },
            sleepMetrics: {
                avgSleepDuration: { baseline: 5.8, postStay: 7.1 },
                avgSleepLatency: { baseline: 35, postStay: 18 },
                avgAwakenings: { baseline: 2.5, postStay: 1.2 },
                avgSleepEfficiency: { baseline: 76, postStay: 88 },
                avgRestedness: { baseline: 4.5, postStay: 7.8 },
                avgDaytimeEnergy: { baseline: 5.0, postStay: 7.5 }
            },
            hotelExperience: {
                mattress: 8, pillows: 9, bedding: 8, roomTemp: 10,
                darkness: 9, quietness: 6, airQuality: 8,
                topFactor: 'Perfect room temperature control made all the difference'
            },
            guestFeedback: {
                rating: 5,
                wouldRecommend: true,
                mostHelpful: 'room-optimization',
                comments: 'The room optimization tips were game-changers - especially the blackout guidance and temperature settings. Slept better here than at home!',
                submittedAt: makeTimestamp(checkout2)
            },
            reportPdfUrl: null,
            reportSentAt: null,
            createdAt: makeTimestamp(checkIn2)
        },
        // Ritz-Carlton, Boston — Guest 3: Currently active stay
        {
            id: 'stay-003',
            guestUserId: 'demo-guest-003',
            guestName: 'Emma Williams',
            hotelPartnerId: 'ritz-carlton-boston',
            checkInDate: makeTimestamp(checkIn3),
            checkoutDate: makeTimestamp(checkout3),
            roomNumber: 'Suite 501',
            stayStatus: 'active',
            baselineAssessments: { isi: 18, ess: 14 },
            postStayAssessments: null,
            engagement: {
                chatSessions: 3,
                diaryEntries: 2,
                guidesViewed: 2,
                interventions: ['personalized-schedule', 'room-optimization']
            },
            guestFeedback: null,
            reportPdfUrl: null,
            reportSentAt: null,
            createdAt: makeTimestamp(checkIn3)
        },
        // Movenpick, Kvarner Bay — Guest 4: Completed stay with report sent
        {
            id: 'stay-004',
            guestUserId: 'demo-guest-004',
            guestName: 'Luka Babic',
            hotelPartnerId: 'movenpick-kvarner-bay',
            checkInDate: makeTimestamp(checkIn4),
            checkoutDate: makeTimestamp(checkout4),
            actualCheckoutDate: makeTimestamp(checkout4),
            roomNumber: 'Deluxe Sea View 214',
            stayStatus: 'report-sent',
            baselineAssessments: { isi: 12, ess: 10 },
            postStayAssessments: { isi: 5, ess: 4 },
            engagement: {
                chatSessions: 6,
                diaryEntries: 7,
                guidesViewed: 4,
                interventions: ['relaxation-techniques', 'light-therapy', 'sleep-hygiene', 'caffeine-timing']
            },
            sleepMetrics: {
                avgSleepDuration: { baseline: 6.0, postStay: 7.8 },
                avgSleepLatency: { baseline: 25, postStay: 8 },
                avgAwakenings: { baseline: 2.0, postStay: 0.5 },
                avgSleepEfficiency: { baseline: 78, postStay: 95 },
                avgRestedness: { baseline: 5.0, postStay: 9.1 },
                avgDaytimeEnergy: { baseline: 5.5, postStay: 8.8 }
            },
            hotelExperience: {
                mattress: 9, pillows: 8, bedding: 9, roomTemp: 9,
                darkness: 10, quietness: 10, airQuality: 10,
                topFactor: 'The sea breeze and natural darkness cycle were incredibly restorative'
            },
            guestFeedback: {
                rating: 5,
                wouldRecommend: true,
                mostHelpful: 'light-therapy',
                comments: 'Odlicno iskustvo! The combination of the natural coastal environment and the structured sleep program was perfect. I now have tools I can use at home.',
                submittedAt: makeTimestamp(checkout4)
            },
            reportPdfUrl: 'https://example.com/reports/stay-004-report.pdf',
            reportSentAt: makeTimestamp(new Date(Date.now() - 11 * 86400000)),
            createdAt: makeTimestamp(checkIn4)
        },
        // Movenpick, Kvarner Bay — Guest 5: Currently active stay
        {
            id: 'stay-005',
            guestUserId: 'demo-guest-005',
            guestName: 'Ana Kovac',
            hotelPartnerId: 'movenpick-kvarner-bay',
            checkInDate: makeTimestamp(checkIn5),
            checkoutDate: makeTimestamp(checkout5),
            roomNumber: 'Premium Suite 301',
            stayStatus: 'active',
            baselineAssessments: { isi: 16, ess: 13 },
            postStayAssessments: null,
            engagement: {
                chatSessions: 4,
                diaryEntries: 3,
                guidesViewed: 3,
                interventions: ['personalized-schedule', 'relaxation-techniques', 'room-optimization']
            },
            guestFeedback: null,
            reportPdfUrl: null,
            reportSentAt: null,
            createdAt: makeTimestamp(checkIn5)
        }
    ];

    // ==================== MOCK ATHLETIC PARTNERS & ATHLETE PROFILES ====================

    const MOCK_ATHLETIC_PARTNERS = [
        {
            id: 'boston-celtics',
            name: 'Boston Celtics',
            sport: 'basketball',
            competitionLevel: 'professional',
            league: 'NBA',
            contactName: 'Dr. James Walsh',
            contactEmail: 'james.walsh@celtics.com',
            contactPhone: '+1 617-854-8000',
            logoUrl: null,
            partnershipStatus: 'active',
            athleteCount: 15,
            programTier: 'Elite',
            programFocus: {
                recovery: true,
                travel: true,
                performance: true
            },
            createdAt: makeTimestamp(new Date(Date.now() - 90 * 86400000)),
            createdBy: DEMO_ADMIN_UID
        },
        {
            id: 'harvard-mens-soccer',
            name: 'Harvard Men\'s Soccer',
            sport: 'soccer',
            competitionLevel: 'collegiate',
            league: 'Ivy League / NCAA D1',
            contactName: 'Coach Mike Reynolds',
            contactEmail: 'mreynolds@fas.harvard.edu',
            contactPhone: '+1 617-495-2211',
            logoUrl: null,
            partnershipStatus: 'active',
            athleteCount: 28,
            programTier: 'Standard',
            programFocus: {
                recovery: true,
                travel: false,
                performance: true
            },
            createdAt: makeTimestamp(new Date(Date.now() - 45 * 86400000)),
            createdBy: DEMO_ADMIN_UID
        }
    ];

    const MOCK_ATHLETE_PROFILES = [
        // Celtics athletes
        {
            id: 'athlete-001',
            teamPartnerId: 'boston-celtics',
            displayName: 'Jaylen Torres',
            position: 'Point Guard',
            sport: 'Basketball',
            jerseyNumber: 11,
            avgSleepScore: 88,
            avgRecoveryScore: 92,
            injuryRiskLevel: 'low',
            complianceRate: 96,
            enrolledAt: makeTimestamp(new Date(Date.now() - 85 * 86400000)),
            lastAssessment: makeTimestamp(new Date(Date.now() - 2 * 86400000)),
            performanceData: {
                preSleep: { avgSleepHours: 5.8, avgReactionTime: 285, avgSprintSpeed: 17.2 },
                postSleep: { avgSleepHours: 8.1, avgReactionTime: 248, avgSprintSpeed: 18.1 }
            }
        },
        {
            id: 'athlete-002',
            teamPartnerId: 'boston-celtics',
            displayName: 'Marcus Thompson',
            position: 'Shooting Guard',
            sport: 'Basketball',
            jerseyNumber: 7,
            avgSleepScore: 74,
            avgRecoveryScore: 78,
            injuryRiskLevel: 'moderate',
            complianceRate: 68,
            enrolledAt: makeTimestamp(new Date(Date.now() - 80 * 86400000)),
            lastAssessment: makeTimestamp(new Date(Date.now() - 5 * 86400000))
        },
        {
            id: 'athlete-003',
            teamPartnerId: 'boston-celtics',
            displayName: 'David Okonkwo',
            position: 'Center',
            sport: 'Basketball',
            jerseyNumber: 34,
            avgSleepScore: 82,
            avgRecoveryScore: 85,
            injuryRiskLevel: 'low',
            complianceRate: 91,
            enrolledAt: makeTimestamp(new Date(Date.now() - 75 * 86400000)),
            lastAssessment: makeTimestamp(new Date(Date.now() - 1 * 86400000))
        },
        // Harvard Soccer athletes
        {
            id: 'athlete-004',
            teamPartnerId: 'harvard-mens-soccer',
            displayName: 'Ryan Fitzgerald',
            position: 'Midfielder',
            sport: 'Soccer',
            jerseyNumber: 10,
            avgSleepScore: 79,
            avgRecoveryScore: 83,
            injuryRiskLevel: 'low',
            complianceRate: 88,
            enrolledAt: makeTimestamp(new Date(Date.now() - 40 * 86400000)),
            lastAssessment: makeTimestamp(new Date(Date.now() - 3 * 86400000))
        },
        {
            id: 'athlete-005',
            teamPartnerId: 'harvard-mens-soccer',
            displayName: 'Carlos Mendez',
            position: 'Striker',
            sport: 'Soccer',
            jerseyNumber: 9,
            avgSleepScore: 65,
            avgRecoveryScore: 71,
            injuryRiskLevel: 'elevated',
            complianceRate: 55,
            enrolledAt: makeTimestamp(new Date(Date.now() - 38 * 86400000)),
            lastAssessment: makeTimestamp(new Date(Date.now() - 7 * 86400000))
        }
    ];

    // ==================== MOCK BUSINESS PARTNERS & EXECUTIVE PROFILES ====================

    const MOCK_BUSINESS_PARTNERS = [
        {
            id: 'mckinsey-company',
            name: 'McKinsey & Company',
            industry: 'consulting',
            programType: 'executive',
            contactName: 'Lisa Chen',
            contactEmail: 'lisa.chen@mckinsey.com',
            contactPhone: '+1 212-446-7000',
            logoUrl: null,
            partnershipStatus: 'active',
            employeesEnrolled: 24,
            programTier: 'Enterprise',
            programFocus: {
                decision: true,
                travel: true,
                stress: true
            },
            createdAt: makeTimestamp(new Date(Date.now() - 60 * 86400000)),
            createdBy: DEMO_ADMIN_UID
        },
        {
            id: 'boston-dynamics',
            name: 'Boston Dynamics',
            industry: 'technology',
            programType: 'team-wellness',
            contactName: 'Dr. Rachel Park',
            contactEmail: 'rpark@bostondynamics.com',
            contactPhone: '+1 781-849-1000',
            logoUrl: null,
            partnershipStatus: 'active',
            employeesEnrolled: 12,
            programTier: 'Standard',
            programFocus: {
                decision: true,
                travel: false,
                stress: true
            },
            createdAt: makeTimestamp(new Date(Date.now() - 30 * 86400000)),
            createdBy: DEMO_ADMIN_UID
        }
    ];

    const MOCK_EXECUTIVE_PROFILES = [
        // McKinsey executives
        {
            id: 'exec-001',
            orgPartnerId: 'mckinsey-company',
            displayName: 'Robert Ashworth',
            title: 'Senior Partner',
            company: 'McKinsey & Company',
            avgSleepScore: 72,
            stressLevel: 'high',
            travelFrequency: '3-4 trips/month',
            complianceRate: 82,
            performanceGain: 28,
            keyConcerns: ['jet lag', 'late-night client calls', 'high cognitive demand'],
            enrolledAt: makeTimestamp(new Date(Date.now() - 55 * 86400000)),
            lastAssessment: makeTimestamp(new Date(Date.now() - 4 * 86400000))
        },
        {
            id: 'exec-002',
            orgPartnerId: 'mckinsey-company',
            displayName: 'Jennifer Nakamura',
            title: 'Associate Partner',
            company: 'McKinsey & Company',
            avgSleepScore: 64,
            stressLevel: 'very-high',
            travelFrequency: '2-3 trips/month',
            complianceRate: 71,
            performanceGain: 22,
            keyConcerns: ['sleep onset insomnia', 'work anxiety', 'screen time before bed'],
            enrolledAt: makeTimestamp(new Date(Date.now() - 50 * 86400000)),
            lastAssessment: makeTimestamp(new Date(Date.now() - 2 * 86400000))
        },
        {
            id: 'exec-003',
            orgPartnerId: 'mckinsey-company',
            displayName: 'Daniel Osei',
            title: 'Engagement Manager',
            company: 'McKinsey & Company',
            avgSleepScore: 81,
            stressLevel: 'moderate',
            travelFrequency: '1-2 trips/month',
            complianceRate: 94,
            performanceGain: 35,
            keyConcerns: ['maintaining routine while traveling', 'caffeine dependency'],
            enrolledAt: makeTimestamp(new Date(Date.now() - 45 * 86400000)),
            lastAssessment: makeTimestamp(new Date(Date.now() - 1 * 86400000))
        },
        // Boston Dynamics executive
        {
            id: 'exec-004',
            orgPartnerId: 'boston-dynamics',
            displayName: 'Sarah Volkov',
            title: 'VP of Engineering',
            company: 'Boston Dynamics',
            avgSleepScore: 58,
            stressLevel: 'high',
            travelFrequency: '1 trip/month',
            complianceRate: 65,
            performanceGain: 18,
            keyConcerns: ['early morning meetings', 'irregular schedule', 'blue light exposure'],
            enrolledAt: makeTimestamp(new Date(Date.now() - 25 * 86400000)),
            lastAssessment: makeTimestamp(new Date(Date.now() - 3 * 86400000))
        }
    ];

    // ==================== MOCK DATA COLLECTIONS ====================

    const MOCK_ASSESSMENTS = [
        { id: 'a-001', userId: 'client-001', type: 'sleep-assessment', overallScore: 72, completedAt: makeTimestamp(new Date(Date.now() - 10 * 86400000)), createdAt: makeTimestamp(new Date(Date.now() - 10 * 86400000)), categories: { sleepQuality: { score: 70 }, sleepDuration: { score: 65 }, sleepEfficiency: { score: 78 }, daytimeFunction: { score: 75 } } },
        { id: 'a-002', userId: 'client-002', type: 'sleep-assessment', overallScore: 58, completedAt: makeTimestamp(new Date(Date.now() - 20 * 86400000)), createdAt: makeTimestamp(new Date(Date.now() - 20 * 86400000)), categories: { sleepQuality: { score: 50 }, sleepDuration: { score: 55 }, sleepEfficiency: { score: 60 }, daytimeFunction: { score: 65 } } },
        { id: 'a-003', userId: 'client-003', type: 'sleep-assessment', overallScore: 45, completedAt: makeTimestamp(new Date(Date.now() - 15 * 86400000)), createdAt: makeTimestamp(new Date(Date.now() - 15 * 86400000)), categories: { sleepQuality: { score: 40 }, sleepDuration: { score: 42 }, sleepEfficiency: { score: 48 }, daytimeFunction: { score: 50 } } },
        { id: 'a-004', userId: 'client-006', type: 'sleep-assessment', overallScore: 82, completedAt: makeTimestamp(new Date(Date.now() - 5 * 86400000)), createdAt: makeTimestamp(new Date(Date.now() - 5 * 86400000)), categories: { sleepQuality: { score: 80 }, sleepDuration: { score: 78 }, sleepEfficiency: { score: 85 }, daytimeFunction: { score: 84 } } }
    ];

    const MOCK_APPOINTMENTS = [
        { id: 'apt-001', userId: 'client-001', type: 'Follow-up', dateTime: makeTimestamp(new Date(Date.now() + 3 * 86400000)), duration: 30, status: 'pending', notes: 'Review sleep diary progress', createdAt: makeTimestamp(new Date(Date.now() - 2 * 86400000)) },
        { id: 'apt-002', userId: 'client-003', type: 'Initial Consultation', dateTime: makeTimestamp(new Date(Date.now() + 5 * 86400000)), duration: 45, status: 'pending', notes: 'First session — executive stress & sleep', createdAt: makeTimestamp(new Date(Date.now() - 1 * 86400000)) },
        { id: 'apt-003', userId: 'client-006', type: 'Follow-up', dateTime: makeTimestamp(new Date(Date.now() - 7 * 86400000)), duration: 30, status: 'completed', notes: 'Great progress review', createdAt: makeTimestamp(new Date(Date.now() - 14 * 86400000)) },
        { id: 'apt-004', userId: 'client-005', type: 'Follow-up', dateTime: makeTimestamp(new Date(Date.now() + 10 * 86400000)), duration: 30, status: 'confirmed', notes: 'Hotel sleep program check-in', createdAt: makeTimestamp(new Date(Date.now() - 3 * 86400000)) }
    ];

    const MOCK_CONVERSATIONS = [
        { id: 'conv-001', participants: [DEMO_ADMIN_UID, 'client-001'], lastMessage: 'Thanks for the tips on sleep onset!', lastMessageAt: makeTimestamp(new Date(Date.now() - 2 * 3600000)), createdAt: makeTimestamp(new Date(Date.now() - 40 * 86400000)) },
        { id: 'conv-002', participants: [DEMO_ADMIN_UID, 'client-003'], lastMessage: 'Quick question about the sleep restriction protocol...', lastMessageAt: makeTimestamp(new Date(Date.now() - 5 * 3600000)), createdAt: makeTimestamp(new Date(Date.now() - 18 * 86400000)) },
        { id: 'conv-003', participants: [DEMO_ADMIN_UID, 'client-002'], lastMessage: 'Thank you for the breathing exercise recommendations!', lastMessageAt: makeTimestamp(new Date(Date.now() - 8 * 3600000)), createdAt: makeTimestamp(new Date(Date.now() - 25 * 86400000)) }
    ];

    const MOCK_MESSAGES = {
        'conv-001': [
            { id: 'm1', senderId: DEMO_ADMIN_UID, senderName: 'Dr. Alen', text: 'Hi Michael, how has your sleep been this week? Have you been sticking to the 11pm bedtime?', timestamp: makeTimestamp(new Date(Date.now() - 3 * 86400000)) },
            { id: 'm2', senderId: 'client-001', senderName: 'Michael Chen', text: 'Yes! Down to about 12 minutes sleep onset now. The wind-down routine is really helping before competitions.', timestamp: makeTimestamp(new Date(Date.now() - 2.5 * 86400000)) },
            { id: 'm3', senderId: DEMO_ADMIN_UID, senderName: 'Dr. Alen', text: 'Excellent progress. Let\'s discuss stimulus control in our next session.', timestamp: makeTimestamp(new Date(Date.now() - 2 * 86400000)) },
            { id: 'm4', senderId: 'client-001', senderName: 'Michael Chen', text: 'Thanks for the tips on sleep onset!', timestamp: makeTimestamp(new Date(Date.now() - 2 * 3600000)) }
        ],
        'conv-002': [
            { id: 'm5', senderId: 'client-003', senderName: 'James Rodriguez', text: 'Dr. Alen, I travel a lot for work. Any tips on managing jet lag?', timestamp: makeTimestamp(new Date(Date.now() - 1 * 86400000)) },
            { id: 'm6', senderId: DEMO_ADMIN_UID, senderName: 'Dr. Alen', text: 'Great question. Strategic light exposure is key. I\'ll send you a protocol in the modules section.', timestamp: makeTimestamp(new Date(Date.now() - 20 * 3600000)) },
            { id: 'm7', senderId: 'client-003', senderName: 'James Rodriguez', text: 'Quick question about the sleep restriction protocol...', timestamp: makeTimestamp(new Date(Date.now() - 5 * 3600000)) }
        ],
        'conv-003': [
            { id: 'm8', senderId: 'client-002', senderName: 'Sarah Williams', text: 'The hotel guests are loving the new pillow menu and sleep tips we implemented!', timestamp: makeTimestamp(new Date(Date.now() - 1 * 86400000)) },
            { id: 'm9', senderId: DEMO_ADMIN_UID, senderName: 'Dr. Alen', text: 'Wonderful! Let\'s review the guest satisfaction data at our next session.', timestamp: makeTimestamp(new Date(Date.now() - 12 * 3600000)) },
            { id: 'm10', senderId: 'client-002', senderName: 'Sarah Williams', text: 'Thank you for the breathing exercise recommendations!', timestamp: makeTimestamp(new Date(Date.now() - 8 * 3600000)) }
        ]
    };

    const MOCK_INVITE_CODES = [
        { code: 'SW-DEMO-0001', createdAt: makeTimestamp(new Date(Date.now() - 10 * 86400000)), createdBy: DEMO_ADMIN_UID, used: true, usedBy: 'client-001', usedAt: makeTimestamp(new Date(Date.now() - 9 * 86400000)), clientEmail: 'michael.chen@team.com', notes: 'Pro athlete referral' },
        { code: 'SW-DEMO-0002', createdAt: makeTimestamp(new Date(Date.now() - 5 * 86400000)), createdBy: DEMO_ADMIN_UID, used: false, clientEmail: 'new.client@example.com', notes: 'Pending onboarding' },
        { code: 'SW-DEMO-0003', createdAt: makeTimestamp(new Date(Date.now() - 2 * 86400000)), createdBy: DEMO_ADMIN_UID, used: false, clientEmail: '', notes: 'General invite' }
    ];

    const MOCK_MODULE_REQUESTS = [
        { id: 'req-001', userId: 'client-006', moduleId: 'cbti-restriction', moduleName: 'CBT-I: Sleep Restriction', reason: 'Ready for next phase of treatment', status: 'pending', createdAt: makeTimestamp(new Date(Date.now() - 1 * 86400000)) }
    ];

    const MOCK_QUESTIONNAIRE_ASSIGNMENTS = [
        { id: 'qa-001', userId: 'client-001', instrumentId: 'ISI', instrumentName: 'Insomnia Severity Index', status: 'completed', assignedAt: makeTimestamp(new Date(Date.now() - 30 * 86400000)), completedAt: makeTimestamp(new Date(Date.now() - 28 * 86400000)), result: { totalScore: 14, severity: 'Moderate' } },
        { id: 'qa-002', userId: 'client-003', instrumentId: 'ESS', instrumentName: 'Epworth Sleepiness Scale', status: 'completed', assignedAt: makeTimestamp(new Date(Date.now() - 15 * 86400000)), completedAt: makeTimestamp(new Date(Date.now() - 13 * 86400000)), result: { totalScore: 11, severity: 'Mild Excessive Sleepiness' } },
        { id: 'qa-003', userId: 'client-005', instrumentId: 'PSQI', instrumentName: 'Pittsburgh Sleep Quality Index', status: 'pending', assignedAt: makeTimestamp(new Date(Date.now() - 3 * 86400000)), dueDate: makeTimestamp(new Date(Date.now() + 4 * 86400000)) }
    ];

    const MOCK_NOTIFICATIONS_ADMIN = [
        { id: 'an-001', userId: DEMO_ADMIN_UID, type: 'appointment', title: 'New Appointment Request', message: 'Michael Chen requested a follow-up session.', read: false, createdAt: makeTimestamp(new Date(Date.now() - 2 * 3600000)) },
        { id: 'an-002', userId: DEMO_ADMIN_UID, type: 'module-request', title: 'Module Access Request', message: 'Lisa Anderson requested access to CBT-I: Sleep Restriction.', read: false, createdAt: makeTimestamp(new Date(Date.now() - 5 * 3600000)) },
        { id: 'an-003', userId: DEMO_ADMIN_UID, type: 'questionnaire', title: 'Questionnaire Completed', message: 'James Rodriguez completed the Epworth Sleepiness Scale.', read: true, createdAt: makeTimestamp(new Date(Date.now() - 1 * 86400000)) }
    ];

    const MOCK_CLIENT_TASKS = [
        { id: 'ct-001', clientId: 'client-001', title: 'Complete Follow-Up Assessment', description: 'Track progress after 4 weeks', type: 'assessment', status: 'pending', dueDate: makeTimestamp(new Date(Date.now() + 2 * 86400000)), createdAt: makeTimestamp(new Date(Date.now() - 5 * 86400000)) },
        { id: 'ct-002', clientId: 'client-003', title: 'Log Sleep Diary Daily', description: 'Fill in diary every morning', type: 'diary', status: 'pending', dueDate: makeTimestamp(new Date(Date.now() + 7 * 86400000)), createdAt: makeTimestamp(new Date(Date.now() - 10 * 86400000)) },
        { id: 'ct-003', clientId: 'client-002', title: 'Review Guest Feedback Report', description: 'Analyze sleep program guest satisfaction', type: 'custom', status: 'completed', completedAt: makeTimestamp(new Date(Date.now() - 3 * 86400000)), createdAt: makeTimestamp(new Date(Date.now() - 10 * 86400000)) }
    ];

    // Client lookup helper (includes hotel guest users)
    function getClientById(id) {
        return MOCK_CLIENTS.find(c => c.id === id)
            || MOCK_HOTEL_GUEST_USERS.find(c => c.id === id)
            || null;
    }

    // ==================== DEMO TOAST ====================

    function showDemoToast(msg) {
        const existing = document.getElementById('demo-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'demo-toast';
        toast.textContent = msg || 'This action is disabled in demo mode';
        Object.assign(toast.style, {
            position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
            background: '#1a2744', color: '#c9a962', padding: '12px 24px', fontSize: '13px',
            fontFamily: 'Montserrat, sans-serif', fontWeight: '500', zIndex: '100001',
            opacity: '0', transition: 'opacity 0.3s', borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        });
        document.body.appendChild(toast);
        requestAnimationFrame(() => { toast.style.opacity = '1'; });
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 2500);
    }

    // ==================== FIRESTORE COLLECTION PROXY ====================
    // The admin dashboard uses direct db.collection() calls that need interception.

    function createMockQuerySnapshot(docs) {
        const mockDocs = docs.map(d => ({
            id: d.id,
            data: () => { const { id, ...rest } = d; return rest; },
            exists: true
        }));
        return {
            docs: mockDocs,
            empty: mockDocs.length === 0,
            size: mockDocs.length,
            forEach: (fn) => mockDocs.forEach(fn)
        };
    }

    function createMockDocSnapshot(doc) {
        if (!doc) return { exists: false, data: () => null, id: null };
        return { id: doc.id, exists: true, data: () => { const { id, ...rest } = doc; return rest; } };
    }

    // A chainable mock query builder
    function createMockQuery(docs) {
        const query = {
            _docs: docs,
            where: function(field, op, value) {
                const filtered = this._docs.filter(d => {
                    const val = d[field];
                    if (op === '==') return val === value;
                    if (op === 'array-contains') return Array.isArray(val) && val.includes(value);
                    if (op === 'in') return Array.isArray(value) && value.includes(val);
                    return true;
                });
                return createMockQuery(filtered);
            },
            orderBy: function() { return this; },
            limit: function(n) {
                return createMockQuery(this._docs.slice(0, n));
            },
            get: function() {
                return Promise.resolve(createMockQuerySnapshot(this._docs));
            },
            onSnapshot: function(callback) {
                setTimeout(() => callback(createMockQuerySnapshot(this._docs)), 50);
                return () => {}; // unsubscribe
            }
        };
        return query;
    }

    function overrideFirestore() {
        if (typeof db === 'undefined') {
            setTimeout(overrideFirestore, 50);
            return;
        }

        const collectionData = {
            'users': MOCK_CLIENTS.concat([DEMO_ADMIN_PROFILE]).concat(MOCK_HOTEL_GUEST_USERS),
            'assessments': MOCK_ASSESSMENTS,
            'appointments': MOCK_APPOINTMENTS,
            'conversations': MOCK_CONVERSATIONS,
            'inviteCodes': MOCK_INVITE_CODES,
            'moduleRequests': MOCK_MODULE_REQUESTS,
            'questionnaireAssignments': MOCK_QUESTIONNAIRE_ASSIGNMENTS,
            'notifications': MOCK_NOTIFICATIONS_ADMIN,
            'clientTasks': MOCK_CLIENT_TASKS,
            'unlocks': [
                { id: 'u-001', userId: 'client-001', moduleId: 'sleep-science', moduleName: 'Sleep Science Fundamentals', grantedAt: makeTimestamp(new Date(Date.now() - 30 * 86400000)), grantedBy: DEMO_ADMIN_UID },
                { id: 'u-002', userId: 'client-006', moduleId: 'cbti-basics', moduleName: 'CBT-I: Basics', grantedAt: makeTimestamp(new Date(Date.now() - 20 * 86400000)), grantedBy: DEMO_ADMIN_UID }
            ],
            'diaryEntries': generateDiaryEntries('client-001', 14).concat(generateDiaryEntries('client-003', 7)),
            'clientActions': [],
            'questionnaireResults': [],
            'eveningCheckins': [],
            'dischargeSurveys': [],
            'hotelPartners': MOCK_HOTEL_PARTNERS,
            'guestStays': MOCK_GUEST_STAYS,
            'athleticPartners': MOCK_ATHLETIC_PARTNERS,
            'athleteProfiles': MOCK_ATHLETE_PROFILES,
            'businessPartners': MOCK_BUSINESS_PARTNERS,
            'executiveProfiles': MOCK_EXECUTIVE_PROFILES
        };

        db.collection = function(name) {
            const docs = collectionData[name] || [];
            const mockCollection = createMockQuery(docs);

            // Support doc() for individual document lookups
            mockCollection.doc = function(docId) {
                const found = docs.find(d => d.id === docId);
                return {
                    get: () => Promise.resolve(createMockDocSnapshot(found)),
                    set: () => { showDemoToast('Demo mode — not saved'); return Promise.resolve(); },
                    update: () => { showDemoToast('Demo mode — not saved'); return Promise.resolve(); },
                    delete: () => { showDemoToast('Demo mode — not saved'); return Promise.resolve(); },
                    collection: function(subName) {
                        // Support subcollections like conversations/{id}/messages
                        if (name === 'conversations' && subName === 'messages') {
                            return createMockQuery(MOCK_MESSAGES[docId] || []);
                        }
                        return createMockQuery([]);
                    },
                    onSnapshot: function(callback) {
                        setTimeout(() => callback(createMockDocSnapshot(found)), 50);
                        return () => {};
                    }
                };
            };

            // Support add() for creating new documents
            mockCollection.add = function() {
                showDemoToast('Demo mode — not saved');
                return Promise.resolve({ id: 'demo-new-' + Date.now() });
            };

            return mockCollection;
        };

        console.log('[Admin Demo Mode] db.collection() overridden');
    }

    function generateDiaryEntries(clientId, days) {
        const entries = [];
        const now = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now); date.setDate(date.getDate() - i);
            const progress = 1 - (i / (days - 1));
            entries.push({
                id: `diary-${clientId}-${i}`,
                userId: clientId,
                date: date.toISOString().split('T')[0],
                totalSleepTime: Math.round(330 + progress * 90 + (Math.random() - 0.5) * 30),
                sleepEfficiency: Math.round(65 + progress * 20 + (Math.random() - 0.5) * 5),
                sleepOnsetLatency: Math.round(40 - progress * 25 + (Math.random() - 0.5) * 8),
                sleepQuality: Math.max(1, Math.min(10, Math.round(4 + progress * 4))),
                createdAt: makeTimestamp(date)
            });
        }
        return entries;
    }

    // ==================== FIREBASEDB OVERRIDES ====================

    function overrideFirebaseDB() {
        if (typeof FirebaseDB === 'undefined') {
            setTimeout(overrideFirebaseDB, 50);
            return;
        }

        // --- Auth / Profile ---
        FirebaseDB.getUserProfile = async (uid) => {
            if (uid === DEMO_ADMIN_UID) return DEMO_ADMIN_PROFILE;
            return getClientById(uid) || { uid, displayName: 'Unknown', email: 'unknown@demo.com', role: 'client' };
        };

        FirebaseDB.isAdmin = async (uid) => uid === DEMO_ADMIN_UID;

        FirebaseDB.getAllUsers = async () => [...MOCK_CLIENTS];

        // --- Analytics ---
        FirebaseDB.getAnalytics = async () => ({
            totalClients: MOCK_CLIENTS.length,
            totalAssessments: MOCK_ASSESSMENTS.length,
            pendingAppointments: MOCK_APPOINTMENTS.filter(a => a.status === 'pending').length,
            completedSessions: 12
        });

        // --- Assessments ---
        FirebaseDB.getAllAssessments = async () => [...MOCK_ASSESSMENTS];
        FirebaseDB.getUserAssessments = async (uid) => MOCK_ASSESSMENTS.filter(a => a.userId === uid);
        FirebaseDB.saveAssessment = async () => { showDemoToast('Demo mode — not saved'); return { id: 'demo' }; };

        // --- Appointments ---
        FirebaseDB.getAllAppointments = async () => [...MOCK_APPOINTMENTS];
        FirebaseDB.getUserAppointments = async (uid) => MOCK_APPOINTMENTS.filter(a => a.userId === uid);
        FirebaseDB.createAppointment = async () => { showDemoToast('Demo mode — not created'); return { id: 'demo' }; };
        FirebaseDB.updateAppointmentStatus = async (id, status) => { showDemoToast(`Demo mode — appointment ${status}`); };

        // --- Conversations / Messages ---
        FirebaseDB.getOrCreateConversation = async (clientId) => {
            const found = MOCK_CONVERSATIONS.find(c => c.participants.includes(clientId));
            return found || { id: 'conv-new', participants: [DEMO_ADMIN_UID, clientId], createdAt: makeTimestamp(new Date()) };
        };
        FirebaseDB.getMessagesListener = (convId, callback) => {
            setTimeout(() => callback(MOCK_MESSAGES[convId] || []), 100);
            return () => {};
        };
        FirebaseDB.sendMessage = async () => { showDemoToast('Demo mode — message not sent'); return { id: 'demo' }; };

        // --- Invite Codes ---
        FirebaseDB.getAllInviteCodes = async () => [...MOCK_INVITE_CODES];
        FirebaseDB.generateInviteCode = async () => { showDemoToast('Demo mode — code not generated'); return 'SW-DEMO-XXXX'; };
        FirebaseDB.deleteInviteCode = async () => { showDemoToast('Demo mode — code not deleted'); };
        FirebaseDB.verifyInviteCode = async () => ({ valid: false });
        FirebaseDB.useInviteCode = async () => {};

        // --- Module Requests ---
        FirebaseDB.getPendingModuleRequests = async () => [...MOCK_MODULE_REQUESTS];
        FirebaseDB.getPendingRequestsCount = async () => MOCK_MODULE_REQUESTS.length;
        FirebaseDB.approveModuleRequest = async () => { showDemoToast('Demo mode — not approved'); };
        FirebaseDB.denyModuleRequest = async () => { showDemoToast('Demo mode — not denied'); };
        FirebaseDB.getUserModuleRequests = async () => [];
        FirebaseDB.hasRequestedModule = async () => false;
        FirebaseDB.requestModuleAccess = async () => { showDemoToast('Demo mode'); return { id: 'demo' }; };
        FirebaseDB.grantUnlock = async () => { showDemoToast('Demo mode — not granted'); };
        FirebaseDB.getUserUnlocks = async (uid) => [
            ...(uid === 'client-001' ? [{ id: 'u-001', moduleId: 'sleep-science', moduleName: 'Sleep Science Fundamentals', grantedAt: makeTimestamp(new Date(Date.now() - 30 * 86400000)) }] : []),
            ...(uid === 'client-006' ? [{ id: 'u-002', moduleId: 'cbti-basics', moduleName: 'CBT-I: Basics', grantedAt: makeTimestamp(new Date(Date.now() - 20 * 86400000)) }] : [])
        ];

        // --- Questionnaires ---
        FirebaseDB.getAllPendingQuestionnaires = async () => MOCK_QUESTIONNAIRE_ASSIGNMENTS.filter(q => q.status === 'pending');
        FirebaseDB.getRecentCompletedQuestionnaires = async (limit) => MOCK_QUESTIONNAIRE_ASSIGNMENTS.filter(q => q.status === 'completed').slice(0, limit || 10);
        FirebaseDB.assignQuestionnaire = async () => { showDemoToast('Demo mode — not assigned'); };
        FirebaseDB.getUserQuestionnaires = async (uid) => MOCK_QUESTIONNAIRE_ASSIGNMENTS.filter(q => q.userId === uid);
        FirebaseDB.getUserPendingQuestionnaires = async (uid) => MOCK_QUESTIONNAIRE_ASSIGNMENTS.filter(q => q.userId === uid && q.status === 'pending');
        FirebaseDB.getUserQuestionnaireResults = async (uid) => MOCK_QUESTIONNAIRE_ASSIGNMENTS.filter(q => q.userId === uid && q.status === 'completed');
        FirebaseDB.getQuestionnaireAssignment = async (id) => MOCK_QUESTIONNAIRE_ASSIGNMENTS.find(q => q.id === id) || null;
        FirebaseDB.startQuestionnaire = async () => { showDemoToast('Demo mode'); };
        FirebaseDB.submitQuestionnaireResult = async () => { showDemoToast('Demo mode'); };

        // --- Tasks ---
        FirebaseDB.getAllClientTasks = async (status) => {
            if (status) return MOCK_CLIENT_TASKS.filter(t => t.status === status);
            return [...MOCK_CLIENT_TASKS];
        };
        FirebaseDB.getClientTasks = async (clientId, status) => {
            let tasks = MOCK_CLIENT_TASKS.filter(t => t.clientId === clientId);
            if (status) tasks = tasks.filter(t => t.status === status);
            return tasks;
        };
        FirebaseDB.getUserTasks = async (uid, status) => {
            let tasks = MOCK_CLIENT_TASKS.filter(t => t.clientId === uid);
            if (status) tasks = tasks.filter(t => t.status === status);
            return tasks;
        };
        FirebaseDB.createClientTask = async () => { showDemoToast('Demo mode — not created'); };
        FirebaseDB.completeTask = async () => { showDemoToast('Demo mode — not completed'); };
        FirebaseDB.deleteTask = async () => { showDemoToast('Demo mode — not deleted'); };
        FirebaseDB.updateTaskStatus = async () => { showDemoToast('Demo mode — not updated'); };

        // --- Diary ---
        FirebaseDB.getDiaryEntries = async (uid, limit) => {
            const all = generateDiaryEntries(uid, 14);
            return limit ? all.slice(-limit) : all;
        };
        FirebaseDB.saveDiaryEntry = async () => { showDemoToast('Demo mode — not saved'); return { id: 'demo' }; };

        // --- Notifications ---
        FirebaseDB.getUnreadNotifications = async () => MOCK_NOTIFICATIONS_ADMIN.filter(n => !n.read);
        FirebaseDB.markNotificationRead = async (id) => {
            const n = MOCK_NOTIFICATIONS_ADMIN.find(x => x.id === id);
            if (n) n.read = true;
        };
        FirebaseDB.createNotification = async () => {};

        // --- Profile writes ---
        FirebaseDB.createUserProfile = async () => DEMO_ADMIN_PROFILE;

        // --- Hotel Partners ---
        FirebaseDB.getAllHotelPartners = async () => [...MOCK_HOTEL_PARTNERS];
        FirebaseDB.getHotelPartner = async (partnerId) => MOCK_HOTEL_PARTNERS.find(p => p.id === partnerId) || null;
        FirebaseDB.createHotelPartner = async () => { showDemoToast('Demo mode — not saved'); return 'demo-hotel'; };
        FirebaseDB.updateHotelPartner = async () => { showDemoToast('Demo mode — not saved'); };
        FirebaseDB.deleteHotelPartner = async () => { showDemoToast('Demo mode — not deleted'); };

        FirebaseDB.getHotelPartnerStats = async (partnerId) => {
            const stays = MOCK_GUEST_STAYS.filter(s => s.hotelPartnerId === partnerId);
            const completedStays = stays.filter(s => s.stayStatus === 'checked-out' || s.stayStatus === 'report-sent');
            let totalImprovement = 0;
            let improvementCount = 0;
            completedStays.forEach(stay => {
                if (stay.baselineAssessments?.isi && stay.postStayAssessments?.isi) {
                    const improvement = ((stay.baselineAssessments.isi - stay.postStayAssessments.isi) / stay.baselineAssessments.isi) * 100;
                    if (improvement > 0) { totalImprovement += improvement; improvementCount++; }
                }
            });
            return {
                totalGuests: stays.length,
                activeGuests: stays.filter(s => s.stayStatus === 'active').length,
                completedStays: completedStays.length,
                avgImprovement: improvementCount > 0 ? Math.round(totalImprovement / improvementCount) : 0
            };
        };

        FirebaseDB.getHotelGuestStays = async (hotelPartnerId, status) => {
            let stays = MOCK_GUEST_STAYS.filter(s => s.hotelPartnerId === hotelPartnerId);
            if (status) stays = stays.filter(s => s.stayStatus === status);
            return stays.map(s => ({ ...s }));
        };

        FirebaseDB.getGuestStay = async (stayId) => {
            const stay = MOCK_GUEST_STAYS.find(s => s.id === stayId);
            return stay ? { ...stay } : null;
        };

        FirebaseDB.getStaysPendingReport = async () => {
            return MOCK_GUEST_STAYS
                .filter(s => s.stayStatus === 'checked-out')
                .map(s => ({
                    ...s,
                    hotelName: (MOCK_HOTEL_PARTNERS.find(p => p.id === s.hotelPartnerId) || {}).name || 'Unknown Hotel'
                }));
        };

        FirebaseDB.createGuestStay = async () => { showDemoToast('Demo mode — not saved'); return 'demo-stay'; };
        FirebaseDB.updateGuestStay = async () => { showDemoToast('Demo mode — not saved'); };
        FirebaseDB.completeGuestCheckout = async () => { showDemoToast('Demo mode — not saved'); };
        FirebaseDB.markReportSent = async () => { showDemoToast('Demo mode — not saved'); };
        FirebaseDB.recordBaselineAssessment = async () => { showDemoToast('Demo mode — not saved'); };
        FirebaseDB.recordPostStayAssessment = async () => { showDemoToast('Demo mode — not saved'); };
        FirebaseDB.incrementEngagement = async () => { showDemoToast('Demo mode — not saved'); };
        FirebaseDB.addIntervention = async () => { showDemoToast('Demo mode — not saved'); };
        FirebaseDB.updateUserHotelAffiliation = async () => { showDemoToast('Demo mode — not saved'); };
        FirebaseDB.getActiveGuestStay = async (userId) => {
            return MOCK_GUEST_STAYS.find(s => s.guestUserId === userId && s.stayStatus === 'active') || null;
        };
        FirebaseDB.getStayAssessments = async () => [];
        FirebaseDB.saveAssessmentWithContext = async () => { showDemoToast('Demo mode — not saved'); return 'demo'; };

        // --- Athletic Partners ---
        FirebaseDB.getAthleticPartner = async (partnerId) => MOCK_ATHLETIC_PARTNERS.find(p => p.id === partnerId) || null;

        // --- Business Partners ---
        FirebaseDB.getBusinessPartner = async (partnerId) => MOCK_BUSINESS_PARTNERS.find(p => p.id === partnerId) || null;

        console.log('[Admin Demo Mode] FirebaseDB methods overridden (including hotel, athletic, business)');
    }

    // ==================== AUTH OVERRIDE ====================

    function overrideAuth() {
        if (typeof auth !== 'undefined' && auth.onAuthStateChanged) {
            const original = auth.onAuthStateChanged.bind(auth);
            auth.onAuthStateChanged = function(callback) {
                const wrapped = (user) => {
                    if (!user && isDemoMode()) {
                        callback(DEMO_ADMIN_USER);
                        return;
                    }
                    callback(user);
                };
                return original(wrapped);
            };
        }

        if (typeof Auth !== 'undefined') {
            Auth.logout = function() {
                sessionStorage.removeItem('demoMode');
                window.location.href = '../auth.html';
            };
            Auth.isLoggedIn = function() { return true; };
            Auth.isAdmin = function() { return true; };
            Auth.requireAuth = function() {};
            Auth.requireAdmin = function() {};
        }
    }

    // ==================== DEMO BANNER ====================

    function showDemoBanner() {
        const banner = document.createElement('div');
        banner.id = 'demo-banner';
        banner.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 15px; flex-wrap: wrap;">
                <span style="font-size: 13px;">
                    <strong>Admin Demo Mode</strong> — Exploring with sample data
                </span>
                <a href="../auth.html" onclick="sessionStorage.removeItem('demoMode')"
                   style="background: white; color: #1a2744; padding: 6px 18px; font-size: 12px; font-weight: 600; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 2px;">
                    Exit Demo
                </a>
            </div>
        `;
        Object.assign(banner.style, {
            position: 'fixed', bottom: '0', left: '0', right: '0',
            background: 'linear-gradient(135deg, #1a2744, #243352)', color: '#c9a962',
            padding: '10px 20px', textAlign: 'center', zIndex: '100000',
            fontFamily: 'Montserrat, sans-serif', boxShadow: '0 -2px 10px rgba(0,0,0,0.2)'
        });
        document.body.appendChild(banner);
        document.body.style.paddingBottom = '50px';
    }

    // ==================== INIT ====================

    overrideFirestore();
    overrideFirebaseDB();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { overrideAuth(); showDemoBanner(); });
    } else {
        overrideAuth();
        showDemoBanner();
    }

    window.isDemoMode = isDemoMode;
    window.DEMO_ADMIN_USER = DEMO_ADMIN_USER;
    window.DEMO_ADMIN_PROFILE = DEMO_ADMIN_PROFILE;

})();
