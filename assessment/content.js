/**
 * Content Module - Therapeutic content and unlock system
 */

const Content = {
    // Pre-hashed unlock codes (SHA-256)
    // To add new codes, hash them using: await Storage.hashCode('YOUR-CODE')
    validCodes: {
        // Master code - unlocks all modules
        '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92': { modules: ['all'] }, // Hash of "123456" for demo
        // Individual module codes would be added here
        // 'hashvalue': { modules: ['sleep-hygiene', 'breathing'] }
    },

    // Therapeutic modules
    modules: {
        'sleep-hygiene': {
            id: 'sleep-hygiene',
            title: 'Sleep Hygiene Essentials',
            description: 'Optimize your sleep environment and pre-sleep routine',
            icon: 'moon',
            locked: false, // Available to everyone
            content: `
                <h2>Sleep Hygiene Essentials</h2>
                <p>Sleep hygiene refers to the habits and practices that promote consistent, uninterrupted, and restorative sleep. These evidence-based recommendations form the foundation of good sleep.</p>

                <h3>The Sleep Environment</h3>
                <p><strong>Temperature:</strong> Keep your bedroom cool, ideally between 18-20°C (65-68°F). Your core body temperature needs to drop for sleep onset.</p>
                <p><strong>Light:</strong> Complete darkness is essential. Even dim light can suppress melatonin by up to 50%. Use blackout curtains and cover all LED lights.</p>
                <p><strong>Sound:</strong> Aim for quiet or consistent white noise. Sudden sounds disrupt sleep architecture even if you don't fully wake.</p>
                <p><strong>Comfort:</strong> Invest in a quality mattress and pillows. Replace mattresses every 7-10 years.</p>

                <h3>Timing Behaviors</h3>
                <ul>
                    <li><strong>Consistent schedule:</strong> Wake at the same time every day, including weekends</li>
                    <li><strong>Caffeine cutoff:</strong> No caffeine after 2 PM (or 8 hours before bed)</li>
                    <li><strong>Alcohol timing:</strong> Avoid alcohol within 3 hours of bedtime</li>
                    <li><strong>Exercise timing:</strong> Complete vigorous exercise at least 4-6 hours before bed</li>
                    <li><strong>Screen curfew:</strong> No screens 1 hour before bed, or use blue light filtering</li>
                </ul>

                <h3>Pre-Sleep Routine</h3>
                <p>Create a consistent 30-60 minute wind-down routine that signals to your brain it's time for sleep:</p>
                <ol>
                    <li>Dim lights throughout your home 1-2 hours before bed</li>
                    <li>Take a warm bath or shower (the subsequent cooling helps sleep onset)</li>
                    <li>Practice relaxation techniques (breathing, meditation)</li>
                    <li>Read a physical book (not screens)</li>
                    <li>Write a brief to-do list to offload mental tasks</li>
                </ol>

                <h3>The Bedroom Rule</h3>
                <p>Reserve your bed for sleep and intimacy only. Do not work, watch TV, scroll social media, or eat in bed. This strengthens the mental association between your bed and sleep.</p>
            `
        },
        'breathing-478': {
            id: 'breathing-478',
            title: '4-7-8 Breathing Technique',
            description: 'A powerful breathing exercise for sleep and relaxation',
            icon: 'wind',
            locked: true,
            content: `
                <h2>4-7-8 Breathing Technique</h2>
                <p>The 4-7-8 breathing technique, developed by Dr. Andrew Weil, is a powerful relaxation method based on pranayama yoga breathing. It acts as a natural tranquilizer for the nervous system.</p>

                <h3>How It Works</h3>
                <p>This technique works by:</p>
                <ul>
                    <li>Activating the parasympathetic nervous system (rest and digest)</li>
                    <li>Reducing heart rate and blood pressure</li>
                    <li>Reducing cortisol and stress hormones</li>
                    <li>Increasing oxygen exchange and carbon dioxide release</li>
                </ul>

                <h3>The Technique</h3>
                <ol>
                    <li><strong>Inhale</strong> quietly through your nose for <strong>4 counts</strong></li>
                    <li><strong>Hold</strong> your breath for <strong>7 counts</strong></li>
                    <li><strong>Exhale</strong> completely through your mouth for <strong>8 counts</strong></li>
                    <li>Repeat for 4 breath cycles initially</li>
                </ol>

                <h3>Practice Timer</h3>
                <div class="breathing-timer">
                    <div class="breathing-circle" id="breathingCircle">
                        <span class="breathing-text" id="breathingText">Ready</span>
                    </div>
                    <div class="breathing-count" id="breathingCount"></div>
                    <div class="timer-controls">
                        <button class="btn-primary" onclick="Content.startBreathing()">Start Practice</button>
                        <button class="btn-secondary" onclick="Content.stopBreathing()">Stop</button>
                    </div>
                </div>

                <h3>Practice Schedule</h3>
                <ul>
                    <li><strong>Week 1:</strong> 4 breath cycles, twice daily</li>
                    <li><strong>Week 2:</strong> 4 breath cycles, twice daily (building habit)</li>
                    <li><strong>Week 3+:</strong> Can increase to 8 breath cycles</li>
                </ul>

                <p><strong>Important:</strong> Practice regularly for best results. The technique becomes more effective with consistent use.</p>
            `
        },
        'pmr': {
            id: 'pmr',
            title: 'Progressive Muscle Relaxation',
            description: 'Systematic muscle tension release for deep relaxation',
            icon: 'body',
            locked: true,
            content: `
                <h2>Progressive Muscle Relaxation (PMR)</h2>
                <p>Progressive Muscle Relaxation is a technique developed by Dr. Edmund Jacobson in the 1930s. It involves systematically tensing and releasing muscle groups to reduce physical tension and promote relaxation.</p>

                <h3>The Science</h3>
                <p>PMR works through the principle that physical relaxation leads to mental relaxation. When you deliberately tense muscles and then release them, you:</p>
                <ul>
                    <li>Become more aware of tension you're holding</li>
                    <li>Learn to recognize the difference between tense and relaxed states</li>
                    <li>Activate the relaxation response</li>
                    <li>Reduce anxiety and promote sleep onset</li>
                </ul>

                <h3>The 16-Muscle Group Protocol</h3>
                <p>For each muscle group: tense for 5 seconds, then relax for 15-20 seconds.</p>
                <ol>
                    <li><strong>Right hand and forearm:</strong> Make a fist</li>
                    <li><strong>Right upper arm:</strong> Bend arm, tense bicep</li>
                    <li><strong>Left hand and forearm:</strong> Make a fist</li>
                    <li><strong>Left upper arm:</strong> Bend arm, tense bicep</li>
                    <li><strong>Forehead:</strong> Raise eyebrows high</li>
                    <li><strong>Eyes and cheeks:</strong> Squeeze eyes shut</li>
                    <li><strong>Mouth and jaw:</strong> Clench teeth, pull corners of mouth back</li>
                    <li><strong>Neck:</strong> Pull chin toward chest while resisting</li>
                    <li><strong>Shoulders:</strong> Shrug shoulders up toward ears</li>
                    <li><strong>Chest:</strong> Take a deep breath and hold</li>
                    <li><strong>Stomach:</strong> Tighten abdominal muscles</li>
                    <li><strong>Lower back:</strong> Arch back gently</li>
                    <li><strong>Right thigh:</strong> Tense by pressing knee down</li>
                    <li><strong>Right calf:</strong> Point toes toward face</li>
                    <li><strong>Left thigh:</strong> Tense by pressing knee down</li>
                    <li><strong>Left calf:</strong> Point toes toward face</li>
                </ol>

                <h3>Quick 4-Group Version</h3>
                <p>When short on time, use this condensed version:</p>
                <ol>
                    <li><strong>Arms:</strong> Tense both arms, making fists and bending at elbows</li>
                    <li><strong>Face and neck:</strong> Scrunch face and shrug shoulders</li>
                    <li><strong>Torso:</strong> Take deep breath, tense stomach and back</li>
                    <li><strong>Legs:</strong> Tense thighs, point toes up</li>
                </ol>

                <h3>Tips for Success</h3>
                <ul>
                    <li>Practice in a quiet, comfortable place</li>
                    <li>Wear loose clothing</li>
                    <li>Don't tense to the point of pain</li>
                    <li>Focus on the contrast between tension and relaxation</li>
                    <li>Practice daily for 2 weeks to master the technique</li>
                </ul>
            `
        },
        'cbti-restriction': {
            id: 'cbti-restriction',
            title: 'CBT-I: Sleep Restriction',
            description: 'Calculate your optimal sleep window to improve sleep efficiency',
            icon: 'clock',
            locked: true,
            content: `
                <h2>Sleep Restriction Therapy</h2>
                <p>Sleep restriction is a core component of Cognitive Behavioral Therapy for Insomnia (CBT-I). It works by temporarily limiting time in bed to match actual sleep time, then gradually expanding as sleep efficiency improves.</p>

                <h3>Why It Works</h3>
                <p>Many people with insomnia spend too much time in bed trying to "catch up" on sleep. This actually:</p>
                <ul>
                    <li>Fragments sleep into shorter, lighter periods</li>
                    <li>Reduces sleep efficiency (time asleep vs. time in bed)</li>
                    <li>Creates negative associations with the bed</li>
                    <li>Perpetuates the insomnia cycle</li>
                </ul>

                <h3>Calculating Your Sleep Window</h3>
                <p>Your initial sleep window = your average actual sleep time (minimum 5 hours)</p>

                <div class="sleep-window-calculator" style="background: white; padding: 25px; border: 1px solid rgba(201, 169, 98, 0.3); margin: 20px 0;">
                    <p><strong>Example:</strong> If you spend 8 hours in bed but only sleep 5.5 hours, your initial sleep window is 5.5 hours.</p>
                    <p><strong>Pick your wake time first</strong> (this stays fixed), then count backwards.</p>
                    <p>Wake time: 6:30 AM - Sleep window: 5.5 hours = Bedtime: 1:00 AM</p>
                </div>

                <h3>Weekly Protocol</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="background: var(--navy); color: var(--cream);">
                        <th style="padding: 12px; text-align: left;">Week</th>
                        <th style="padding: 12px; text-align: left;">Sleep Efficiency</th>
                        <th style="padding: 12px; text-align: left;">Adjustment</th>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(201, 169, 98, 0.2);">
                        <td style="padding: 12px;">1</td>
                        <td style="padding: 12px;">Establish baseline</td>
                        <td style="padding: 12px;">Use calculated window</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(201, 169, 98, 0.2);">
                        <td style="padding: 12px;">2+</td>
                        <td style="padding: 12px;">> 90%</td>
                        <td style="padding: 12px;">Add 15-30 min earlier bedtime</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(201, 169, 98, 0.2);">
                        <td style="padding: 12px;">2+</td>
                        <td style="padding: 12px;">85-90%</td>
                        <td style="padding: 12px;">Keep same window</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px;">2+</td>
                        <td style="padding: 12px;">< 85%</td>
                        <td style="padding: 12px;">Reduce by 15 min (never below 5 hrs)</td>
                    </tr>
                </table>

                <h3>Sleep Efficiency Formula</h3>
                <p><strong>Sleep Efficiency = (Total Sleep Time / Time in Bed) x 100</strong></p>
                <p>Target: 85-90%+ before expanding your sleep window.</p>

                <h3>Important Guidelines</h3>
                <ul>
                    <li>Keep wake time fixed - adjust bedtime only</li>
                    <li>No napping during the restriction period</li>
                    <li>Get out of bed if awake for more than 20 minutes</li>
                    <li>Expect temporary daytime fatigue - this is normal</li>
                    <li>Track your sleep with a diary for accurate calculations</li>
                </ul>

                <p><strong>Caution:</strong> Sleep restriction can cause temporary sleepiness. Be careful with driving and operating machinery. This protocol is not recommended for those with bipolar disorder, seizure disorders, or in jobs requiring high alertness.</p>
            `
        },
        'cbti-stimulus': {
            id: 'cbti-stimulus',
            title: 'CBT-I: Stimulus Control',
            description: 'Strengthen the association between your bed and sleep',
            icon: 'bed',
            locked: true,
            content: `
                <h2>Stimulus Control Therapy</h2>
                <p>Stimulus control therapy re-establishes your bed as a cue for sleep rather than wakefulness. It's one of the most effective single interventions for insomnia.</p>

                <h3>The Problem</h3>
                <p>When you regularly lie awake in bed, you create a learned association:</p>
                <p><strong>Bed = Frustration, anxiety, wakefulness</strong></p>
                <p>The goal is to re-train your brain to associate:</p>
                <p><strong>Bed = Relaxation, drowsiness, sleep</strong></p>

                <h3>The Rules</h3>
                <ol>
                    <li><strong>Go to bed only when sleepy</strong> - not just tired. Sleepy means struggling to keep your eyes open, yawning, nodding off.</li>

                    <li><strong>Use the bed only for sleep and intimacy</strong> - no reading, TV, phone, eating, or working in bed.</li>

                    <li><strong>If unable to sleep within ~20 minutes, get up</strong> - don't clock-watch, but if you sense you've been awake too long, leave the bedroom.</li>

                    <li><strong>Go to another room and do something relaxing</strong> - read with dim light, listen to calm music, do relaxation exercises. Return to bed only when sleepy.</li>

                    <li><strong>Repeat Step 3-4 as needed</strong> - this may happen multiple times per night initially. This is normal and temporary.</li>

                    <li><strong>Set an alarm for the same time every morning</strong> - regardless of how much you slept. No sleeping in to "catch up."</li>

                    <li><strong>No daytime napping</strong> - at least during the initial treatment period (2-4 weeks).</li>
                </ol>

                <h3>What to Do When You Get Up</h3>
                <ul>
                    <li>Keep lights dim</li>
                    <li>Read a boring or relaxing book (physical, not screen)</li>
                    <li>Listen to calm music or a podcast</li>
                    <li>Practice relaxation techniques (breathing, PMR)</li>
                    <li>Write down racing thoughts in a worry journal</li>
                    <li><strong>Avoid:</strong> screens, bright lights, work, exciting content, eating</li>
                </ul>

                <h3>Troubleshooting</h3>
                <p><strong>"I'm getting up multiple times per night"</strong></p>
                <p>This is common in the first 1-2 weeks. It gets better as the new association forms. Stick with it.</p>

                <p><strong>"I'm more tired than before"</strong></p>
                <p>Temporary increased fatigue is normal. Your sleep drive is building, which will lead to better sleep. Don't compensate with naps or earlier bedtimes.</p>

                <p><strong>"I fall asleep on the couch but not in bed"</strong></p>
                <p>This proves the association problem. When you feel sleepy on the couch, move immediately to bed.</p>
            `
        },
        'cbti-cognitive': {
            id: 'cbti-cognitive',
            title: 'CBT-I: Cognitive Restructuring',
            description: 'Challenge and change unhelpful thoughts about sleep',
            icon: 'brain',
            locked: true,
            content: `
                <h2>Cognitive Restructuring for Sleep</h2>
                <p>Cognitive restructuring addresses the unhelpful thoughts and beliefs that perpetuate insomnia. These thoughts create anxiety about sleep, which makes sleep harder.</p>

                <h3>Common Unhelpful Thoughts</h3>
                <ul>
                    <li>"I must get 8 hours or I can't function"</li>
                    <li>"I'll never be able to sleep normally again"</li>
                    <li>"One bad night will ruin my whole week"</li>
                    <li>"If I don't fall asleep soon, tomorrow will be a disaster"</li>
                    <li>"I've tried everything - nothing works for me"</li>
                </ul>

                <h3>The Thought Record</h3>
                <p>Use this process to challenge unhelpful thoughts:</p>

                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="background: var(--navy); color: var(--cream);">
                        <th style="padding: 12px;">Step</th>
                        <th style="padding: 12px;">Action</th>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(201, 169, 98, 0.2);">
                        <td style="padding: 12px;">1. Identify</td>
                        <td style="padding: 12px;">What thought is going through my mind?</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(201, 169, 98, 0.2);">
                        <td style="padding: 12px;">2. Examine</td>
                        <td style="padding: 12px;">What evidence supports this thought? What evidence contradicts it?</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(201, 169, 98, 0.2);">
                        <td style="padding: 12px;">3. Alternative</td>
                        <td style="padding: 12px;">What's a more balanced, realistic thought?</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px;">4. Outcome</td>
                        <td style="padding: 12px;">How do I feel with this new perspective?</td>
                    </tr>
                </table>

                <h3>Reframing Examples</h3>

                <div style="background: white; padding: 20px; border-left: 4px solid var(--gold); margin: 15px 0;">
                    <p><strong>Unhelpful:</strong> "I only got 5 hours of sleep. Today will be terrible."</p>
                    <p><strong>Balanced:</strong> "I've functioned on less sleep before. I may be tired but I can get through the day. One night won't have lasting effects."</p>
                </div>

                <div style="background: white; padding: 20px; border-left: 4px solid var(--gold); margin: 15px 0;">
                    <p><strong>Unhelpful:</strong> "I must fall asleep right now or I won't be able to cope."</p>
                    <p><strong>Balanced:</strong> "Putting pressure on myself makes it harder. My body knows how to sleep. I'll rest quietly and sleep will come."</p>
                </div>

                <div style="background: white; padding: 20px; border-left: 4px solid var(--gold); margin: 15px 0;">
                    <p><strong>Unhelpful:</strong> "My insomnia is ruining my life."</p>
                    <p><strong>Balanced:</strong> "Poor sleep is affecting me, but I'm still functioning. I'm taking steps to improve. This is temporary, not permanent."</p>
                </div>

                <h3>Sleep Facts to Remember</h3>
                <ul>
                    <li>The body can handle occasional short sleep without lasting harm</li>
                    <li>Trying too hard to sleep makes sleep harder</li>
                    <li>Sleep needs vary - not everyone needs 8 hours</li>
                    <li>Lying quietly in bed has restorative value even without sleep</li>
                    <li>Insomnia is treatable - most people improve significantly with CBT-I</li>
                </ul>
            `
        },
        'sleep-diary': {
            id: 'sleep-diary',
            title: 'Interactive Sleep Diary',
            description: 'Track your sleep patterns with automatic calculations',
            icon: 'journal',
            locked: true,
            content: `
                <h2>Sleep Diary</h2>
                <p>A sleep diary is essential for understanding your sleep patterns and measuring improvement. Complete this each morning for at least 2 weeks.</p>

                <h3>Today's Entry</h3>
                <div class="diary-entry" id="diaryEntry">
                    <div class="diary-grid">
                        <div class="diary-field">
                            <label>Date</label>
                            <input type="date" id="diaryDate" value="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="diary-field">
                            <label>Time you went to bed</label>
                            <input type="time" id="diaryBedtime" value="23:00">
                        </div>
                        <div class="diary-field">
                            <label>Time you tried to sleep</label>
                            <input type="time" id="diaryTryTime" value="23:15">
                        </div>
                        <div class="diary-field">
                            <label>Minutes to fall asleep</label>
                            <input type="number" id="diaryLatency" min="0" max="300" value="20">
                        </div>
                        <div class="diary-field">
                            <label>Number of awakenings</label>
                            <input type="number" id="diaryAwakenings" min="0" max="20" value="2">
                        </div>
                        <div class="diary-field">
                            <label>Minutes awake during night</label>
                            <input type="number" id="diaryWaso" min="0" max="300" value="30">
                        </div>
                        <div class="diary-field">
                            <label>Final wake time</label>
                            <input type="time" id="diaryWakeTime" value="06:30">
                        </div>
                        <div class="diary-field">
                            <label>Time you got out of bed</label>
                            <input type="time" id="diaryRiseTime" value="07:00">
                        </div>
                        <div class="diary-field">
                            <label>Sleep quality (1-5)</label>
                            <select id="diaryQuality">
                                <option value="1">1 - Very Poor</option>
                                <option value="2">2 - Poor</option>
                                <option value="3" selected>3 - Fair</option>
                                <option value="4">4 - Good</option>
                                <option value="5">5 - Excellent</option>
                            </select>
                        </div>
                    </div>
                    <button class="btn-primary" onclick="Content.calculateDiary()" style="margin-top: 20px;">Calculate</button>
                </div>

                <div class="diary-results" id="diaryResults" style="display: none; margin-top: 20px; padding: 25px; background: white; border: 1px solid rgba(201, 169, 98, 0.2);">
                    <h4>Your Sleep Metrics</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 15px;">
                        <div>
                            <span style="color: var(--text-light); font-size: 13px;">Time in Bed</span>
                            <p style="font-size: 24px; color: var(--navy); font-weight: 500;" id="resultTIB">--</p>
                        </div>
                        <div>
                            <span style="color: var(--text-light); font-size: 13px;">Total Sleep Time</span>
                            <p style="font-size: 24px; color: var(--navy); font-weight: 500;" id="resultTST">--</p>
                        </div>
                        <div>
                            <span style="color: var(--text-light); font-size: 13px;">Sleep Efficiency</span>
                            <p style="font-size: 24px; font-weight: 500;" id="resultSE">--</p>
                        </div>
                        <div>
                            <span style="color: var(--text-light); font-size: 13px;">Sleep Onset Latency</span>
                            <p style="font-size: 24px; color: var(--navy); font-weight: 500;" id="resultSOL">--</p>
                        </div>
                    </div>
                </div>

                <h3>Understanding Your Metrics</h3>
                <ul>
                    <li><strong>Time in Bed (TIB):</strong> Total time from getting into bed to getting out</li>
                    <li><strong>Total Sleep Time (TST):</strong> TIB minus time awake (latency + night wakings)</li>
                    <li><strong>Sleep Efficiency (SE):</strong> TST/TIB x 100. Target: 85%+</li>
                    <li><strong>Sleep Onset Latency (SOL):</strong> Time to fall asleep. Target: under 30 min</li>
                </ul>
            `
        }
    },

    /**
     * Verify an unlock code
     */
    async verifyUnlockCode() {
        const input = document.getElementById('unlockCode');
        const code = input.value.trim();

        if (!code) {
            alert('Please enter an unlock code.');
            return;
        }

        const hash = await Storage.hashCode(code);

        if (this.validCodes[hash]) {
            const modules = this.validCodes[hash].modules;
            Storage.saveUnlockCode(hash, modules);

            if (modules.includes('all')) {
                alert('All therapeutic modules have been unlocked!');
            } else {
                alert(`Unlocked: ${modules.join(', ')}`);
            }

            input.value = '';
            this.renderModules();
        } else {
            alert('Invalid unlock code. Please contact Dr. Alen for your personalized code.');
        }
    },

    /**
     * Render modules grid
     */
    renderModules() {
        const container = document.getElementById('modulesGrid');
        if (!container) return;

        const unlockedModules = Storage.getUnlockedModules();
        const hasAllUnlocked = unlockedModules.includes('all');

        let html = '';
        for (const moduleId in this.modules) {
            const module = this.modules[moduleId];
            const isUnlocked = !module.locked || hasAllUnlocked || unlockedModules.includes(moduleId);

            html += `
                <div class="module-card ${isUnlocked ? '' : 'locked'}" onclick="${isUnlocked ? `Content.openModule('${moduleId}')` : ''}">
                    ${!isUnlocked ? `
                        <svg class="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                    ` : ''}
                    <svg class="module-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        ${this.getModuleIconSVG(module.icon)}
                    </svg>
                    <h4>${module.title}</h4>
                    <p>${module.description}</p>
                </div>
            `;
        }

        container.innerHTML = html;

        // Update unlock section visibility
        const unlockSection = document.getElementById('unlockSection');
        if (unlockSection) {
            unlockSection.style.display = hasAllUnlocked ? 'none' : 'block';
        }
    },

    /**
     * Get SVG path for module icon
     */
    getModuleIconSVG(icon) {
        const icons = {
            'moon': '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
            'wind': '<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>',
            'body': '<circle cx="12" cy="5" r="3"/><path d="M12 8v8m-4 4l4-4 4 4"/>',
            'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
            'bed': '<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>',
            'brain': '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54"/>',
            'journal': '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'
        };
        return icons[icon] || icons['moon'];
    },

    /**
     * Open a module in the modal
     */
    openModule(moduleId) {
        const module = this.modules[moduleId];
        if (!module) return;

        const modal = document.getElementById('contentModal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = module.content;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    /**
     * Close the modal
     */
    closeModal() {
        const modal = document.getElementById('contentModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        this.stopBreathing();
    },

    /**
     * Breathing exercise state
     */
    breathingInterval: null,
    breathingPhase: 'ready',
    breathingCount: 0,
    breathingCycle: 0,

    /**
     * Start breathing exercise
     */
    startBreathing() {
        this.stopBreathing();
        this.breathingCycle = 0;
        this.runBreathingCycle();
    },

    /**
     * Run a breathing cycle
     */
    runBreathingCycle() {
        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        const count = document.getElementById('breathingCount');

        if (!circle || !text) return;

        // Inhale for 4 counts
        this.breathingPhase = 'inhale';
        text.textContent = 'Inhale';
        circle.classList.add('inhale');
        circle.classList.remove('exhale');

        let currentCount = 4;
        count.textContent = currentCount;

        this.breathingInterval = setInterval(() => {
            currentCount--;

            if (currentCount > 0) {
                count.textContent = currentCount;
            } else if (this.breathingPhase === 'inhale') {
                // Hold for 7 counts
                this.breathingPhase = 'hold';
                text.textContent = 'Hold';
                currentCount = 7;
                count.textContent = currentCount;
            } else if (this.breathingPhase === 'hold') {
                // Exhale for 8 counts
                this.breathingPhase = 'exhale';
                text.textContent = 'Exhale';
                circle.classList.remove('inhale');
                circle.classList.add('exhale');
                currentCount = 8;
                count.textContent = currentCount;
            } else if (this.breathingPhase === 'exhale') {
                this.breathingCycle++;
                if (this.breathingCycle < 4) {
                    // Start next cycle
                    clearInterval(this.breathingInterval);
                    this.runBreathingCycle();
                } else {
                    // Complete
                    this.stopBreathing();
                    text.textContent = 'Complete';
                    count.textContent = '';
                }
            }
        }, 1000);
    },

    /**
     * Stop breathing exercise
     */
    stopBreathing() {
        if (this.breathingInterval) {
            clearInterval(this.breathingInterval);
            this.breathingInterval = null;
        }

        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        const count = document.getElementById('breathingCount');

        if (circle) {
            circle.classList.remove('inhale', 'exhale');
        }
        if (text) {
            text.textContent = 'Ready';
        }
        if (count) {
            count.textContent = '';
        }
    },

    /**
     * Calculate sleep diary metrics
     */
    calculateDiary() {
        const bedtime = document.getElementById('diaryBedtime').value;
        const riseTime = document.getElementById('diaryRiseTime').value;
        const latency = parseInt(document.getElementById('diaryLatency').value) || 0;
        const waso = parseInt(document.getElementById('diaryWaso').value) || 0;

        // Calculate TIB in minutes
        const [bedH, bedM] = bedtime.split(':').map(Number);
        const [riseH, riseM] = riseTime.split(':').map(Number);

        let tibMinutes = (riseH * 60 + riseM) - (bedH * 60 + bedM);
        if (tibMinutes < 0) tibMinutes += 24 * 60; // Handle crossing midnight

        // Calculate TST
        const tstMinutes = tibMinutes - latency - waso;

        // Calculate Sleep Efficiency
        const sleepEfficiency = ((tstMinutes / tibMinutes) * 100).toFixed(1);

        // Format times
        const formatTime = (mins) => {
            const h = Math.floor(mins / 60);
            const m = mins % 60;
            return `${h}h ${m}m`;
        };

        // Display results
        document.getElementById('resultTIB').textContent = formatTime(tibMinutes);
        document.getElementById('resultTST').textContent = formatTime(tstMinutes);
        document.getElementById('resultSOL').textContent = `${latency} min`;

        const seElement = document.getElementById('resultSE');
        seElement.textContent = `${sleepEfficiency}%`;

        // Color code sleep efficiency
        if (sleepEfficiency >= 85) {
            seElement.style.color = '#2E7D32'; // Green
        } else if (sleepEfficiency >= 75) {
            seElement.style.color = '#F57C00'; // Orange
        } else {
            seElement.style.color = '#C62828'; // Red
        }

        document.getElementById('diaryResults').style.display = 'block';
    }
};

// Make available globally
window.Content = Content;
