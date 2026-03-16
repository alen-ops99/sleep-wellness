/**
 * Main Application Module - Controls assessment flow
 */

const App = {
    // Step definitions in order
    steps: [
        'welcome',
        'clientType',
        'demographics',
        'sleepSchedule',
        'epworth',
        'isi',
        'stopbang',
        'disorders',
        'environment',
        'clientSpecific',
        'results'
    ],

    currentStep: 'welcome',
    responses: {},
    clientType: null,

    /**
     * Initialize the application
     */
    init() {
        // Load saved data
        this.responses = Storage.getResponses() || {};
        this.clientType = Storage.getClientType() || null;
        const savedStep = Storage.getCurrentStep();

        // Default to welcome if no saved step or invalid step
        if (savedStep && this.steps.includes(savedStep)) {
            this.currentStep = savedStep;
        } else {
            this.currentStep = 'welcome';
        }

        // Check for saved progress
        const resumeNotice = document.getElementById('resumeNotice');
        if (resumeNotice && Storage.hasSavedProgress() && this.currentStep !== 'welcome' && this.currentStep !== 'results') {
            resumeNotice.style.display = 'block';
        }

        // Render step indicators
        this.renderStepIndicators();

        // Render questionnaires
        this.renderQuestionnaires();

        // Set up event listeners
        this.setupEventListeners();

        // Show current step
        this.showStep(this.currentStep);

        // Update progress
        this.updateProgress();
    },

    /**
     * Render step indicators
     */
    renderStepIndicators() {
        const container = document.getElementById('stepIndicators');
        if (!container) return;

        let html = '';
        this.steps.forEach((step, index) => {
            const isActive = step === this.currentStep;
            const isCompleted = this.steps.indexOf(this.currentStep) > index;
            html += `<div class="step-dot ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" data-step="${step}"></div>`;
        });
        container.innerHTML = html;
    },

    /**
     * Render questionnaire questions
     */
    renderQuestionnaires() {
        try {
            if (typeof Questionnaires !== 'undefined' && Questionnaires.renderQuestions) {
                Questionnaires.renderQuestions(Questionnaires.epworth, 'epworthQuestions', this.responses);
                Questionnaires.renderQuestions(Questionnaires.isi, 'isiQuestions', this.responses);
            } else {
                console.warn('Questionnaires.renderQuestions not available');
            }
            this.renderStopBangQuestions();
            this.renderDisorderQuestions();
        } catch (error) {
            console.error('Error rendering questionnaires:', error);
        }
    },

    /**
     * Render STOP-BANG questions (only manual ones)
     */
    renderStopBangQuestions() {
        const container = document.getElementById('stopbangQuestions');
        if (!container) return;

        // STOP-BANG questions 1-4 are manually answered (S, T, O, P);
        // questions 5-8 (B, A, N, G) are calculated from demographics.
        // Only render manual questions (first 4).
        const manualQuestions = Questionnaires.stopbang.questions.filter(q => q.id <= 4);

        let html = '';
        manualQuestions.forEach((q, index) => {
            const questionKey = `stopbang_q${q.id}`;
            const savedValue = this.responses[questionKey];
            // Options are {value: 1, label: 'Yes'} and {value: 0, label: 'No'}
            const yesSelected = String(savedValue) === '1' ? 'selected' : '';
            const noSelected = String(savedValue) === '0' ? 'selected' : '';

            html += `
                <div class="questionnaire-item yes-no">
                    <div class="question">${index + 1}. ${q.text}</div>
                    <div class="options">
                        <button type="button" class="option-btn ${yesSelected}" data-question="${questionKey}" data-value="1">Yes</button>
                        <button type="button" class="option-btn ${noSelected}" data-question="${questionKey}" data-value="0">No</button>
                    </div>
                </div>
            `;
        });

        // Add note about calculated fields
        html += `
            <div class="questionnaire-item" style="background: rgba(201, 169, 98, 0.1); border-color: var(--gold);">
                <div class="question" style="color: var(--gold-dark);">
                    <strong>Note:</strong> The remaining STOP-BANG criteria (BMI, Age, Neck circumference, Gender)
                    are calculated automatically from your demographic information.
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Add click handlers
        container.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const questionId = btn.dataset.question;
                const value = btn.dataset.value;
                btn.parentElement.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.saveResponse(questionId, value);
            });
        });
    },

    /**
     * Render disorder screening questions
     */
    renderDisorderQuestions() {
        // RLS
        Questionnaires.renderQuestions(Questionnaires.rls, 'rlsQuestions', this.responses);

        // Parasomnias
        Questionnaires.renderQuestions(Questionnaires.parasomnias, 'parasomniasQuestions', this.responses);

        // REM Behavior
        Questionnaires.renderQuestions(Questionnaires.remBehavior, 'remQuestions', this.responses);

        // Circadian
        Questionnaires.renderQuestions(Questionnaires.circadian, 'circadianQuestions', this.responses);
    },

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Form inputs
        document.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('change', (e) => {
                this.saveResponse(e.target.name || e.target.id, e.target.value);
            });
        });

        // Modal close on backdrop click
        const modal = document.getElementById('contentModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    Content.closeModal();
                }
            });
        }

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                Content.closeModal();
            }
        });
    },

    /**
     * Save a response
     */
    saveResponse(key, value) {
        if (!key) return;
        this.responses[key] = value;
        Storage.saveResponses(this.responses);
    },

    /**
     * Start the assessment
     */
    startAssessment() {
        try {
            this.currentStep = 'clientType';
            Storage.saveCurrentStep('clientType');

            // Force show the clientType step
            const allSections = document.querySelectorAll('.step-section');

            allSections.forEach(section => {
                section.classList.remove('active');
                section.style.display = 'none';
            });

            const clientTypeSection = document.querySelector('[data-step="clientType"]');
            if (clientTypeSection) {
                clientTypeSection.classList.add('active');
                clientTypeSection.style.display = 'block';
                clientTypeSection.style.visibility = 'visible';
            } else {
                console.error('ClientType section NOT FOUND');
                alert('Error: Could not find client type section');
            }

            this.updateProgress();
            this.renderStepIndicators();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error in startAssessment:', error);
            alert('Error starting assessment: ' + error.message);
        }
    },

    /**
     * Resume from saved progress
     */
    resumeAssessment() {
        // Restore form values
        this.restoreFormValues();
        this.showStep(this.currentStep);
    },

    /**
     * Clear saved data and restart
     */
    clearAndRestart() {
        Storage.clearAssessment();
        this.responses = {};
        this.clientType = null;
        this.currentStep = 'welcome';
        const resumeNotice = document.getElementById('resumeNotice');
        if (resumeNotice) resumeNotice.style.display = 'none';
        this.showStep('welcome');
    },

    /**
     * Restart assessment
     */
    restartAssessment() {
        if (confirm('Are you sure you want to start a new assessment? Your current results will be saved.')) {
            Storage.clearAssessment();
            this.responses = {};
            this.clientType = null;
            location.reload();
        }
    },

    /**
     * Select client type
     */
    selectClientType(type) {
        // Update UI
        document.querySelectorAll('.client-type-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-type="${type}"]`).classList.add('selected');

        // Save
        this.clientType = type;
        Storage.saveClientType(type);

        // Update client-specific section
        this.updateClientSpecificSection();

        // Auto-advance after short delay
        setTimeout(() => {
            this.goToStep('demographics');
        }, 300);
    },

    /**
     * Update client-specific section based on type
     */
    updateClientSpecificSection() {
        // Hide all sections
        document.getElementById('athleteQuestions').style.display = 'none';
        document.getElementById('executiveQuestions').style.display = 'none';
        document.getElementById('hotelQuestions').style.display = 'none';

        // Show relevant section
        const type = this.clientType || Storage.getClientType();
        const titleEl = document.getElementById('clientSpecificTitle');
        const subtitleEl = document.getElementById('clientSpecificSubtitle');

        if (type === 'athlete') {
            document.getElementById('athleteQuestions').style.display = 'block';
            if (titleEl) titleEl.textContent = 'Athlete-Specific Questions';
            if (subtitleEl) subtitleEl.textContent = 'Help us understand your training and competition patterns.';
        } else if (type === 'executive') {
            document.getElementById('executiveQuestions').style.display = 'block';
            if (titleEl) titleEl.textContent = 'Executive-Specific Questions';
            if (subtitleEl) subtitleEl.textContent = 'Help us understand your work patterns and travel schedule.';
        } else if (type === 'hotel') {
            document.getElementById('hotelQuestions').style.display = 'block';
            if (titleEl) titleEl.textContent = 'Travel & Hotel Questions';
            if (subtitleEl) subtitleEl.textContent = 'Help us understand your travel patterns and hotel experiences.';
        }
    },

    /**
     * Go to a specific step
     */
    goToStep(stepName) {
        if (!this.steps.includes(stepName)) return;

        this.currentStep = stepName;
        Storage.saveCurrentStep(stepName);

        this.showStep(stepName);
        this.updateProgress();
        this.renderStepIndicators();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    /**
     * Go to next step
     */
    nextStep() {
        const currentIndex = this.steps.indexOf(this.currentStep);
        if (currentIndex < this.steps.length - 1) {
            const nextStepName = this.steps[currentIndex + 1];
            this.goToStep(nextStepName);
        }
    },

    /**
     * Go to previous step
     */
    previousStep() {
        const currentIndex = this.steps.indexOf(this.currentStep);
        if (currentIndex > 0) {
            const prevStepName = this.steps[currentIndex - 1];
            this.goToStep(prevStepName);
        }
    },

    /**
     * Show a specific step
     */
    showStep(stepName) {
        // Hide all steps first
        const allSections = document.querySelectorAll('.step-section');

        allSections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
            section.style.visibility = 'hidden';
        });

        // Show target step
        const targetSection = document.querySelector(`[data-step="${stepName}"]`);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
            targetSection.style.visibility = 'visible';
        } else {
            console.error('ERROR: Section not found for step:', stepName);
            // Fallback - show welcome
            const welcomeSection = document.querySelector('[data-step="welcome"]');
            if (welcomeSection) {
                welcomeSection.classList.add('active');
                welcomeSection.style.display = 'block';
            }
        }

        // Update client-specific section if needed
        if (stepName === 'clientSpecific') {
            this.updateClientSpecificSection();
        }
    },

    /**
     * Update progress bar
     */
    updateProgress() {
        const currentIndex = this.steps.indexOf(this.currentStep);
        const totalSteps = this.steps.length;
        const percentage = Math.round((currentIndex / (totalSteps - 1)) * 100);

        const progressFill = document.getElementById('progressFill');
        const progressStep = document.getElementById('progressStep');
        const progressPercent = document.getElementById('progressPercent');

        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressStep) progressStep.textContent = `Step ${currentIndex + 1}`;
        if (progressPercent) progressPercent.textContent = `${percentage}%`;
    },

    /**
     * Restore form values from saved responses
     */
    restoreFormValues() {
        for (const key in this.responses) {
            const value = this.responses[key];
            const element = document.getElementById(key) || document.querySelector(`[name="${key}"]`);

            if (element) {
                if (element.type === 'radio') {
                    const radio = document.querySelector(`[name="${key}"][value="${value}"]`);
                    if (radio) radio.checked = true;
                } else if (element.type === 'checkbox') {
                    element.checked = value === true || value === 'true';
                } else {
                    element.value = value;
                }
            }
        }

        // Restore questionnaire selections
        document.querySelectorAll('.option-btn').forEach(btn => {
            const questionId = btn.dataset.question;
            const value = btn.dataset.value;
            if (String(this.responses[questionId]) === String(value)) {
                btn.classList.add('selected');
            }
        });

        // Restore client type selection
        if (this.clientType) {
            const card = document.querySelector(`[data-type="${this.clientType}"]`);
            if (card) card.classList.add('selected');
        }
    },

    /**
     * Calculate and display results
     */
    calculateResults() {
        // Collect all responses
        this.collectFormResponses();

        // Calculate results
        const results = Results.calculate(this.responses);

        // Navigate to results
        this.goToStep('results');

        // Render results
        Results.render(results);
    },

    /**
     * Collect all form responses
     */
    collectFormResponses() {
        // T3.6 fix: Reset all checkbox arrays before collecting to avoid
        // appending to stale data on repeated calls
        const checkboxKeys = new Set();
        document.querySelectorAll('input[type="checkbox"]').forEach(el => {
            const key = el.name || el.id;
            if (key) checkboxKeys.add(key);
        });
        checkboxKeys.forEach(key => {
            this.responses[key] = [];
        });

        // Collect from all form inputs
        document.querySelectorAll('input, select').forEach(el => {
            const key = el.name || el.id;
            if (key && el.value) {
                if (el.type === 'radio') {
                    if (el.checked) {
                        this.responses[key] = el.value;
                    }
                } else if (el.type === 'checkbox') {
                    if (el.checked) {
                        this.responses[key].push(el.value);
                    }
                } else {
                    this.responses[key] = el.value;
                }
            }
        });

        Storage.saveResponses(this.responses);
    }
};

// Helper functions
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.querySelector('.mobile-menu-btn');
    menu.classList.toggle('active');
    if (btn) {
        btn.setAttribute('aria-expanded', menu.classList.contains('active'));
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        App.init();
    } catch (error) {
        console.error('Error initializing App:', error);
        // Show welcome section as fallback
        const welcome = document.querySelector('[data-step="welcome"]');
        if (welcome) {
            welcome.classList.add('active');
            welcome.style.display = 'block';
        }
    }
});

// Make App available globally
window.App = App;
