/**
 * Authentication Module
 */

const Auth = {
    currentUser: null,
    userProfile: null,

    /**
     * Initialize auth state listener
     */
    init() {
        auth.onAuthStateChanged(async (user) => {
            this.currentUser = user;

            if (user) {
                // Create/update user profile
                await FirebaseDB.createUserProfile(user);
                this.userProfile = await FirebaseDB.getUserProfile(user.uid);

                // Update UI
                this.updateAuthUI(true);

                // Check for redirect
                this.handleAuthRedirect();
            } else {
                this.userProfile = null;
                this.updateAuthUI(false);
            }
        });
    },

    /**
     * Register with email/password
     */
    async register(email, password, displayName, clientType) {
        try {
            const { user } = await auth.createUserWithEmailAndPassword(email, password);

            // Update display name
            await user.updateProfile({ displayName });

            // Create user profile with additional data
            await FirebaseDB.createUserProfile(user, { displayName, clientType });

            return { success: true, user };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    },

    /**
     * Login with email/password
     */
    async login(email, password) {
        try {
            const { user } = await auth.signInWithEmailAndPassword(email, password);
            return { success: true, user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    },

    /**
     * Login with Google
     */
    async loginWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const { user } = await auth.signInWithPopup(provider);
            return { success: true, user };
        } catch (error) {
            console.error('Google login error:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    },

    /**
     * Logout
     */
    async logout() {
        try {
            await auth.signOut();
            window.location.href = 'auth.html';
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    /**
     * Send password reset email
     */
    async resetPassword(email) {
        try {
            await auth.sendPasswordResetEmail(email);
            return { success: true };
        } catch (error) {
            console.error('Password reset error:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    },

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return !!this.currentUser;
    },

    /**
     * Check if current user is admin
     */
    isAdmin() {
        return this.userProfile && this.userProfile.role === 'admin';
    },

    /**
     * Require authentication - redirect if not logged in
     */
    requireAuth() {
        if (!this.currentUser) {
            const returnUrl = encodeURIComponent(window.location.pathname);
            window.location.href = `auth.html?redirect=${returnUrl}`;
            return false;
        }
        return true;
    },

    /**
     * Require admin - redirect if not admin
     */
    requireAdmin() {
        if (!this.isAdmin()) {
            window.location.href = 'account.html';
            return false;
        }
        return true;
    },

    /**
     * Handle redirect after auth
     */
    handleAuthRedirect() {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');

        if (redirect && window.location.pathname.includes('auth.html')) {
            window.location.href = decodeURIComponent(redirect);
        }
    },

    /**
     * Update UI based on auth state
     */
    updateAuthUI(isLoggedIn) {
        // Update nav elements
        const authLinks = document.querySelectorAll('[data-auth]');
        authLinks.forEach(el => {
            const authState = el.dataset.auth;
            if (authState === 'logged-in') {
                el.style.display = isLoggedIn ? '' : 'none';
            } else if (authState === 'logged-out') {
                el.style.display = isLoggedIn ? 'none' : '';
            }
        });

        // Update user name displays
        if (isLoggedIn && this.userProfile) {
            document.querySelectorAll('[data-user-name]').forEach(el => {
                el.textContent = this.userProfile.displayName || this.currentUser.email;
            });
            document.querySelectorAll('[data-user-email]').forEach(el => {
                el.textContent = this.currentUser.email;
            });
        }
    },

    /**
     * Get user-friendly error message
     */
    getErrorMessage(code) {
        const messages = {
            'auth/email-already-in-use': 'This email is already registered. Please log in instead.',
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/operation-not-allowed': 'This sign-in method is not enabled.',
            'auth/weak-password': 'Password should be at least 6 characters.',
            'auth/user-disabled': 'This account has been disabled.',
            'auth/user-not-found': 'No account found with this email.',
            'auth/wrong-password': 'Incorrect password. Please try again.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
            'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
            'auth/network-request-failed': 'Network error. Please check your connection.'
        };
        return messages[code] || 'An error occurred. Please try again.';
    }
};

// Make available globally
window.Auth = Auth;
