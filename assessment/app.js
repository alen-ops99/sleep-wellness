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
        'wearable',
        'results'
    ],

    currentStep: 'welcome',
    responses: {},
    clientType: null,

    /**
     * Initialize the application
     */
    init() {
        console.log('App.init() starting...');

        // Load saved data
        this.responses = Storage.getResponses();
        this.clientType = Storage.getClientType();
        this.currentStep = Storage.getCurrentStep();

        console.log('Loaded state:', { responses: this.responses, clientType: this.clientType, currentStep: this.currentStep });

        // Check for saved progress
        const resumeNotice = document.getElementById('resumeNotice');
        if (resumeNotice && Storage.hasSavedProgress() && this.currentStep !== 'welcome' && this.currentStep !== 'results') {
            resumeNotice.style.display = 'block';
        }

        // Render step indicators
        this.renderStepIndicators();
        console.log('Step indicators rendered');

        // Render questionnaires
        this.renderQuestionnaires();
        console.log('Questionnaires rendered');

        // Set up event listeners
        this.setupEventListeners();
        console.log('Event listeners set up');

        // Show current step
        this.showStep(this.currentStep);
        console.log('Showing step:', this.currentStep);

        // Update progress
        this.updateProgress();
        console.log('App.init() complete');
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
        Questionnaires.renderQuestions(Questionnaires.epworth, 'epworthQuestions', this.responses);
        Questionnaires.renderQuestions(Questionnaires.isi, 'isiQuestions', this.responses);
        this.renderStopBangQuestions();
        this.renderDisorderQuestions();
    },

    /**
     * Render STOP-BANG questions (only manual ones)
     */
    renderStopBangQuestions() {
        const container = document.getElementById('stopbangQuestions');
        if (!container) return;

        const manualQuestions = Questionnaires.stopbang.questions.filter(q => q.type !== 'calculated');

        let html = '';
        manualQuestions.forEach((q, index) => {
            const yesSelected = this.responses[q.id] === 'yes' ? 'selected' : '';
            const noSelected = this.responses[q.id] === 'no' ? 'selected' : '';

            html += `
                <div class="questionnaire-item yes-no">
                    <div class="question">${index + 1}. ${q.text}</div>
                    <div class="options">
                        <button type="button" class="option-btn ${yesSelected}" data-question="${q.id}" data-value="yes">Yes</button>
                        <button type="button" class="option-btn ${noSelected}" data-question="${q.id}" data-value="no">No</button>
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

        // Wearable upload
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('wearableFile');

        if (uploadZone && fileInput) {
            uploadZone.addEventListener('click', () => fileInput.click());

            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('dragover');
            });

            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('dragover');
            });

            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
                if (e.dataTransfer.files.length) {
                    this.handleFileUpload(e.dataTransfer.files[0]);
                }
            });

            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length) {
                    this.handleFileUpload(e.target.files[0]);
                }
            });
        }

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
     * Handle wearable file upload
     */
    handleFileUpload(file) {
        const statusEl = document.getElementById('uploadStatus');
        const allowedTypes = ['text/csv', 'application/json', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        const allowedExtensions = ['.csv', '.json', '.xlsx'];

        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

        if (!allowedExtensions.includes(extension)) {
            statusEl.textContent = 'Invalid file type. Please upload CSV, JSON, or XLSX.';
            statusEl.className = 'upload-status error';
            return;
        }

        // For now, just acknowledge the upload
        // Full parsing would be implemented based on specific wearable formats
        statusEl.textContent = `File uploaded: ${file.name}`;
        statusEl.className = 'upload-status success';

        // Store basic info
        Storage.saveWearableData({
            filename: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
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
        this.goToStep('clientType');
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
        document.getElementById('resumeNotice').style.display = 'none';
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
        // Hide all steps
        document.querySelectorAll('.step-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target step
        const targetSection = document.querySelector(`[data-step="${stepName}"]`);
        if (targetSection) {
            targetSection.classList.add('active');
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
            if (this.responses[questionId] == value) {
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
        // Collect from all form inputs
        document.querySelectorAll('input, select').forEach(el => {
            const key = el.name || el.id;
            if (key && el.value) {
                if (el.type === 'radio') {
                    if (el.checked) {
                        this.responses[key] = el.value;
                    }
                } else if (el.type === 'checkbox') {
                    // For checkboxes with same name, collect as array
                    if (!this.responses[key]) this.responses[key] = [];
                    if (el.checked) {
                        if (!Array.isArray(this.responses[key])) {
                            this.responses[key] = [this.responses[key]];
                        }
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
function toggleAccordion(button) {
    const item = button.parentElement;
    const isActive = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
    });

    // Open clicked if wasn't active
    if (!isActive) {
        item.classList.add('active');
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing App...');
    try {
        App.init();
        console.log('App initialized successfully');
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
