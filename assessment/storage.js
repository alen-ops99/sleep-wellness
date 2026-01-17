/**
 * Storage Module - Handles localStorage for assessment data
 */

const Storage = {
    KEYS: {
        RESPONSES: 'sleepAssessment_responses',
        CURRENT_STEP: 'sleepAssessment_currentStep',
        CLIENT_TYPE: 'sleepAssessment_clientType',
        RESULTS: 'sleepAssessment_results',
        UNLOCK_CODES: 'sleepAssessment_unlockCodes',
        WEARABLE_DATA: 'sleepAssessment_wearableData'
    },

    /**
     * Save assessment responses
     */
    saveResponses(responses) {
        try {
            localStorage.setItem(this.KEYS.RESPONSES, JSON.stringify(responses));
            return true;
        } catch (e) {
            console.error('Error saving responses:', e);
            return false;
        }
    },

    /**
     * Get saved responses
     */
    getResponses() {
        try {
            const data = localStorage.getItem(this.KEYS.RESPONSES);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Error reading responses:', e);
            return {};
        }
    },

    /**
     * Save current step
     */
    saveCurrentStep(step) {
        try {
            localStorage.setItem(this.KEYS.CURRENT_STEP, step);
            return true;
        } catch (e) {
            console.error('Error saving step:', e);
            return false;
        }
    },

    /**
     * Get current step
     */
    getCurrentStep() {
        return localStorage.getItem(this.KEYS.CURRENT_STEP) || 'welcome';
    },

    /**
     * Save client type
     */
    saveClientType(type) {
        try {
            localStorage.setItem(this.KEYS.CLIENT_TYPE, type);
            return true;
        } catch (e) {
            console.error('Error saving client type:', e);
            return false;
        }
    },

    /**
     * Get client type
     */
    getClientType() {
        return localStorage.getItem(this.KEYS.CLIENT_TYPE) || null;
    },

    /**
     * Save results
     */
    saveResults(results) {
        try {
            localStorage.setItem(this.KEYS.RESULTS, JSON.stringify(results));
            return true;
        } catch (e) {
            console.error('Error saving results:', e);
            return false;
        }
    },

    /**
     * Get results
     */
    getResults() {
        try {
            const data = localStorage.getItem(this.KEYS.RESULTS);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading results:', e);
            return null;
        }
    },

    /**
     * Save unlock codes (hashed)
     */
    saveUnlockCode(codeHash, modules) {
        try {
            const existing = this.getUnlockCodes();
            existing[codeHash] = {
                modules: modules,
                unlockedAt: new Date().toISOString()
            };
            localStorage.setItem(this.KEYS.UNLOCK_CODES, JSON.stringify(existing));
            return true;
        } catch (e) {
            console.error('Error saving unlock code:', e);
            return false;
        }
    },

    /**
     * Get all unlock codes
     */
    getUnlockCodes() {
        try {
            const data = localStorage.getItem(this.KEYS.UNLOCK_CODES);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Error reading unlock codes:', e);
            return {};
        }
    },

    /**
     * Check if a module is unlocked
     */
    isModuleUnlocked(moduleId) {
        const codes = this.getUnlockCodes();
        for (const codeHash in codes) {
            if (codes[codeHash].modules.includes(moduleId) || codes[codeHash].modules.includes('all')) {
                return true;
            }
        }
        return false;
    },

    /**
     * Get all unlocked modules
     */
    getUnlockedModules() {
        const codes = this.getUnlockCodes();
        const modules = new Set();
        for (const codeHash in codes) {
            codes[codeHash].modules.forEach(m => modules.add(m));
        }
        return Array.from(modules);
    },

    /**
     * Add a module to unlocked (from Firebase)
     */
    addUnlockedModule(moduleId) {
        const codes = this.getUnlockCodes();
        const firebaseKey = 'firebase_unlocks';
        if (!codes[firebaseKey]) {
            codes[firebaseKey] = { modules: [], unlockedAt: new Date().toISOString() };
        }
        if (!codes[firebaseKey].modules.includes(moduleId)) {
            codes[firebaseKey].modules.push(moduleId);
            localStorage.setItem(this.KEYS.UNLOCK_CODES, JSON.stringify(codes));
        }
    },

    /**
     * Save wearable data
     */
    saveWearableData(data) {
        try {
            localStorage.setItem(this.KEYS.WEARABLE_DATA, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving wearable data:', e);
            return false;
        }
    },

    /**
     * Get wearable data
     */
    getWearableData() {
        try {
            const data = localStorage.getItem(this.KEYS.WEARABLE_DATA);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading wearable data:', e);
            return null;
        }
    },

    /**
     * Check if there's saved progress
     */
    hasSavedProgress() {
        const step = this.getCurrentStep();
        const responses = this.getResponses();
        return step !== 'welcome' && Object.keys(responses).length > 0;
    },

    /**
     * Clear all assessment data
     */
    clearAssessment() {
        try {
            localStorage.removeItem(this.KEYS.RESPONSES);
            localStorage.removeItem(this.KEYS.CURRENT_STEP);
            localStorage.removeItem(this.KEYS.CLIENT_TYPE);
            localStorage.removeItem(this.KEYS.RESULTS);
            localStorage.removeItem(this.KEYS.WEARABLE_DATA);
            // Note: We don't clear unlock codes - they persist
            return true;
        } catch (e) {
            console.error('Error clearing assessment:', e);
            return false;
        }
    },

    /**
     * Export all data as JSON
     */
    exportData() {
        return {
            responses: this.getResponses(),
            clientType: this.getClientType(),
            results: this.getResults(),
            wearableData: this.getWearableData(),
            exportedAt: new Date().toISOString()
        };
    },

    /**
     * Hash a string using SHA-256
     */
    async hashCode(code) {
        const encoder = new TextEncoder();
        const data = encoder.encode(code.toUpperCase().trim());
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
};

// Make available globally
window.Storage = Storage;
