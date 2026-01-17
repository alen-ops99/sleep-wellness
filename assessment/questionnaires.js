/**
 * Questionnaires Module - Contains all questionnaire definitions and scoring
 */

const Questionnaires = {
    /**
     * Epworth Sleepiness Scale (ESS)
     * Score: 0-24, >10 indicates excessive daytime sleepiness
     */
    epworth: {
        id: 'epworth',
        name: 'Epworth Sleepiness Scale',
        description: 'Measures daytime sleepiness',
        questions: [
            {
                id: 'ess1',
                text: 'Sitting and reading',
                options: [
                    { value: 0, label: '0 - Would never doze' },
                    { value: 1, label: '1 - Slight chance' },
                    { value: 2, label: '2 - Moderate chance' },
                    { value: 3, label: '3 - High chance' }
                ]
            },
            {
                id: 'ess2',
                text: 'Watching TV',
                options: [
                    { value: 0, label: '0 - Would never doze' },
                    { value: 1, label: '1 - Slight chance' },
                    { value: 2, label: '2 - Moderate chance' },
                    { value: 3, label: '3 - High chance' }
                ]
            },
            {
                id: 'ess3',
                text: 'Sitting inactive in a public place (e.g., theater or meeting)',
                options: [
                    { value: 0, label: '0 - Would never doze' },
                    { value: 1, label: '1 - Slight chance' },
                    { value: 2, label: '2 - Moderate chance' },
                    { value: 3, label: '3 - High chance' }
                ]
            },
            {
                id: 'ess4',
                text: 'As a passenger in a car for an hour without a break',
                options: [
                    { value: 0, label: '0 - Would never doze' },
                    { value: 1, label: '1 - Slight chance' },
                    { value: 2, label: '2 - Moderate chance' },
                    { value: 3, label: '3 - High chance' }
                ]
            },
            {
                id: 'ess5',
                text: 'Lying down to rest in the afternoon when circumstances permit',
                options: [
                    { value: 0, label: '0 - Would never doze' },
                    { value: 1, label: '1 - Slight chance' },
                    { value: 2, label: '2 - Moderate chance' },
                    { value: 3, label: '3 - High chance' }
                ]
            },
            {
                id: 'ess6',
                text: 'Sitting and talking to someone',
                options: [
                    { value: 0, label: '0 - Would never doze' },
                    { value: 1, label: '1 - Slight chance' },
                    { value: 2, label: '2 - Moderate chance' },
                    { value: 3, label: '3 - High chance' }
                ]
            },
            {
                id: 'ess7',
                text: 'Sitting quietly after lunch without alcohol',
                options: [
                    { value: 0, label: '0 - Would never doze' },
                    { value: 1, label: '1 - Slight chance' },
                    { value: 2, label: '2 - Moderate chance' },
                    { value: 3, label: '3 - High chance' }
                ]
            },
            {
                id: 'ess8',
                text: 'In a car, while stopped for a few minutes in traffic',
                options: [
                    { value: 0, label: '0 - Would never doze' },
                    { value: 1, label: '1 - Slight chance' },
                    { value: 2, label: '2 - Moderate chance' },
                    { value: 3, label: '3 - High chance' }
                ]
            }
        ],
        scoring: {
            maxScore: 24,
            ranges: [
                { min: 0, max: 5, label: 'Lower Normal', severity: 'normal' },
                { min: 6, max: 10, label: 'Higher Normal', severity: 'normal' },
                { min: 11, max: 12, label: 'Mild Excessive', severity: 'mild' },
                { min: 13, max: 15, label: 'Moderate Excessive', severity: 'moderate' },
                { min: 16, max: 24, label: 'Severe Excessive', severity: 'severe' }
            ]
        },
        calculateScore(responses) {
            let total = 0;
            this.questions.forEach(q => {
                if (responses[q.id] !== undefined) {
                    total += parseInt(responses[q.id]);
                }
            });
            return total;
        },
        getInterpretation(score) {
            for (const range of this.scoring.ranges) {
                if (score >= range.min && score <= range.max) {
                    return range;
                }
            }
            return this.scoring.ranges[0];
        }
    },

    /**
     * Insomnia Severity Index (ISI)
     * Score: 0-28
     * 0-7 = No clinically significant insomnia
     * 8-14 = Subthreshold insomnia
     * 15-21 = Clinical insomnia (moderate)
     * 22-28 = Clinical insomnia (severe)
     */
    isi: {
        id: 'isi',
        name: 'Insomnia Severity Index',
        description: 'Measures insomnia severity',
        questions: [
            {
                id: 'isi1',
                text: 'Difficulty falling asleep',
                options: [
                    { value: 0, label: '0 - None' },
                    { value: 1, label: '1 - Mild' },
                    { value: 2, label: '2 - Moderate' },
                    { value: 3, label: '3 - Severe' },
                    { value: 4, label: '4 - Very Severe' }
                ]
            },
            {
                id: 'isi2',
                text: 'Difficulty staying asleep',
                options: [
                    { value: 0, label: '0 - None' },
                    { value: 1, label: '1 - Mild' },
                    { value: 2, label: '2 - Moderate' },
                    { value: 3, label: '3 - Severe' },
                    { value: 4, label: '4 - Very Severe' }
                ]
            },
            {
                id: 'isi3',
                text: 'Problem waking up too early',
                options: [
                    { value: 0, label: '0 - None' },
                    { value: 1, label: '1 - Mild' },
                    { value: 2, label: '2 - Moderate' },
                    { value: 3, label: '3 - Severe' },
                    { value: 4, label: '4 - Very Severe' }
                ]
            },
            {
                id: 'isi4',
                text: 'How satisfied/dissatisfied are you with your current sleep pattern?',
                options: [
                    { value: 0, label: '0 - Very Satisfied' },
                    { value: 1, label: '1 - Satisfied' },
                    { value: 2, label: '2 - Neutral' },
                    { value: 3, label: '3 - Dissatisfied' },
                    { value: 4, label: '4 - Very Dissatisfied' }
                ]
            },
            {
                id: 'isi5',
                text: 'How noticeable to others do you think your sleep problem is in terms of impairing the quality of your life?',
                options: [
                    { value: 0, label: '0 - Not at all' },
                    { value: 1, label: '1 - A Little' },
                    { value: 2, label: '2 - Somewhat' },
                    { value: 3, label: '3 - Much' },
                    { value: 4, label: '4 - Very Much' }
                ]
            },
            {
                id: 'isi6',
                text: 'How worried/distressed are you about your current sleep problem?',
                options: [
                    { value: 0, label: '0 - Not at all' },
                    { value: 1, label: '1 - A Little' },
                    { value: 2, label: '2 - Somewhat' },
                    { value: 3, label: '3 - Much' },
                    { value: 4, label: '4 - Very Much' }
                ]
            },
            {
                id: 'isi7',
                text: 'To what extent do you consider your sleep problem to interfere with your daily functioning?',
                options: [
                    { value: 0, label: '0 - Not at all' },
                    { value: 1, label: '1 - A Little' },
                    { value: 2, label: '2 - Somewhat' },
                    { value: 3, label: '3 - Much' },
                    { value: 4, label: '4 - Very Much' }
                ]
            }
        ],
        scoring: {
            maxScore: 28,
            ranges: [
                { min: 0, max: 7, label: 'No Clinically Significant Insomnia', severity: 'normal' },
                { min: 8, max: 14, label: 'Subthreshold Insomnia', severity: 'mild' },
                { min: 15, max: 21, label: 'Moderate Clinical Insomnia', severity: 'moderate' },
                { min: 22, max: 28, label: 'Severe Clinical Insomnia', severity: 'severe' }
            ]
        },
        calculateScore(responses) {
            let total = 0;
            this.questions.forEach(q => {
                if (responses[q.id] !== undefined) {
                    total += parseInt(responses[q.id]);
                }
            });
            return total;
        },
        getInterpretation(score) {
            for (const range of this.scoring.ranges) {
                if (score >= range.min && score <= range.max) {
                    return range;
                }
            }
            return this.scoring.ranges[0];
        }
    },

    /**
     * STOP-BANG Sleep Apnea Screening
     * Score: 0-8
     * 0-2 = Low risk
     * 3-4 = Intermediate risk
     * 5-8 = High risk
     */
    stopbang: {
        id: 'stopbang',
        name: 'STOP-BANG Questionnaire',
        description: 'Screens for obstructive sleep apnea risk',
        questions: [
            {
                id: 'sb1',
                text: 'Do you SNORE loudly (louder than talking or loud enough to be heard through closed doors)?',
                type: 'yesno'
            },
            {
                id: 'sb2',
                text: 'Do you often feel TIRED, fatigued, or sleepy during daytime?',
                type: 'yesno'
            },
            {
                id: 'sb3',
                text: 'Has anyone OBSERVED you stop breathing during your sleep?',
                type: 'yesno'
            },
            {
                id: 'sb4',
                text: 'Do you have or are you being treated for high blood PRESSURE?',
                type: 'yesno'
            },
            {
                id: 'sb5',
                text: 'BMI more than 35 kg/m²?',
                type: 'calculated',
                description: '(Calculated from your height and weight)'
            },
            {
                id: 'sb6',
                text: 'AGE over 50 years old?',
                type: 'calculated',
                description: '(Based on your provided age)'
            },
            {
                id: 'sb7',
                text: 'NECK circumference greater than 40 cm (16 inches)?',
                type: 'calculated',
                description: '(Based on provided measurement)'
            },
            {
                id: 'sb8',
                text: 'GENDER - Male?',
                type: 'calculated',
                description: '(Based on your provided gender)'
            }
        ],
        scoring: {
            maxScore: 8,
            ranges: [
                { min: 0, max: 2, label: 'Low Risk for OSA', severity: 'normal' },
                { min: 3, max: 4, label: 'Intermediate Risk for OSA', severity: 'moderate' },
                { min: 5, max: 8, label: 'High Risk for OSA', severity: 'severe' }
            ]
        },
        calculateScore(responses, demographics) {
            let total = 0;

            // Manual yes/no questions
            ['sb1', 'sb2', 'sb3', 'sb4'].forEach(id => {
                if (responses[id] === 'yes') total++;
            });

            // Calculated fields
            if (demographics) {
                // BMI > 35
                if (demographics.height && demographics.weight) {
                    const heightM = demographics.height / 100;
                    const bmi = demographics.weight / (heightM * heightM);
                    if (bmi > 35) total++;
                }

                // Age > 50
                if (demographics.age && parseInt(demographics.age) > 50) total++;

                // Neck > 40cm
                if (demographics.neckCircumference && parseInt(demographics.neckCircumference) > 40) total++;

                // Male gender
                if (demographics.gender === 'male') total++;
            }

            return total;
        },
        getInterpretation(score) {
            for (const range of this.scoring.ranges) {
                if (score >= range.min && score <= range.max) {
                    return range;
                }
            }
            return this.scoring.ranges[0];
        }
    },

    /**
     * Restless Legs Syndrome (RLS) Essential Criteria
     * All 4 criteria must be met for diagnosis consideration
     */
    rls: {
        id: 'rls',
        name: 'Restless Legs Syndrome Screening',
        description: 'Screens for restless legs syndrome',
        questions: [
            {
                id: 'rls1',
                text: 'Do you have an urge to move your legs, usually accompanied by uncomfortable sensations?',
                type: 'yesno'
            },
            {
                id: 'rls2',
                text: 'Do these symptoms begin or worsen during periods of rest or inactivity?',
                type: 'yesno'
            },
            {
                id: 'rls3',
                text: 'Are these symptoms partially or totally relieved by movement (walking, stretching)?',
                type: 'yesno'
            },
            {
                id: 'rls4',
                text: 'Do these symptoms occur exclusively or predominantly in the evening or night?',
                type: 'yesno'
            },
            {
                id: 'rls5',
                text: 'How much do these symptoms bother you?',
                options: [
                    { value: 0, label: 'Not at all' },
                    { value: 1, label: 'A little' },
                    { value: 2, label: 'Moderately' },
                    { value: 3, label: 'Quite a bit' },
                    { value: 4, label: 'Extremely' }
                ]
            }
        ],
        calculateCriteriaMet(responses) {
            let criteriaMet = 0;
            ['rls1', 'rls2', 'rls3', 'rls4'].forEach(id => {
                if (responses[id] === 'yes') criteriaMet++;
            });
            return criteriaMet;
        },
        getInterpretation(responses) {
            const criteriaMet = this.calculateCriteriaMet(responses);
            const distress = parseInt(responses.rls5) || 0;

            if (criteriaMet === 4) {
                if (distress >= 3) {
                    return { label: 'RLS Criteria Met - Significant Distress', severity: 'severe' };
                } else if (distress >= 2) {
                    return { label: 'RLS Criteria Met - Moderate Distress', severity: 'moderate' };
                } else {
                    return { label: 'RLS Criteria Met - Mild Symptoms', severity: 'mild' };
                }
            } else if (criteriaMet >= 2) {
                return { label: 'Possible RLS - Some Criteria Met', severity: 'mild' };
            }
            return { label: 'RLS Criteria Not Met', severity: 'normal' };
        }
    },

    /**
     * Parasomnia Screening
     */
    parasomnias: {
        id: 'parasomnias',
        name: 'Parasomnia Screening',
        description: 'Screens for sleepwalking, night terrors, and other parasomnias',
        questions: [
            {
                id: 'para1',
                text: 'How often do you walk or perform complex behaviors while asleep?',
                options: [
                    { value: 0, label: 'Never' },
                    { value: 1, label: 'Rarely (few times/year)' },
                    { value: 2, label: 'Sometimes (monthly)' },
                    { value: 3, label: 'Often (weekly)' },
                    { value: 4, label: 'Very Often (multiple times/week)' }
                ]
            },
            {
                id: 'para2',
                text: 'How often do you experience night terrors (sudden awakening with intense fear, screaming)?',
                options: [
                    { value: 0, label: 'Never' },
                    { value: 1, label: 'Rarely (few times/year)' },
                    { value: 2, label: 'Sometimes (monthly)' },
                    { value: 3, label: 'Often (weekly)' },
                    { value: 4, label: 'Very Often (multiple times/week)' }
                ]
            },
            {
                id: 'para3',
                text: 'How often do you have vivid, disturbing nightmares?',
                options: [
                    { value: 0, label: 'Never' },
                    { value: 1, label: 'Rarely (few times/year)' },
                    { value: 2, label: 'Sometimes (monthly)' },
                    { value: 3, label: 'Often (weekly)' },
                    { value: 4, label: 'Very Often (multiple times/week)' }
                ]
            },
            {
                id: 'para4',
                text: 'How often do you experience sleep paralysis (unable to move upon waking)?',
                options: [
                    { value: 0, label: 'Never' },
                    { value: 1, label: 'Rarely (few times/year)' },
                    { value: 2, label: 'Sometimes (monthly)' },
                    { value: 3, label: 'Often (weekly)' },
                    { value: 4, label: 'Very Often (multiple times/week)' }
                ]
            }
        ],
        calculateScore(responses) {
            let total = 0;
            this.questions.forEach(q => {
                if (responses[q.id] !== undefined) {
                    total += parseInt(responses[q.id]);
                }
            });
            return total;
        },
        getInterpretation(score) {
            if (score === 0) return { label: 'No Parasomnia Symptoms', severity: 'normal' };
            if (score <= 4) return { label: 'Minimal Parasomnia Symptoms', severity: 'normal' };
            if (score <= 8) return { label: 'Mild Parasomnia Symptoms', severity: 'mild' };
            if (score <= 12) return { label: 'Moderate Parasomnia Symptoms', severity: 'moderate' };
            return { label: 'Significant Parasomnia Symptoms', severity: 'severe' };
        }
    },

    /**
     * REM Behavior Disorder Screening
     */
    remBehavior: {
        id: 'remBehavior',
        name: 'REM Behavior Disorder Screening',
        description: 'Screens for REM sleep behavior disorder',
        questions: [
            {
                id: 'rem1',
                text: 'Have you ever been told, or suspected yourself, that you act out your dreams while sleeping (punching, kicking, running)?',
                type: 'yesno'
            },
            {
                id: 'rem2',
                text: 'Have you ever injured yourself or your bed partner from movements during sleep?',
                type: 'yesno'
            },
            {
                id: 'rem3',
                text: 'Do you have vivid dreams that seem to "come alive" physically?',
                type: 'yesno'
            }
        ],
        getInterpretation(responses) {
            const positiveCount = ['rem1', 'rem2', 'rem3'].filter(id => responses[id] === 'yes').length;
            if (positiveCount >= 2) return { label: 'Possible REM Behavior Disorder', severity: 'moderate' };
            if (positiveCount === 1) return { label: 'Some RBD Indicators', severity: 'mild' };
            return { label: 'No RBD Indicators', severity: 'normal' };
        }
    },

    /**
     * Circadian Rhythm Assessment
     */
    circadian: {
        id: 'circadian',
        name: 'Circadian Rhythm Assessment',
        description: 'Assesses circadian rhythm patterns',
        questions: [
            {
                id: 'circ1',
                text: 'What time do you naturally prefer to go to sleep (if you had no obligations)?',
                options: [
                    { value: 'early', label: 'Before 10 PM' },
                    { value: 'normal', label: '10 PM - Midnight' },
                    { value: 'late', label: 'After Midnight' },
                    { value: 'very_late', label: 'After 2 AM' }
                ]
            },
            {
                id: 'circ2',
                text: 'What time do you naturally prefer to wake up (if you had no obligations)?',
                options: [
                    { value: 'early', label: 'Before 6 AM' },
                    { value: 'normal', label: '6 AM - 8 AM' },
                    { value: 'late', label: '8 AM - 10 AM' },
                    { value: 'very_late', label: 'After 10 AM' }
                ]
            },
            {
                id: 'circ3',
                text: 'When do you feel most alert and productive?',
                options: [
                    { value: 'morning', label: 'Morning (before noon)' },
                    { value: 'afternoon', label: 'Afternoon (noon - 6 PM)' },
                    { value: 'evening', label: 'Evening (6 PM - midnight)' },
                    { value: 'night', label: 'Night (after midnight)' }
                ]
            },
            {
                id: 'circ4',
                text: 'Does your sleep schedule on weekends/days off differ significantly from work days?',
                options: [
                    { value: 0, label: 'No difference' },
                    { value: 1, label: 'Slight difference (< 1 hour)' },
                    { value: 2, label: 'Moderate difference (1-2 hours)' },
                    { value: 3, label: 'Significant difference (2-3 hours)' },
                    { value: 4, label: 'Large difference (> 3 hours)' }
                ]
            }
        ],
        getChronotype(responses) {
            const sleep = responses.circ1;
            const wake = responses.circ2;
            const alert = responses.circ3;

            let morningScore = 0;
            let eveningScore = 0;

            if (sleep === 'early') morningScore += 2;
            else if (sleep === 'late') eveningScore += 1;
            else if (sleep === 'very_late') eveningScore += 2;

            if (wake === 'early') morningScore += 2;
            else if (wake === 'late') eveningScore += 1;
            else if (wake === 'very_late') eveningScore += 2;

            if (alert === 'morning') morningScore += 2;
            else if (alert === 'evening') eveningScore += 1;
            else if (alert === 'night') eveningScore += 2;

            if (morningScore >= 4) return 'Morning Type (Lark)';
            if (eveningScore >= 4) return 'Evening Type (Owl)';
            return 'Intermediate Type';
        },
        getSocialJetLag(responses) {
            const diff = parseInt(responses.circ4) || 0;
            if (diff >= 3) return { label: 'Significant Social Jet Lag', severity: 'moderate' };
            if (diff >= 2) return { label: 'Moderate Social Jet Lag', severity: 'mild' };
            return { label: 'Minimal Social Jet Lag', severity: 'normal' };
        }
    },

    /**
     * Render questionnaire questions to HTML
     */
    renderQuestions(questionnaire, containerId, responses = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = '';
        questionnaire.questions.forEach((q, index) => {
            if (q.type === 'calculated') {
                // Skip calculated fields - they're derived from demographics
                return;
            }

            html += `<div class="questionnaire-item ${q.type === 'yesno' ? 'yes-no' : ''}">
                <div class="question">${index + 1}. ${q.text}</div>
                <div class="options">`;

            if (q.type === 'yesno') {
                const yesSelected = responses[q.id] === 'yes' ? 'selected' : '';
                const noSelected = responses[q.id] === 'no' ? 'selected' : '';
                html += `
                    <button type="button" class="option-btn ${yesSelected}" data-question="${q.id}" data-value="yes">Yes</button>
                    <button type="button" class="option-btn ${noSelected}" data-question="${q.id}" data-value="no">No</button>
                `;
            } else if (q.options) {
                q.options.forEach(opt => {
                    const selected = responses[q.id] == opt.value ? 'selected' : '';
                    html += `<button type="button" class="option-btn ${selected}" data-question="${q.id}" data-value="${opt.value}">${opt.label}</button>`;
                });
            }

            html += '</div></div>';
        });

        container.innerHTML = html;

        // Add click handlers
        container.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const questionId = btn.dataset.question;
                const value = btn.dataset.value;

                // Remove selected from siblings
                btn.parentElement.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');

                // Save response
                if (window.App) {
                    window.App.saveResponse(questionId, value);
                }
            });
        });
    }
};

// Make available globally
window.Questionnaires = Questionnaires;
