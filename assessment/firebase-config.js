/**
 * Firebase Configuration
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project (or use existing)
 * 3. Enable Authentication > Sign-in methods: Email/Password and Google
 * 4. Create Firestore Database (start in test mode, then add rules)
 * 5. Go to Project Settings > General > Your apps > Add web app
 * 6. Copy the firebaseConfig values below
 * 7. Add your domain to Authentication > Settings > Authorized domains
 */

// Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDk0RtuOnqQDt_6KmclVUwfOkIp_1YLdNI",
    authDomain: "sleep-wellness-48d57.firebaseapp.com",
    projectId: "sleep-wellness-48d57",
    storageBucket: "sleep-wellness-48d57.firebasestorage.app",
    messagingSenderId: "385115156051",
    appId: "1:385115156051:web:55c392a064644fd50aa0a6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence for Firestore
db.enablePersistence().catch((err) => {
    if (err.code === 'failed-precondition') {
        console.log('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
        console.log('Persistence not available in this browser');
    }
});

/**
 * Firestore Security Rules (copy to Firebase Console > Firestore > Rules):
 *
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Assessments - users can create/read their own, admin can read all
    match /assessments/{assessmentId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    // Messages - participants can read/write
    match /conversations/{convId} {
      allow read, write: if request.auth != null &&
        (request.auth.uid in resource.data.participants ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');

      match /messages/{msgId} {
        allow read, write: if request.auth != null &&
          (request.auth.uid in get(/databases/$(database)/documents/conversations/$(convId)).data.participants ||
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      }
    }

    // Appointments - users can manage their own, admin can manage all
    match /appointments/{apptId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    // Sleep diary entries
    match /diaryEntries/{entryId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    // Unlocks - users can read their own, admin can manage all
    match /unlocks/{unlockId} {
      allow read: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create, update: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Invite codes - anyone can read (for verification), admin can manage
    match /inviteCodes/{codeId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
 */

// Admin UID - Dr. Alen Juginovic
const ADMIN_UID = 'iHDuOEJXsQe7dL5C4QwA3fLX9zi2';

// Admin emails - users with these emails will automatically become admins
const ADMIN_EMAILS = [
    'juginovic.alen@gmail.com',
    'alen_juginovic@hms.harvard.edu',
    'laura.rodman@medx.hr'
];

/**
 * Check if user should be admin
 */
function isAdminUser(user) {
    if (user.uid === ADMIN_UID) return true;
    if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) return true;
    return false;
}

/**
 * Firebase Helper Functions
 */
const FirebaseDB = {
    /**
     * Create or update user profile
     */
    async createUserProfile(user, additionalData = {}) {
        if (!user) return;

        const userRef = db.collection('users').doc(user.uid);
        const snapshot = await userRef.get();

        if (!snapshot.exists) {
            const { email, displayName, photoURL } = user;
            const createdAt = firebase.firestore.FieldValue.serverTimestamp();

            try {
                await userRef.set({
                    email,
                    displayName: displayName || additionalData.displayName || '',
                    photoURL: photoURL || '',
                    role: isAdminUser(user) ? 'admin' : 'client',
                    clientType: additionalData.clientType || null,
                    createdAt,
                    lastLogin: createdAt,
                    onboardingComplete: false,
                    ...additionalData
                });
            } catch (error) {
                console.error('Error creating user profile:', error);
            }
        } else {
            // Update last login
            await userRef.update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        return userRef;
    },

    /**
     * Get user profile
     */
    async getUserProfile(uid) {
        const doc = await db.collection('users').doc(uid).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    },

    /**
     * Check if user is admin
     */
    async isAdmin(uid) {
        const profile = await this.getUserProfile(uid);
        return profile && profile.role === 'admin';
    },

    /**
     * Save assessment results
     */
    async saveAssessment(userId, results) {
        const assessment = {
            userId,
            ...results,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'submitted'
        };

        const docRef = await db.collection('assessments').add(assessment);
        return docRef.id;
    },

    /**
     * Get user's assessments
     */
    async getUserAssessments(userId) {
        try {
            const snapshot = await db.collection('assessments')
                .where('userId', '==', userId)
                .get();

            const assessments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Sort by createdAt client-side (descending)
            assessments.sort((a, b) => {
                const aTime = a.createdAt?.toDate?.() || new Date(0);
                const bTime = b.createdAt?.toDate?.() || new Date(0);
                return bTime - aTime;
            });

            return assessments;
        } catch (error) {
            console.error('Error getting user assessments:', error);
            return [];
        }
    },

    /**
     * Get all assessments (admin)
     */
    async getAllAssessments() {
        const snapshot = await db.collection('assessments')
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    /**
     * Create or get conversation
     */
    async getOrCreateConversation(userId, adminId) {
        // Check if conversation exists
        const snapshot = await db.collection('conversations')
            .where('participants', 'array-contains', userId)
            .get();

        let conversation = snapshot.docs.find(doc =>
            doc.data().participants.includes(adminId)
        );

        if (conversation) {
            return { id: conversation.id, ...conversation.data() };
        }

        // Create new conversation
        const newConv = {
            participants: [userId, adminId],
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastMessage: null,
            lastMessageAt: null
        };

        const docRef = await db.collection('conversations').add(newConv);
        return { id: docRef.id, ...newConv };
    },

    /**
     * Send message
     */
    async sendMessage(conversationId, senderId, text) {
        const message = {
            senderId,
            text,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            read: false
        };

        await db.collection('conversations').doc(conversationId)
            .collection('messages').add(message);

        // Update conversation last message
        await db.collection('conversations').doc(conversationId).update({
            lastMessage: text.substring(0, 100),
            lastMessageAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastSenderId: senderId
        });
    },

    /**
     * Get messages for conversation
     */
    getMessagesListener(conversationId, callback) {
        return db.collection('conversations').doc(conversationId)
            .collection('messages')
            .orderBy('createdAt', 'asc')
            .onSnapshot(snapshot => {
                const messages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(messages);
            });
    },

    /**
     * Save diary entry
     */
    async saveDiaryEntry(userId, entry) {
        const diaryEntry = {
            userId,
            ...entry,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('diaryEntries').add(diaryEntry);
        return docRef.id;
    },

    /**
     * Get user's diary entries
     */
    async getDiaryEntries(userId, limit = 30) {
        try {
            const snapshot = await db.collection('diaryEntries')
                .where('userId', '==', userId)
                .get();

            const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Sort by date client-side (descending)
            entries.sort((a, b) => {
                const dateA = a.date || '';
                const dateB = b.date || '';
                return dateB.localeCompare(dateA);
            });

            return entries.slice(0, limit);
        } catch (error) {
            console.error('Error getting diary entries:', error);
            return [];
        }
    },

    /**
     * Create appointment
     */
    async createAppointment(userId, appointmentData) {
        const appointment = {
            userId,
            ...appointmentData,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('appointments').add(appointment);
        return docRef.id;
    },

    /**
     * Get user's appointments
     */
    async getUserAppointments(userId) {
        try {
            const snapshot = await db.collection('appointments')
                .where('userId', '==', userId)
                .get();

            const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Sort by dateTime client-side (descending)
            appointments.sort((a, b) => {
                const aTime = a.dateTime?.toDate?.() || new Date(0);
                const bTime = b.dateTime?.toDate?.() || new Date(0);
                return bTime - aTime;
            });

            return appointments;
        } catch (error) {
            console.error('Error getting user appointments:', error);
            return [];
        }
    },

    /**
     * Get all appointments (admin)
     */
    async getAllAppointments() {
        const snapshot = await db.collection('appointments')
            .orderBy('dateTime', 'asc')
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    /**
     * Update appointment status
     */
    async updateAppointmentStatus(appointmentId, status, notes = '') {
        await db.collection('appointments').doc(appointmentId).update({
            status,
            adminNotes: notes,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    },

    /**
     * Grant unlock to user
     */
    async grantUnlock(userId, modules, grantedBy, notes = '') {
        const unlock = {
            userId,
            modules,
            grantedBy,
            notes,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('unlocks').add(unlock);
        return docRef.id;
    },

    /**
     * Get user's unlocks
     */
    async getUserUnlocks(userId) {
        const snapshot = await db.collection('unlocks')
            .where('userId', '==', userId)
            .get();

        const modules = new Set();
        snapshot.docs.forEach(doc => {
            doc.data().modules.forEach(m => modules.add(m));
        });

        return Array.from(modules);
    },

    /**
     * Get all users (admin)
     */
    async getAllUsers() {
        try {
            const snapshot = await db.collection('users')
                .where('role', '==', 'client')
                .get();

            const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort by createdAt client-side
            users.sort((a, b) => {
                const aTime = a.createdAt?.toDate?.() || new Date(0);
                const bTime = b.createdAt?.toDate?.() || new Date(0);
                return bTime - aTime;
            });
            return users;
        } catch (error) {
            console.error('Error getting users:', error);
            return [];
        }
    },

    /**
     * Get analytics data (admin)
     */
    async getAnalytics() {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [users, assessments, appointments] = await Promise.all([
            db.collection('users').where('role', '==', 'client').get(),
            db.collection('assessments').get(),
            db.collection('appointments').get()
        ]);

        const recentAssessments = assessments.docs.filter(doc => {
            const createdAt = doc.data().createdAt?.toDate();
            return createdAt && createdAt >= thirtyDaysAgo;
        });

        return {
            totalClients: users.size,
            totalAssessments: assessments.size,
            recentAssessments: recentAssessments.length,
            pendingAppointments: appointments.docs.filter(d => d.data().status === 'pending').length,
            upcomingAppointments: appointments.docs.filter(d => {
                const dt = d.data().dateTime?.toDate();
                return dt && dt >= now && d.data().status === 'confirmed';
            }).length
        };
    },

    /**
     * Generate invite code (admin)
     */
    async generateInviteCode(adminId, clientEmail = null, notes = '') {
        // Generate a unique code: SW-XXXX-XXXX format
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing chars
        let code = 'SW-';
        for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
        code += '-';
        for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];

        const invite = {
            code,
            createdBy: adminId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            clientEmail: clientEmail || null,
            notes,
            used: false,
            usedBy: null,
            usedAt: null
        };

        await db.collection('inviteCodes').doc(code).set(invite);
        return code;
    },

    /**
     * Verify invite code (for registration)
     */
    async verifyInviteCode(code) {
        try {
            const doc = await db.collection('inviteCodes').doc(code.toUpperCase()).get();

            if (!doc.exists) {
                return { valid: false, error: 'Invalid invite code.' };
            }

            const invite = doc.data();

            if (invite.used) {
                return { valid: false, error: 'This invite code has already been used.' };
            }

            return { valid: true, invite };
        } catch (error) {
            console.error('Error verifying invite code:', error);
            return { valid: false, error: 'Unable to verify invite code. Please try again.' };
        }
    },

    /**
     * Mark invite code as used
     */
    async useInviteCode(code, userId) {
        await db.collection('inviteCodes').doc(code.toUpperCase()).update({
            used: true,
            usedBy: userId,
            usedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    },

    /**
     * Get all invite codes (admin)
     */
    async getAllInviteCodes() {
        const snapshot = await db.collection('inviteCodes')
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    /**
     * Delete unused invite code (admin)
     */
    async deleteInviteCode(code) {
        const doc = await db.collection('inviteCodes').doc(code).get();
        if (doc.exists && !doc.data().used) {
            await db.collection('inviteCodes').doc(code).delete();
            return true;
        }
        return false;
    },

    /**
     * Request module access (client)
     */
    async requestModuleAccess(userId, moduleId, moduleName, reason) {
        const request = {
            userId,
            moduleId,
            moduleName,
            reason: reason || '',
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('moduleRequests').add(request);
        return docRef.id;
    },

    /**
     * Get user's pending module requests
     */
    async getUserModuleRequests(userId) {
        const snapshot = await db.collection('moduleRequests')
            .where('userId', '==', userId)
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    /**
     * Check if user already requested a module
     */
    async hasRequestedModule(userId, moduleId) {
        const snapshot = await db.collection('moduleRequests')
            .where('userId', '==', userId)
            .where('moduleId', '==', moduleId)
            .where('status', '==', 'pending')
            .get();

        return !snapshot.empty;
    },

    /**
     * Get all pending module requests (admin)
     */
    async getPendingModuleRequests() {
        const snapshot = await db.collection('moduleRequests')
            .where('status', '==', 'pending')
            .get();

        const requests = [];
        for (const doc of snapshot.docs) {
            const data = doc.data();
            const userProfile = await this.getUserProfile(data.userId);
            requests.push({
                id: doc.id,
                ...data,
                userName: userProfile?.displayName || userProfile?.email || 'Unknown',
                userEmail: userProfile?.email || ''
            });
        }

        // Sort by createdAt descending
        requests.sort((a, b) => {
            const aTime = a.createdAt?.toDate?.() || new Date(0);
            const bTime = b.createdAt?.toDate?.() || new Date(0);
            return bTime - aTime;
        });

        return requests;
    },

    /**
     * Approve module request (admin)
     */
    async approveModuleRequest(requestId) {
        const requestDoc = await db.collection('moduleRequests').doc(requestId).get();
        if (!requestDoc.exists) return false;

        const request = requestDoc.data();

        // Grant the module access
        await this.grantUnlock(request.userId, [request.moduleId], ADMIN_UID, 'Approved from request');

        // Update request status
        await db.collection('moduleRequests').doc(requestId).update({
            status: 'approved',
            resolvedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        return true;
    },

    /**
     * Deny module request (admin)
     */
    async denyModuleRequest(requestId, reason = '') {
        await db.collection('moduleRequests').doc(requestId).update({
            status: 'denied',
            denyReason: reason,
            resolvedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        return true;
    },

    /**
     * Get count of pending requests (admin)
     */
    async getPendingRequestsCount() {
        const snapshot = await db.collection('moduleRequests')
            .where('status', '==', 'pending')
            .get();

        return snapshot.size;
    },

    // ==================== QUESTIONNAIRE FUNCTIONS ====================

    /**
     * Assign questionnaire to client (admin)
     */
    async assignQuestionnaire(userId, instrumentId, instrumentName, dueDate = null, notes = '') {
        const assignment = {
            userId,
            instrumentId,
            instrumentName,
            status: 'pending', // pending, in_progress, completed
            dueDate: dueDate ? new Date(dueDate) : null,
            notes,
            assignedBy: ADMIN_UID,
            assignedAt: firebase.firestore.FieldValue.serverTimestamp(),
            completedAt: null,
            result: null
        };

        const docRef = await db.collection('questionnaireAssignments').add(assignment);
        return docRef.id;
    },

    /**
     * Get user's assigned questionnaires (client)
     */
    async getUserQuestionnaires(userId) {
        const snapshot = await db.collection('questionnaireAssignments')
            .where('userId', '==', userId)
            .orderBy('assignedAt', 'desc')
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    /**
     * Get user's pending questionnaires (client)
     */
    async getUserPendingQuestionnaires(userId) {
        const snapshot = await db.collection('questionnaireAssignments')
            .where('userId', '==', userId)
            .where('status', 'in', ['pending', 'in_progress'])
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    /**
     * Start a questionnaire (mark as in_progress)
     */
    async startQuestionnaire(assignmentId) {
        await db.collection('questionnaireAssignments').doc(assignmentId).update({
            status: 'in_progress',
            startedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    },

    /**
     * Submit questionnaire results (client)
     */
    async submitQuestionnaireResult(assignmentId, answers, result) {
        await db.collection('questionnaireAssignments').doc(assignmentId).update({
            status: 'completed',
            completedAt: firebase.firestore.FieldValue.serverTimestamp(),
            answers,
            result: {
                score: result.score,
                maxScore: result.maxScore,
                severity: result.severity,
                label: result.label,
                description: result.description
            }
        });

        // Create notification for admin
        await this.createNotification(
            ADMIN_UID,
            'questionnaire_completed',
            `Questionnaire completed: ${result.instrumentName}`,
            `Score: ${result.score}/${result.maxScore} - ${result.label}`,
            { assignmentId, userId: (await db.collection('questionnaireAssignments').doc(assignmentId).get()).data().userId }
        );

        return true;
    },

    /**
     * Get all questionnaire results for a user (admin)
     */
    async getUserQuestionnaireResults(userId) {
        const snapshot = await db.collection('questionnaireAssignments')
            .where('userId', '==', userId)
            .where('status', '==', 'completed')
            .orderBy('completedAt', 'desc')
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    /**
     * Get all pending questionnaire assignments (admin)
     */
    async getAllPendingQuestionnaires() {
        const snapshot = await db.collection('questionnaireAssignments')
            .where('status', 'in', ['pending', 'in_progress'])
            .get();

        const assignments = [];
        for (const doc of snapshot.docs) {
            const data = doc.data();
            const userProfile = await this.getUserProfile(data.userId);
            assignments.push({
                id: doc.id,
                ...data,
                userName: userProfile?.displayName || userProfile?.email || 'Unknown',
                userEmail: userProfile?.email || ''
            });
        }

        return assignments;
    },

    /**
     * Get recently completed questionnaires (admin)
     */
    async getRecentCompletedQuestionnaires(limit = 10) {
        const snapshot = await db.collection('questionnaireAssignments')
            .where('status', '==', 'completed')
            .orderBy('completedAt', 'desc')
            .limit(limit)
            .get();

        const results = [];
        for (const doc of snapshot.docs) {
            const data = doc.data();
            const userProfile = await this.getUserProfile(data.userId);
            results.push({
                id: doc.id,
                ...data,
                userName: userProfile?.displayName || userProfile?.email || 'Unknown',
                userEmail: userProfile?.email || ''
            });
        }

        return results;
    },

    /**
     * Create a notification
     */
    async createNotification(userId, type, title, message, data = {}) {
        await db.collection('notifications').add({
            userId,
            type,
            title,
            message,
            data,
            read: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    },

    /**
     * Get unread notifications for user
     */
    async getUnreadNotifications(userId) {
        const snapshot = await db.collection('notifications')
            .where('userId', '==', userId)
            .where('read', '==', false)
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    /**
     * Mark notification as read
     */
    async markNotificationRead(notificationId) {
        await db.collection('notifications').doc(notificationId).update({
            read: true,
            readAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    },

    /**
     * Get questionnaire assignment by ID
     */
    async getQuestionnaireAssignment(assignmentId) {
        const doc = await db.collection('questionnaireAssignments').doc(assignmentId).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    },

    // ==================== TASK FUNCTIONS ====================

    /**
     * Create a task for a client (admin)
     */
    async createClientTask(clientId, taskData) {
        const task = {
            clientId,
            ...taskData,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: ADMIN_UID
        };

        const docRef = await db.collection('clientTasks').add(task);
        return docRef.id;
    },

    /**
     * Get user's pending tasks (client)
     */
    async getUserTasks(userId, status = 'pending') {
        try {
            const snapshot = await db.collection('clientTasks')
                .where('clientId', '==', userId)
                .where('status', '==', status)
                .get();

            const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Sort by dueDate client-side
            tasks.sort((a, b) => {
                const aDate = a.dueDate?.toDate?.() || new Date(9999, 11, 31);
                const bDate = b.dueDate?.toDate?.() || new Date(9999, 11, 31);
                return aDate - bDate;
            });

            return tasks;
        } catch (error) {
            console.error('Error getting user tasks:', error);
            return [];
        }
    },

    /**
     * Complete a task (client)
     */
    async completeTask(taskId) {
        await db.collection('clientTasks').doc(taskId).update({
            status: 'completed',
            completedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Notify admin
        const task = await db.collection('clientTasks').doc(taskId).get();
        if (task.exists) {
            const taskData = task.data();
            await this.createNotification(
                ADMIN_UID,
                'task_completed',
                'Task Completed',
                `${taskData.clientName || 'A client'} completed: "${taskData.title}"`,
                { taskId, clientId: taskData.clientId }
            );
        }
    },

    /**
     * Get all client tasks (admin)
     */
    async getAllClientTasks(status = null) {
        try {
            let query = db.collection('clientTasks');

            if (status) {
                query = query.where('status', '==', status);
            }

            const snapshot = await query.get();
            const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Sort by createdAt descending
            tasks.sort((a, b) => {
                const aTime = a.createdAt?.toDate?.() || new Date(0);
                const bTime = b.createdAt?.toDate?.() || new Date(0);
                return bTime - aTime;
            });

            return tasks;
        } catch (error) {
            console.error('Error getting client tasks:', error);
            return [];
        }
    },

    /**
     * Get tasks for a specific client (admin)
     */
    async getClientTasks(clientId, status = null) {
        try {
            let query = db.collection('clientTasks')
                .where('clientId', '==', clientId);

            if (status) {
                query = query.where('status', '==', status);
            }

            const snapshot = await query.get();
            const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            tasks.sort((a, b) => {
                const aDate = a.dueDate?.toDate?.() || new Date(9999, 11, 31);
                const bDate = b.dueDate?.toDate?.() || new Date(9999, 11, 31);
                return aDate - bDate;
            });

            return tasks;
        } catch (error) {
            console.error('Error getting client tasks:', error);
            return [];
        }
    },

    /**
     * Delete a task (admin)
     */
    async deleteTask(taskId) {
        await db.collection('clientTasks').doc(taskId).delete();
    },

    /**
     * Update task status (admin)
     */
    async updateTaskStatus(taskId, status, notes = '') {
        await db.collection('clientTasks').doc(taskId).update({
            status,
            adminNotes: notes,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
};

// Make available globally
window.auth = auth;
window.db = db;
window.FirebaseDB = FirebaseDB;
window.ADMIN_UID = ADMIN_UID;
