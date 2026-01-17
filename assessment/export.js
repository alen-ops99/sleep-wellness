/**
 * Export Module - PDF generation and email functionality
 */

const Export = {
    // EmailJS configuration - you'll need to set up an account at emailjs.com
    EMAILJS_SERVICE_ID: 'service_sleepwellness', // Replace with your service ID
    EMAILJS_TEMPLATE_ID: 'template_assessment',   // Replace with your template ID
    EMAILJS_PUBLIC_KEY: 'YOUR_PUBLIC_KEY',        // Replace with your public key

    /**
     * Generate and download PDF report
     */
    async downloadPDF() {
        const results = Storage.getResults();
        if (!results) {
            alert('No results available to export.');
            return;
        }

        // Create PDF content
        const content = this.generateReportHTML(results);

        // Create temporary container
        const container = document.createElement('div');
        container.innerHTML = content;
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.width = '210mm';
        document.body.appendChild(container);

        try {
            // Generate PDF using html2pdf.js
            const options = {
                margin: [15, 15, 15, 15],
                filename: `Sleep_Assessment_Report_${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    logging: false
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait'
                }
            };

            await html2pdf().set(options).from(container).save();

        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            document.body.removeChild(container);
        }
    },

    /**
     * Generate HTML for PDF report
     */
    generateReportHTML(results) {
        const date = new Date(results.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const clientTypeLabels = {
            'athlete': 'Elite Athlete',
            'executive': 'Corporate Executive',
            'hotel': 'Hotel Guest'
        };

        let html = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Montserrat:wght@400;500;600&display=swap');

                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Montserrat', sans-serif; color: #2c2c2c; line-height: 1.6; }

                .report-header {
                    background: #0f1c2e;
                    color: #FAF8F5;
                    padding: 40px;
                    text-align: center;
                    margin-bottom: 30px;
                }
                .report-logo {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 24px;
                    letter-spacing: 3px;
                    margin-bottom: 5px;
                }
                .report-subtitle {
                    font-size: 11px;
                    color: #C9A962;
                    letter-spacing: 2px;
                }
                .report-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 32px;
                    margin: 20px 0 10px;
                }
                .report-date {
                    font-size: 12px;
                    opacity: 0.8;
                }

                .section {
                    padding: 0 40px 30px;
                    page-break-inside: avoid;
                }
                .section-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 22px;
                    color: #0f1c2e;
                    border-bottom: 2px solid #C9A962;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }

                .score-summary {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 30px;
                }
                .overall-score-box {
                    text-align: center;
                    padding: 30px 50px;
                    background: #f5f3ef;
                    border: 1px solid #e0dbd3;
                }
                .overall-score-value {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 72px;
                    color: #0f1c2e;
                    line-height: 1;
                }
                .overall-score-label {
                    font-size: 12px;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-top: 10px;
                }

                .score-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .score-item {
                    background: #f9f8f6;
                    padding: 15px;
                    border: 1px solid #e0dbd3;
                }
                .score-item h4 {
                    font-size: 13px;
                    color: #0f1c2e;
                    margin-bottom: 8px;
                }
                .score-meter {
                    height: 8px;
                    background: #e0dbd3;
                    border-radius: 4px;
                    margin-bottom: 5px;
                }
                .score-meter-fill {
                    height: 100%;
                    border-radius: 4px;
                }
                .score-meter-fill.normal { background: #2E7D32; }
                .score-meter-fill.mild { background: #1976D2; }
                .score-meter-fill.moderate { background: #F57C00; }
                .score-meter-fill.severe { background: #C62828; }
                .score-details {
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    color: #666;
                }

                .finding-item, .recommendation-item {
                    padding: 15px;
                    margin-bottom: 10px;
                    background: #f9f8f6;
                    border-left: 3px solid #C9A962;
                }
                .finding-item h4, .recommendation-item h4 {
                    font-size: 14px;
                    color: #0f1c2e;
                    margin-bottom: 5px;
                }
                .finding-item p, .recommendation-item p {
                    font-size: 12px;
                    color: #666;
                }

                .demographics-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .demo-item {
                    background: #f9f8f6;
                    padding: 15px;
                    text-align: center;
                }
                .demo-label {
                    font-size: 10px;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .demo-value {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 24px;
                    color: #0f1c2e;
                    margin-top: 5px;
                }

                .footer {
                    margin-top: 40px;
                    padding: 30px 40px;
                    background: #0f1c2e;
                    color: #FAF8F5;
                    text-align: center;
                }
                .footer p {
                    font-size: 11px;
                    margin-bottom: 5px;
                }
                .footer a {
                    color: #C9A962;
                }
            </style>

            <div class="report-header">
                <div class="report-logo">SLEEP WELLNESS</div>
                <div class="report-subtitle">by Dr. Alen Juginovic, M.D.</div>
                <h1 class="report-title">Sleep Health Assessment Report</h1>
                <p class="report-date">${date}</p>
            </div>

            <div class="section">
                <h2 class="section-title">Client Profile</h2>
                <p style="margin-bottom: 15px;"><strong>Client Type:</strong> ${clientTypeLabels[results.clientType] || 'General'}</p>
                <div class="demographics-grid">
                    ${results.demographics.age ? `
                        <div class="demo-item">
                            <div class="demo-label">Age</div>
                            <div class="demo-value">${results.demographics.age}</div>
                        </div>
                    ` : ''}
                    ${results.demographics.gender ? `
                        <div class="demo-item">
                            <div class="demo-label">Gender</div>
                            <div class="demo-value">${results.demographics.gender}</div>
                        </div>
                    ` : ''}
                    ${results.demographics.bmi ? `
                        <div class="demo-item">
                            <div class="demo-label">BMI</div>
                            <div class="demo-value">${results.demographics.bmi}</div>
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">Overall Sleep Health Score</h2>
                <div class="score-summary">
                    <div class="overall-score-box">
                        <div class="overall-score-value">${results.overallScore}</div>
                        <div class="overall-score-label">out of 100</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">Assessment Scores</h2>
                <div class="score-grid">
                    ${this.renderScoreItems(results.scores)}
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">Key Findings</h2>
                ${results.findings.map(f => `
                    <div class="finding-item">
                        <h4>${f.title}</h4>
                        <p>${f.text}</p>
                    </div>
                `).join('')}
            </div>

            <div class="section">
                <h2 class="section-title">Recommendations</h2>
                ${results.recommendations.map(r => `
                    <div class="recommendation-item">
                        <h4>${r.priority}. ${r.title}</h4>
                        <p>${r.text}</p>
                    </div>
                `).join('')}
            </div>

            <div class="footer">
                <p><strong>Sleep Wellness by Dr. Alen Juginovic, M.D.</strong></p>
                <p>Harvard Medical School | <a href="mailto:alen_juginovic@hms.harvard.edu">alen_juginovic@hms.harvard.edu</a></p>
                <p style="margin-top: 15px; font-size: 10px; opacity: 0.7;">
                    This report is for informational purposes only and does not constitute medical advice.
                    Please consult a healthcare provider for diagnosis and treatment.
                </p>
            </div>
        `;

        return html;
    },

    /**
     * Render score items for PDF
     */
    renderScoreItems(scores) {
        const scoreKeys = ['epworth', 'isi', 'stopbang', 'sleepSchedule', 'environment', 'circadian'];
        let html = '';

        scoreKeys.forEach(key => {
            const score = scores[key];
            if (!score) return;

            const percentage = Math.min(score.percentage || 0, 100);
            const severity = score.severity || 'normal';

            html += `
                <div class="score-item">
                    <h4>${score.name}</h4>
                    <div class="score-meter">
                        <div class="score-meter-fill ${severity}" style="width: ${percentage}%"></div>
                    </div>
                    <div class="score-details">
                        <span>${score.score}/${score.maxScore}</span>
                        <span>${score.label || ''}</span>
                    </div>
                </div>
            `;
        });

        return html;
    },

    /**
     * Send results via email
     */
    async emailResults() {
        const results = Storage.getResults();
        if (!results) {
            alert('No results available to send.');
            return;
        }

        // Try EmailJS first
        if (typeof emailjs !== 'undefined' && this.EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
            try {
                await this.sendViaEmailJS(results);
                alert('Your results have been sent to Dr. Alen. You will receive a follow-up soon.');
                return;
            } catch (error) {
                console.error('EmailJS error:', error);
                // Fall back to mailto
            }
        }

        // Fallback: Open email client with pre-filled content
        this.openMailto(results);
    },

    /**
     * Send via EmailJS
     */
    async sendViaEmailJS(results) {
        const templateParams = {
            to_email: 'alen_juginovic@hms.harvard.edu',
            from_name: 'Sleep Assessment App',
            subject: `Sleep Assessment Results - ${results.clientType}`,
            overall_score: results.overallScore,
            client_type: results.clientType,
            ess_score: results.scores.epworth?.score || 'N/A',
            isi_score: results.scores.isi?.score || 'N/A',
            stopbang_score: results.scores.stopbang?.score || 'N/A',
            sleep_efficiency: results.scores.sleepSchedule?.sleepEfficiency || 'N/A',
            findings: results.findings.map(f => `- ${f.title}: ${f.text}`).join('\n'),
            recommendations: results.recommendations.map(r => `${r.priority}. ${r.title}`).join('\n'),
            needs_consultation: results.needsConsultation ? 'Yes' : 'No',
            timestamp: new Date(results.timestamp).toLocaleString()
        };

        emailjs.init(this.EMAILJS_PUBLIC_KEY);

        await emailjs.send(
            this.EMAILJS_SERVICE_ID,
            this.EMAILJS_TEMPLATE_ID,
            templateParams
        );
    },

    /**
     * Open mailto link as fallback
     */
    openMailto(results) {
        const subject = encodeURIComponent(`Sleep Assessment Results - ${results.clientType}`);

        const body = encodeURIComponent(this.formatEmailBody(results));

        window.location.href = `mailto:alen_juginovic@hms.harvard.edu?subject=${subject}&body=${body}`;
    },

    /**
     * Format email body text
     */
    formatEmailBody(results) {
        const date = new Date(results.timestamp).toLocaleDateString();

        let body = `SLEEP HEALTH ASSESSMENT RESULTS
========================================
Date: ${date}
Client Type: ${results.clientType}

OVERALL SCORE: ${results.overallScore}/100
${results.needsConsultation ? '*** CONSULTATION RECOMMENDED ***' : ''}

DEMOGRAPHICS
------------`;

        if (results.demographics.age) body += `\nAge: ${results.demographics.age}`;
        if (results.demographics.gender) body += `\nGender: ${results.demographics.gender}`;
        if (results.demographics.bmi) body += `\nBMI: ${results.demographics.bmi}`;

        body += `

QUESTIONNAIRE SCORES
--------------------`;

        const { scores } = results;
        if (scores.epworth) body += `\nEpworth Sleepiness Scale: ${scores.epworth.score}/24 (${scores.epworth.label})`;
        if (scores.isi) body += `\nInsomnia Severity Index: ${scores.isi.score}/28 (${scores.isi.label})`;
        if (scores.stopbang) body += `\nSTOP-BANG: ${scores.stopbang.score}/8 (${scores.stopbang.label})`;
        if (scores.sleepSchedule) body += `\nSleep Efficiency: ${scores.sleepSchedule.sleepEfficiency}%`;

        body += `

KEY FINDINGS
------------`;
        results.findings.forEach(f => {
            body += `\n- ${f.title}: ${f.text}`;
        });

        body += `

RECOMMENDATIONS
---------------`;
        results.recommendations.forEach(r => {
            body += `\n${r.priority}. ${r.title}`;
        });

        body += `

----------------------------------------
Generated by Sleep Wellness Assessment
https://www.sleepwellness.com`;

        return body;
    },

    /**
     * Export raw data as JSON (for debugging/backup)
     */
    exportJSON() {
        const data = Storage.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `sleep_assessment_data_${new Date().toISOString().split('T')[0]}.json`;
        a.click();

        URL.revokeObjectURL(url);
    }
};

// Make available globally
window.Export = Export;
