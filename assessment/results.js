/**
 * Results Module - Calculates scores and generates results display
 */

const Results = {
    /**
     * Calculate all results from responses
     */
    calculate(responses) {
        const results = {
            timestamp: new Date().toISOString(),
            clientType: Storage.getClientType(),
            demographics: this.extractDemographics(responses),
            scores: {},
            findings: [],
            recommendations: [],
            overallScore: 0,
            needsConsultation: false
        };

        // Calculate questionnaire scores
        results.scores.epworth = this.calculateEpworth(responses);
        results.scores.isi = this.calculateISI(responses);
        results.scores.stopbang = this.calculateStopBang(responses, results.demographics);
        results.scores.rls = this.calculateRLS(responses);
        results.scores.parasomnias = this.calculateParasomnias(responses);
        results.scores.remBehavior = this.calculateREMBehavior(responses);
        results.scores.circadian = this.calculateCircadian(responses);
        results.scores.sleepSchedule = this.analyzeSleepSchedule(responses);
        results.scores.environment = this.analyzeEnvironment(responses);

        // Calculate overall score
        results.overallScore = this.calculateOverallScore(results.scores);

        // Generate findings
        results.findings = this.generateFindings(results);

        // Generate recommendations
        results.recommendations = this.generateRecommendations(results);

        // Check if consultation is needed
        results.needsConsultation = this.checkConsultationNeeded(results);

        // Save results
        Storage.saveResults(results);

        return results;
    },

    /**
     * Extract demographics from responses
     */
    extractDemographics(responses) {
        const demographics = {
            age: responses.age ? parseInt(responses.age) : null,
            gender: responses.gender || null,
            height: responses.height ? parseInt(responses.height) : null,
            weight: responses.weight ? parseInt(responses.weight) : null,
            neckCircumference: responses.neckCircumference ? parseInt(responses.neckCircumference) : null
        };

        // Calculate BMI
        if (demographics.height && demographics.weight) {
            const heightM = demographics.height / 100;
            demographics.bmi = (demographics.weight / (heightM * heightM)).toFixed(1);
        }

        return demographics;
    },

    /**
     * Convert flat responses object to the {value, label, questionId} array
     * that Questionnaires.calculateScore() expects.
     *
     * @param {string} instrumentId - e.g. 'ess', 'isi', 'stopbang', 'csds'
     * @param {Object} responses - flat key-value map (e.g. {ess_q1: "2", ess_q2: "0", ...})
     * @returns {Array} Array of {value: Number, label: String, questionId: Number}
     */
    buildAnswerArray(instrumentId, responses) {
        const instrument = Questionnaires.getInstrument(instrumentId);
        if (!instrument) return [];

        return instrument.questions.map(q => {
            // Keys are stored as "<instrumentId>_q<questionId>" by renderQuestions
            const key = `${instrumentId}_q${q.id}`;
            const rawValue = responses[key];
            const numValue = rawValue != null ? parseInt(rawValue, 10) : 0;
            // Find the matching option label, or fall back to empty string
            const option = (q.options || []).find(o => o.value === numValue);
            return {
                value: isNaN(numValue) ? 0 : numValue,
                label: option ? option.label : '',
                questionId: q.id
            };
        });
    },

    /**
     * Calculate Epworth Sleepiness Scale score
     */
    calculateEpworth(responses) {
        const answers = this.buildAnswerArray('ess', responses);
        const result = Questionnaires.calculateScore('ess', answers);

        if (!result) {
            return { name: 'Epworth Sleepiness Scale', score: 0, maxScore: 24, percentage: 0, label: 'Incomplete', severity: 'normal', description: 'Not enough data to score.' };
        }

        return {
            name: result.instrumentName,
            score: result.score,
            maxScore: result.maxScore,
            percentage: (result.score / result.maxScore) * 100,
            label: result.label,
            severity: result.severity,
            description: result.score <= 10 ?
                'Normal daytime sleepiness levels' :
                'Elevated daytime sleepiness - may indicate insufficient sleep or a sleep disorder'
        };
    },

    /**
     * Calculate Insomnia Severity Index score
     */
    calculateISI(responses) {
        const answers = this.buildAnswerArray('isi', responses);
        const result = Questionnaires.calculateScore('isi', answers);

        if (!result) {
            return { name: 'Insomnia Severity Index', score: 0, maxScore: 28, percentage: 0, label: 'Incomplete', severity: 'normal', description: 'Not enough data to score.' };
        }

        return {
            name: result.instrumentName,
            score: result.score,
            maxScore: result.maxScore,
            percentage: (result.score / result.maxScore) * 100,
            label: result.label,
            severity: result.severity,
            description: result.score < 8 ?
                'No clinically significant insomnia symptoms' :
                'Insomnia symptoms present - may benefit from treatment'
        };
    },

    /**
     * Calculate STOP-BANG score
     * Uses both the questionnaire answers (manual yes/no items) and demographic
     * data (BMI, age, neck, gender) to produce the full 8-item score.
     */
    calculateStopBang(responses, demographics) {
        const answers = this.buildAnswerArray('stopbang', responses);

        // Augment answers with calculated demographic items
        // STOP-BANG Q5: BMI > 35
        if (demographics && demographics.bmi) {
            const bmiAnswer = answers.find(a => a.questionId === 5);
            if (bmiAnswer) bmiAnswer.value = parseFloat(demographics.bmi) > 35 ? 1 : 0;
        }
        // STOP-BANG Q6: Age > 50
        if (demographics && demographics.age) {
            const ageAnswer = answers.find(a => a.questionId === 6);
            if (ageAnswer) ageAnswer.value = demographics.age > 50 ? 1 : 0;
        }
        // STOP-BANG Q7: Neck > 40cm
        if (demographics && demographics.neckCircumference) {
            const neckAnswer = answers.find(a => a.questionId === 7);
            if (neckAnswer) neckAnswer.value = demographics.neckCircumference > 40 ? 1 : 0;
        }
        // STOP-BANG Q8: Male gender
        if (demographics && demographics.gender) {
            const genderAnswer = answers.find(a => a.questionId === 8);
            if (genderAnswer) genderAnswer.value = demographics.gender === 'male' ? 1 : 0;
        }

        const result = Questionnaires.calculateScore('stopbang', answers);

        if (!result) {
            return { name: 'Sleep Apnea Risk (STOP-BANG)', score: 0, maxScore: 8, percentage: 0, label: 'Incomplete', severity: 'low', description: 'Not enough data to score.' };
        }

        return {
            name: 'Sleep Apnea Risk (STOP-BANG)',
            score: result.score,
            maxScore: result.maxScore,
            percentage: (result.score / result.maxScore) * 100,
            label: result.label,
            severity: result.severity,
            description: result.score <= 2 ?
                'Low risk for obstructive sleep apnea' :
                result.score <= 4 ?
                    'Intermediate risk for obstructive sleep apnea - monitoring recommended' :
                    'High risk for obstructive sleep apnea - consultation recommended'
        };
    },

    /**
     * Calculate RLS assessment using the CSDS RLS domain (questions 7-9)
     */
    calculateRLS(responses) {
        const answers = this.buildAnswerArray('csds', responses);
        const result = Questionnaires.calculateScore('csds', answers);

        // Extract just the RLS domain from the multi-domain result
        const rlsDomain = result && result.domains && result.domains.rls ? result.domains.rls : null;

        if (!rlsDomain) {
            return { name: 'Restless Legs Syndrome', score: 0, maxScore: 9, percentage: 0, label: 'Incomplete', severity: 'normal', description: 'Not enough data to score.' };
        }

        return {
            name: 'Restless Legs Syndrome',
            score: rlsDomain.score,
            maxScore: rlsDomain.maxScore,
            percentage: rlsDomain.percentage,
            label: rlsDomain.label,
            severity: rlsDomain.severity === 'low' ? 'normal' : rlsDomain.severity,
            description: rlsDomain.flagged ?
                'RLS symptoms present - consider evaluation by a sleep specialist' :
                'RLS diagnostic criteria not significantly elevated'
        };
    },

    /**
     * Calculate Parasomnia score using the CSDS parasomnia domain (questions 10-12)
     */
    calculateParasomnias(responses) {
        const answers = this.buildAnswerArray('csds', responses);
        const result = Questionnaires.calculateScore('csds', answers);

        const parasomniaDomain = result && result.domains && result.domains.parasomnia ? result.domains.parasomnia : null;

        if (!parasomniaDomain) {
            return { name: 'Parasomnia Symptoms', score: 0, maxScore: 9, percentage: 0, label: 'Incomplete', severity: 'normal', description: 'Not enough data to score.' };
        }

        return {
            name: 'Parasomnia Symptoms',
            score: parasomniaDomain.score,
            maxScore: parasomniaDomain.maxScore,
            percentage: parasomniaDomain.percentage,
            label: parasomniaDomain.label,
            severity: parasomniaDomain.severity === 'low' ? 'normal' : parasomniaDomain.severity,
            description: parasomniaDomain.flagged ?
                'Parasomnia symptoms present - may need evaluation' :
                'Minimal or no parasomnia symptoms'
        };
    },

    /**
     * Calculate REM Behavior Disorder assessment using CSDS RBD domain (questions 13-14)
     */
    calculateREMBehavior(responses) {
        const answers = this.buildAnswerArray('csds', responses);
        const result = Questionnaires.calculateScore('csds', answers);

        const rbdDomain = result && result.domains && result.domains.rbd ? result.domains.rbd : null;

        if (!rbdDomain) {
            return { name: 'REM Behavior Disorder', score: 0, maxScore: 6, percentage: 0, label: 'Incomplete', severity: 'normal', description: 'Not enough data to score.' };
        }

        return {
            name: 'REM Behavior Disorder',
            score: rbdDomain.score,
            maxScore: rbdDomain.maxScore,
            percentage: rbdDomain.percentage,
            label: rbdDomain.label,
            severity: rbdDomain.severity === 'low' ? 'normal' : rbdDomain.severity,
            description: rbdDomain.flagged ?
                'Possible REM behavior disorder - consultation recommended' :
                'No significant REM behavior disorder indicators'
        };
    },

    /**
     * Calculate Circadian assessment using CSDS circadian domain (questions 17-18)
     */
    calculateCircadian(responses) {
        const answers = this.buildAnswerArray('csds', responses);
        const result = Questionnaires.calculateScore('csds', answers);

        const circadianDomain = result && result.domains && result.domains.circadian ? result.domains.circadian : null;

        if (!circadianDomain) {
            return { name: 'Circadian Rhythm', score: 0, maxScore: 6, percentage: 0, label: 'Incomplete', severity: 'normal', description: 'No circadian rhythm concerns.' };
        }

        return {
            name: 'Circadian Rhythm',
            score: circadianDomain.score,
            maxScore: circadianDomain.maxScore,
            percentage: circadianDomain.percentage,
            label: circadianDomain.label,
            severity: circadianDomain.severity === 'low' ? 'normal' : circadianDomain.severity,
            description: circadianDomain.flagged ?
                'Circadian rhythm concerns detected - irregular sleep-wake patterns may benefit from light therapy or schedule adjustments' :
                'No significant circadian rhythm concerns'
        };
    },

    /**
     * Analyze sleep schedule
     */
    analyzeSleepSchedule(responses) {
        const bedtime = responses.bedtime || '23:00';
        const waketime = responses.waketime || '07:00';
        const latency = parseInt(responses.sleepLatency) || 15;
        const awakenings = parseInt(responses.awakenings) || 0;
        const wakeTime = parseInt(responses.wakeTime) || 0;
        const quality = parseInt(responses.sleepQuality) || 3;

        // Calculate sleep duration
        const [bedH, bedM] = bedtime.split(':').map(Number);
        const [wakeH, wakeM] = waketime.split(':').map(Number);

        let durationMinutes = (wakeH * 60 + wakeM) - (bedH * 60 + bedM);
        if (durationMinutes < 0) durationMinutes += 24 * 60;

        const tib = durationMinutes;
        const tst = Math.max(0, tib - latency - (awakenings * wakeTime));
        const sleepEfficiency = tib > 0 ? ((tst / tib) * 100).toFixed(1) : '0.0';

        let severity = 'normal';
        if (tst < 360 || sleepEfficiency < 75) severity = 'moderate';
        if (tst < 300 || sleepEfficiency < 65) severity = 'severe';

        return {
            name: 'Sleep Schedule',
            bedtime: bedtime,
            waketime: waketime,
            timeInBed: tib,
            totalSleepTime: tst,
            sleepEfficiency: parseFloat(sleepEfficiency),
            sleepLatency: latency,
            awakenings: awakenings,
            quality: quality,
            severity: severity,
            description: `${Math.floor(tst / 60)}h ${tst % 60}m of sleep, ${sleepEfficiency}% efficiency`
        };
    },

    /**
     * Analyze environment factors
     */
    analyzeEnvironment(responses) {
        let score = 0;
        let maxScore = 0;
        const issues = [];

        // Temperature
        maxScore += 2;
        if (responses.bedroomTemp === 'cool') {
            score += 2;
        } else if (responses.bedroomTemp === 'comfortable') {
            score += 1;
        } else if (responses.bedroomTemp) {
            issues.push('Bedroom temperature not optimal');
        }

        // Light
        maxScore += 2;
        if (responses.bedroomLight === 'completely_dark') {
            score += 2;
        } else if (responses.bedroomLight === 'mostly_dark') {
            score += 1;
        } else if (responses.bedroomLight) {
            issues.push('Light exposure during sleep');
        }

        // Noise
        maxScore += 2;
        if (responses.bedroomNoise === 'silent' || responses.bedroomNoise === 'quiet') {
            score += 2;
        } else if (responses.bedroomNoise) {
            issues.push('Noise disturbance');
        }

        // Caffeine
        maxScore += 2;
        if (responses.caffeineTime === 'none' || responses.caffeineTime === '8+') {
            score += 2;
        } else if (responses.caffeineTime === '6-8') {
            score += 1;
        } else if (responses.caffeineTime) {
            issues.push('Caffeine too close to bedtime');
        }

        // Screen time
        maxScore += 2;
        if (responses.screenTime === 'none' || responses.screenTime === '30-60') {
            score += 2;
        } else if (responses.screenTime) {
            issues.push('Screen use too close to bedtime');
        }

        const percentage = (score / maxScore) * 100;
        let severity = 'normal';
        if (percentage < 70) severity = 'mild';
        if (percentage < 50) severity = 'moderate';

        return {
            name: 'Environment & Lifestyle',
            score: score,
            maxScore: maxScore,
            percentage: percentage,
            severity: severity,
            issues: issues,
            description: issues.length === 0 ?
                'Good sleep environment and habits' :
                `Areas for improvement: ${issues.join(', ')}`
        };
    },

    /**
     * Calculate overall sleep health score (0-100).
     *
     * This is a proprietary composite metric that combines weighted sub-scores
     * from validated instruments (ESS, ISI, STOP-BANG) and non-validated
     * assessments (sleep schedule consistency, environment quality). It is
     * intended as a high-level summary for client engagement and should NOT
     * be interpreted as a clinically validated diagnostic measure. Individual
     * sub-scale scores retain their original validated interpretations.
     *
     * @param {Object} scores - Object containing individual assessment scores
     * @returns {Object} Overall score object with value (0-100), severity, and interpretation
     */
    calculateOverallScore(scores) {
        let totalWeight = 0;
        let weightedScore = 0;

        // Weight different components
        const weights = {
            epworth: 20,
            isi: 25,
            stopbang: 15,
            sleepSchedule: 25,
            environment: 15
        };

        // Convert severity to score (normal=100, mild=70, moderate=40, severe=10)
        const severityScore = {
            'normal': 100,
            'mild': 70,
            'moderate': 40,
            'severe': 10
        };

        for (const key in weights) {
            if (scores[key]) {
                totalWeight += weights[key];
                const severity = scores[key].severity || 'normal';
                weightedScore += (severityScore[severity] || 70) * weights[key];
            }
        }

        return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 50;
    },

    /**
     * Generate findings from results
     */
    generateFindings(results) {
        const findings = [];
        const { scores, demographics } = results;

        // Sleep duration finding
        if (scores.sleepSchedule) {
            const tst = scores.sleepSchedule.totalSleepTime;
            if (tst >= 420 && tst <= 540) {
                findings.push({
                    type: 'positive',
                    title: 'Adequate Sleep Duration',
                    text: `You're getting ${Math.floor(tst / 60)} hours of sleep, which is within the recommended range for adults.`
                });
            } else if (tst < 360) {
                findings.push({
                    type: 'concern',
                    title: 'Insufficient Sleep Duration',
                    text: `You're only getting ${Math.floor(tst / 60)} hours of sleep. Adults typically need 7-9 hours for optimal health.`
                });
            }

            // Sleep efficiency
            if (scores.sleepSchedule.sleepEfficiency < 85) {
                findings.push({
                    type: 'warning',
                    title: 'Low Sleep Efficiency',
                    text: `Your sleep efficiency is ${scores.sleepSchedule.sleepEfficiency}%. Spending too much time awake in bed may perpetuate insomnia.`
                });
            }
        }

        // Daytime sleepiness
        if (scores.epworth && scores.epworth.score > 10) {
            findings.push({
                type: 'warning',
                title: 'Excessive Daytime Sleepiness',
                text: `Your Epworth score of ${scores.epworth.score} indicates excessive daytime sleepiness. This may affect alertness and safety.`
            });
        }

        // Insomnia
        if (scores.isi && scores.isi.score >= 15) {
            findings.push({
                type: 'concern',
                title: 'Clinical Insomnia Symptoms',
                text: `Your ISI score of ${scores.isi.score} indicates ${scores.isi.label.toLowerCase()}. CBT-I is the first-line treatment.`
            });
        }

        // Sleep apnea risk
        if (scores.stopbang && scores.stopbang.score >= 5) {
            findings.push({
                type: 'concern',
                title: 'High Sleep Apnea Risk',
                text: `Your STOP-BANG score indicates high risk for obstructive sleep apnea. A sleep study is recommended.`
            });
        } else if (scores.stopbang && scores.stopbang.score >= 3) {
            findings.push({
                type: 'warning',
                title: 'Intermediate Sleep Apnea Risk',
                text: `Your STOP-BANG score indicates intermediate risk for sleep apnea. Consider discussing with a sleep specialist.`
            });
        }

        // RLS
        if (scores.rls && scores.rls.severity !== 'normal') {
            findings.push({
                type: 'info',
                title: 'Restless Legs Symptoms',
                text: scores.rls.description
            });
        }

        // REM behavior disorder
        if (scores.remBehavior && scores.remBehavior.severity === 'moderate') {
            findings.push({
                type: 'warning',
                title: 'REM Behavior Disorder Indicators',
                text: 'Acting out dreams during sleep may indicate REM behavior disorder. Consider evaluation by a sleep specialist.'
            });
        }

        // Circadian issues
        if (scores.circadian && scores.circadian.severity !== 'normal') {
            findings.push({
                type: 'info',
                title: 'Social Jet Lag',
                text: `Your sleep schedule varies significantly between work days and days off. This "social jet lag" can affect sleep quality and health.`
            });
        }

        // Environment issues
        if (scores.environment && scores.environment.issues.length > 0) {
            findings.push({
                type: 'info',
                title: 'Environment Factors',
                text: `Modifiable factors affecting your sleep: ${scores.environment.issues.join(', ')}.`
            });
        }

        return findings;
    },

    /**
     * Generate recommendations
     */
    generateRecommendations(results) {
        const recommendations = [];
        const { scores, clientType } = results;
        let priority = 1;

        // Severe conditions - recommend consultation
        if (results.needsConsultation) {
            recommendations.push({
                priority: priority++,
                title: 'Consult a Sleep Specialist',
                text: 'Your results indicate potential sleep disorders that warrant professional evaluation. Consider scheduling a consultation for proper diagnosis and treatment.'
            });
        }

        // Insomnia - recommend CBT-I
        if (scores.isi && scores.isi.score >= 8) {
            recommendations.push({
                priority: priority++,
                title: 'Cognitive Behavioral Therapy for Insomnia (CBT-I)',
                text: 'CBT-I is the gold standard treatment for chronic insomnia. It includes sleep restriction, stimulus control, and cognitive restructuring. See the therapeutic modules below.'
            });
        }

        // Sleep efficiency issues - recommend sleep restriction
        if (scores.sleepSchedule && scores.sleepSchedule.sleepEfficiency < 85) {
            recommendations.push({
                priority: priority++,
                title: 'Improve Sleep Efficiency',
                text: 'Spend less time lying awake in bed. Consider sleep restriction therapy to consolidate your sleep into a more efficient window.'
            });
        }

        // Environment issues
        if (scores.environment && scores.environment.issues.length > 0) {
            recommendations.push({
                priority: priority++,
                title: 'Optimize Sleep Environment',
                text: `Address these factors: ${scores.environment.issues.join(', ')}. Small changes can significantly improve sleep quality.`
            });
        }

        // Daytime sleepiness
        if (scores.epworth && scores.epworth.score > 10) {
            recommendations.push({
                priority: priority++,
                title: 'Address Daytime Sleepiness',
                text: 'Evaluate whether you need more sleep, better sleep quality, or screening for sleep disorders like sleep apnea.'
            });
        }

        // Relaxation techniques
        if (scores.isi && scores.isi.score >= 8) {
            recommendations.push({
                priority: priority++,
                title: 'Practice Relaxation Techniques',
                text: 'Try the 4-7-8 breathing technique or progressive muscle relaxation before bed to reduce arousal and promote sleep onset.'
            });
        }

        // Client-specific recommendations
        if (clientType === 'athlete') {
            recommendations.push({
                priority: priority++,
                title: 'Athlete-Specific Optimization',
                text: 'Focus on sleep timing around training, strategic napping for recovery, and jet lag protocols for competition travel.'
            });
        } else if (clientType === 'executive') {
            recommendations.push({
                priority: priority++,
                title: 'Executive Performance',
                text: 'Prioritize consistent sleep schedules, manage evening work habits, and consider travel protocols for international trips.'
            });
        } else if (clientType === 'hotel') {
            recommendations.push({
                priority: priority++,
                title: 'Travel Sleep Strategies',
                text: 'Bring familiar sleep items, request quiet rooms, use blackout solutions, and maintain home sleep routines when possible.'
            });
        }

        return recommendations;
    },

    /**
     * Check if consultation is needed
     */
    checkConsultationNeeded(results) {
        const { scores } = results;

        // High sleep apnea risk
        if (scores.stopbang && scores.stopbang.score >= 5) return true;

        // Severe insomnia
        if (scores.isi && scores.isi.score >= 22) return true;

        // RLS with significant distress
        if (scores.rls && scores.rls.severity === 'severe') return true;

        // REM behavior disorder
        if (scores.remBehavior && scores.remBehavior.severity === 'moderate') return true;

        // Significant parasomnias
        if (scores.parasomnias && scores.parasomnias.severity === 'severe') return true;

        return false;
    },

    /**
     * Render results to the page
     */
    render(results) {
        // Render overall score
        this.renderOverallScore(results.overallScore);

        // Render individual scores
        this.renderIndividualScores(results.scores);

        // Render findings
        this.renderFindings(results.findings);

        // Render recommendations
        this.renderRecommendations(results.recommendations);

        // Render modules
        Content.renderModules();
    },

    /**
     * Render overall score circle
     */
    renderOverallScore(score) {
        const scoreValue = document.getElementById('overallScoreValue');
        const scoreFill = document.getElementById('scoreCircleFill');
        const interpretation = document.getElementById('scoreInterpretation');

        if (scoreValue) scoreValue.textContent = score;

        if (scoreFill) {
            // Calculate stroke offset (full circle = 339.292)
            const offset = 339.292 * (1 - score / 100);
            setTimeout(() => {
                scoreFill.style.strokeDashoffset = offset;
            }, 100);
        }

        if (interpretation) {
            let text = '';
            if (score >= 80) {
                text = 'Good sleep health with minimal concerns';
            } else if (score >= 60) {
                text = 'Moderate sleep health - some areas for improvement';
            } else if (score >= 40) {
                text = 'Below average sleep health - multiple concerns identified';
            } else {
                text = 'Poor sleep health - professional consultation recommended';
            }
            interpretation.textContent = text;
        }
    },

    /**
     * Render individual score cards
     */
    renderIndividualScores(scores) {
        const container = document.getElementById('individualScores');
        if (!container) return;

        const scoresToShow = ['epworth', 'isi', 'stopbang', 'sleepSchedule', 'environment', 'circadian'];

        let html = '';
        scoresToShow.forEach(key => {
            const score = scores[key];
            if (!score) return;

            const percentage = Math.min(score.percentage || 0, 100);
            const severity = score.severity || 'normal';

            html += `
                <div class="score-card">
                    <h4>${score.name}</h4>
                    <div class="score-meter">
                        <div class="score-meter-fill ${severity}" style="width: ${percentage}%"></div>
                    </div>
                    <div class="score-details">
                        <span class="score-value-small">${score.score}/${score.maxScore}</span>
                        <span class="score-range">${score.label || ''}</span>
                    </div>
                    <span class="score-status ${severity}">${score.label || score.description}</span>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    /**
     * Render findings list
     */
    renderFindings(findings) {
        const container = document.getElementById('findingsList');
        if (!container) return;

        if (findings.length === 0) {
            container.innerHTML = '<p style="color: var(--text-light);">No significant findings identified.</p>';
            return;
        }

        const iconSVGs = {
            positive: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            concern: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
            info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        };

        let html = '';
        findings.forEach(finding => {
            html += `
                <div class="finding-item">
                    <div class="finding-icon ${finding.type}">
                        ${iconSVGs[finding.type] || iconSVGs.info}
                    </div>
                    <div class="finding-content">
                        <h4>${finding.title}</h4>
                        <p>${finding.text}</p>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    /**
     * Render recommendations list
     */
    renderRecommendations(recommendations) {
        const container = document.getElementById('recommendationsList');
        if (!container) return;

        if (recommendations.length === 0) {
            container.innerHTML = '<p style="color: var(--text-light);">No specific recommendations at this time. Continue with good sleep practices.</p>';
            return;
        }

        let html = '';
        recommendations.forEach(rec => {
            html += `
                <div class="recommendation-item">
                    <div class="recommendation-number">${rec.priority}</div>
                    <div class="recommendation-content">
                        <h4>${rec.title}</h4>
                        <p>${rec.text}</p>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }
};

// Make available globally
window.Results = Results;
