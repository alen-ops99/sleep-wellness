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
            duration: '10-15 min read',
            difficulty: 'Beginner',
            indications: ['All clients', 'First-line intervention', 'Mild sleep difficulties'],
            evidence: 'AASM Practice Guidelines',
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
            duration: '5-10 min practice',
            difficulty: 'Beginner',
            indications: ['Anxiety at bedtime', 'Racing thoughts', 'Stress-related insomnia', 'Quick relaxation needed'],
            evidence: 'Pranayama research, clinical experience',
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
            duration: '15-20 min practice',
            difficulty: 'Beginner',
            indications: ['Physical tension', 'Anxiety disorders', 'Difficulty relaxing body', 'Somatic symptoms'],
            evidence: 'RCTs, AASM recommended',
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
            duration: '2-4 weeks protocol',
            difficulty: 'Intermediate',
            indications: ['Sleep maintenance insomnia', 'Low sleep efficiency (<85%)', 'Fragmented sleep', 'Excessive time in bed'],
            evidence: 'Strong RCT evidence, AASM first-line',
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
            duration: '2-3 weeks protocol',
            difficulty: 'Intermediate',
            indications: ['Sleep onset insomnia', 'Conditioned arousal', 'Bed = wakefulness association', 'Frustration in bed'],
            evidence: 'Strong RCT evidence, AASM first-line',
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
            duration: '15-20 min + ongoing practice',
            difficulty: 'Intermediate',
            indications: ['Catastrophic thoughts about sleep', 'Sleep-related anxiety', 'Unrealistic sleep expectations', 'Rumination'],
            evidence: 'CBT-I component, strong evidence',
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
            duration: '2-5 min daily',
            difficulty: 'Beginner',
            indications: ['All CBT-I clients', 'Baseline assessment', 'Progress tracking', 'Sleep efficiency monitoring'],
            evidence: 'Essential CBT-I component',
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
        },
        'mindfulness-bodyscan': {
            id: 'mindfulness-bodyscan',
            title: 'Mindfulness & Body Scan',
            description: 'Mindfulness meditation and body scan techniques for sleep',
            icon: 'meditation',
            locked: true,
            duration: '10-20 min practice',
            difficulty: 'Beginner',
            indications: ['Racing thoughts', 'General anxiety', 'Difficulty unwinding', 'Mind-body connection issues'],
            evidence: 'MBSR research, multiple RCTs',
            content: `
                <h2>Mindfulness & Body Scan Meditation</h2>
                <p>Mindfulness meditation trains your attention to stay in the present moment, reducing the racing thoughts and worries that often prevent sleep. The body scan is a specific mindfulness technique particularly effective for sleep.</p>

                <h3>Why Mindfulness Helps Sleep</h3>
                <ul>
                    <li><strong>Breaks the worry cycle:</strong> Anchors attention to the present instead of future concerns</li>
                    <li><strong>Reduces physiological arousal:</strong> Activates the parasympathetic nervous system</li>
                    <li><strong>Improves sleep quality:</strong> Research shows regular practice increases deep sleep</li>
                    <li><strong>Non-judgmental awareness:</strong> Reduces frustration about not sleeping</li>
                </ul>

                <h3>Basic Mindfulness for Sleep</h3>
                <ol>
                    <li><strong>Get comfortable:</strong> Lie on your back, arms at your sides, palms up</li>
                    <li><strong>Close your eyes:</strong> Let them rest gently without squeezing</li>
                    <li><strong>Focus on breath:</strong> Notice the natural rhythm without changing it</li>
                    <li><strong>When thoughts arise:</strong> Acknowledge them ("thinking") and gently return to breath</li>
                    <li><strong>No judgment:</strong> Getting distracted is normal - just return to breath each time</li>
                </ol>

                <h3>The Body Scan Technique</h3>
                <p>The body scan systematically moves attention through your body, releasing tension you may not have noticed.</p>

                <div style="background: white; padding: 25px; border: 1px solid rgba(201, 169, 98, 0.3); margin: 20px 0;">
                    <h4 style="color: var(--navy); margin-bottom: 15px;">15-Minute Body Scan Protocol</h4>
                    <ol style="line-height: 1.8;">
                        <li><strong>Feet (2 min):</strong> Notice sensations in toes, soles, tops of feet. Feel them relax and sink into the bed.</li>
                        <li><strong>Lower legs (2 min):</strong> Calves and shins. Notice any tension. Let it dissolve.</li>
                        <li><strong>Upper legs (2 min):</strong> Thighs, knees, hamstrings. Feel the heaviness.</li>
                        <li><strong>Pelvis & hips (1 min):</strong> Let your hips release into the mattress.</li>
                        <li><strong>Abdomen (2 min):</strong> Notice breath here. Let belly soften with each exhale.</li>
                        <li><strong>Chest & back (2 min):</strong> Feel ribs expand and contract. Release shoulder blade tension.</li>
                        <li><strong>Hands & arms (2 min):</strong> Fingers, wrists, forearms, upper arms. Let them be heavy.</li>
                        <li><strong>Neck & shoulders (1 min):</strong> Common tension area. Let shoulders drop away from ears.</li>
                        <li><strong>Face & head (1 min):</strong> Jaw, eyes, forehead, scalp. Soften all facial muscles.</li>
                    </ol>
                </div>

                <h3>Quick 5-Minute Version</h3>
                <p>When short on time, use this condensed body scan:</p>
                <ol>
                    <li><strong>Lower body (1.5 min):</strong> Feet, legs, hips as one unit</li>
                    <li><strong>Torso (1.5 min):</strong> Abdomen, chest, back</li>
                    <li><strong>Upper body (1.5 min):</strong> Arms, shoulders, neck, face</li>
                    <li><strong>Whole body (30 sec):</strong> Feel entire body as one relaxed unit</li>
                </ol>

                <h3>Tips for Practice</h3>
                <ul>
                    <li>Practice at the same time each night for best results</li>
                    <li>It's okay to fall asleep during practice - that's the goal at bedtime</li>
                    <li>If you notice tension, don't fight it - just observe and breathe into it</li>
                    <li>Start with guided recordings, then progress to self-guided practice</li>
                    <li>Even 5 minutes is beneficial - consistency matters more than duration</li>
                </ul>

                <h3>The "Leaves on a Stream" Exercise</h3>
                <p>For persistent racing thoughts:</p>
                <ol>
                    <li>Visualize a gentle stream with leaves floating by</li>
                    <li>When a thought arises, place it on a leaf</li>
                    <li>Watch the leaf float downstream and out of sight</li>
                    <li>Don't try to stop thoughts - just let them pass</li>
                    <li>Return attention to the stream</li>
                </ol>
            `
        },
        'paradoxical-intention': {
            id: 'paradoxical-intention',
            title: 'Paradoxical Intention',
            description: 'Reduce sleep anxiety by trying to stay awake',
            icon: 'reverse',
            locked: true,
            duration: '1-2 weeks practice',
            difficulty: 'Intermediate',
            indications: ['Performance anxiety about sleep', 'Trying too hard to sleep', 'Sleep effort insomnia', 'Frustration at bedtime'],
            evidence: 'CBT-I component, RCT supported',
            content: `
                <h2>Paradoxical Intention Therapy</h2>
                <p>Paradoxical intention is a CBT-I technique that reduces performance anxiety about sleep by doing the opposite of what you normally try to do: instead of trying to fall asleep, you try to stay awake.</p>

                <h3>The Problem with "Trying" to Sleep</h3>
                <p>When you have insomnia, you develop <strong>performance anxiety</strong> about sleep:</p>
                <ul>
                    <li>"I must fall asleep or tomorrow will be terrible"</li>
                    <li>Clock-watching and calculating how much sleep you'll get</li>
                    <li>Trying harder and harder to relax</li>
                    <li>Frustration and tension that makes sleep impossible</li>
                </ul>
                <p>This creates a vicious cycle: the harder you try to sleep, the more awake you become.</p>

                <h3>How Paradoxical Intention Works</h3>
                <p>By trying to stay awake (without using stimulation), you:</p>
                <ul>
                    <li><strong>Remove performance anxiety:</strong> No pressure to fall asleep</li>
                    <li><strong>Stop effortful behavior:</strong> Trying to sleep is counterproductive</li>
                    <li><strong>Reduce hyperarousal:</strong> Less anxiety = lower physiological arousal</li>
                    <li><strong>Allow natural sleep:</strong> Sleep comes naturally when you stop fighting</li>
                </ul>

                <h3>The Technique</h3>
                <div style="background: white; padding: 25px; border: 1px solid rgba(201, 169, 98, 0.3); margin: 20px 0;">
                    <ol style="line-height: 1.8;">
                        <li><strong>Prepare for bed normally:</strong> Complete your wind-down routine</li>
                        <li><strong>Lie in bed comfortably:</strong> Eyes open or closed, whatever feels natural</li>
                        <li><strong>Tell yourself:</strong> "I'm going to stay awake as long as possible"</li>
                        <li><strong>Lie passively:</strong> Don't read, don't watch TV, don't look at phone</li>
                        <li><strong>Keep your eyes open:</strong> If comfortable, try to keep eyes open in the dark</li>
                        <li><strong>Don't try to sleep:</strong> If you notice yourself trying to sleep, gently remind yourself to stay awake</li>
                        <li><strong>No stimulation:</strong> Stay calm and still - the goal is passive wakefulness, not active alertness</li>
                    </ol>
                </div>

                <h3>Important Guidelines</h3>
                <ul>
                    <li><strong>Passive, not active:</strong> Don't use caffeine, exercise, or stimulating activities. Just lie quietly.</li>
                    <li><strong>Gentle intention:</strong> It's a light instruction to yourself, not a forceful demand</li>
                    <li><strong>No clock-watching:</strong> Cover or remove clocks from the bedroom</li>
                    <li><strong>Trust the process:</strong> It may feel strange at first, but research shows it works</li>
                    <li><strong>Combine with stimulus control:</strong> If still awake after 30+ minutes, you may get up briefly</li>
                </ul>

                <h3>What to Expect</h3>
                <p><strong>Night 1-3:</strong> You might stay awake longer than usual as you adjust to the technique. This is normal.</p>
                <p><strong>Night 4-7:</strong> Most people begin noticing they fall asleep faster and with less effort.</p>
                <p><strong>Week 2+:</strong> The technique becomes more natural, and sleep anxiety decreases significantly.</p>

                <h3>The Science</h3>
                <p>Research published in <em>Behaviour Research and Therapy</em> and other journals shows paradoxical intention:</p>
                <ul>
                    <li>Reduces sleep onset latency (time to fall asleep)</li>
                    <li>Decreases subjective sleep effort</li>
                    <li>Reduces performance anxiety about sleep</li>
                    <li>Is as effective as other CBT-I components for some patients</li>
                </ul>

                <h3>When to Use This Technique</h3>
                <p>Paradoxical intention is most helpful if you:</p>
                <ul>
                    <li>Have significant anxiety about falling asleep</li>
                    <li>Find yourself "trying too hard" to sleep</li>
                    <li>Experience performance anxiety at bedtime</li>
                    <li>Have conditioned arousal response to the bed</li>
                </ul>
            `
        },
        'worry-management': {
            id: 'worry-management',
            title: 'Worry Time & Constructive Worry',
            description: 'Scheduled techniques to manage racing thoughts before bed',
            icon: 'thought',
            locked: true,
            duration: '15-20 min daily',
            difficulty: 'Beginner',
            indications: ['Racing thoughts at bedtime', 'Worry and rumination', 'Anxiety disorders', 'Work stress'],
            evidence: 'CBT protocols, clinical guidelines',
            content: `
                <h2>Worry Time & Constructive Worry</h2>
                <p>Racing thoughts at bedtime are one of the most common causes of insomnia. This module teaches you to manage worry proactively so it doesn't intrude on your sleep.</p>

                <h3>Why Worries Intensify at Night</h3>
                <ul>
                    <li><strong>No distractions:</strong> During the day, activities mask worry. At night, there's nothing to compete with your thoughts.</li>
                    <li><strong>Cognitive changes:</strong> The prefrontal cortex (rational thinking) is less active when tired, making worries seem bigger.</li>
                    <li><strong>Conditioned response:</strong> If you often worry in bed, the bed becomes a cue for worrying.</li>
                    <li><strong>Problem-solving urge:</strong> The brain wants to solve problems, but bedtime isn't the right time.</li>
                </ul>

                <h3>The Scheduled Worry Time Technique</h3>
                <p>Instead of worrying at bedtime, designate a specific time earlier in the day for worrying.</p>

                <div style="background: white; padding: 25px; border: 1px solid rgba(201, 169, 98, 0.3); margin: 20px 0;">
                    <h4 style="color: var(--navy); margin-bottom: 15px;">How to Implement</h4>
                    <ol style="line-height: 1.8;">
                        <li><strong>Choose a time:</strong> 15-20 minutes, at least 3 hours before bed (e.g., 6:00 PM)</li>
                        <li><strong>Choose a place:</strong> Not your bedroom - use a specific "worry chair" or desk</li>
                        <li><strong>Set a timer:</strong> Worry time has a definite start and end</li>
                        <li><strong>Write worries down:</strong> Get them out of your head and onto paper</li>
                        <li><strong>Categorize:</strong> Can you do something about this? When?</li>
                        <li><strong>Make action items:</strong> For solvable problems, write the next step</li>
                        <li><strong>Park the rest:</strong> For unsolvable worries, acknowledge them and plan to revisit tomorrow</li>
                        <li><strong>When time is up, stop:</strong> Tell yourself "worry time is over until tomorrow"</li>
                    </ol>
                </div>

                <h3>The Worry Notebook Technique</h3>
                <p>Keep a small notebook by your bed for nighttime worry capture:</p>
                <ol>
                    <li>When a worry arises at night, write it in the notebook (very briefly)</li>
                    <li>Tell yourself: "I've written it down, I'll address it during worry time tomorrow"</li>
                    <li>Close the notebook and return to a relaxation technique</li>
                    <li>During the next day's worry time, review and address what you wrote</li>
                </ol>

                <h3>Constructive Worry Template</h3>
                <p>Use this structure during your worry time:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="background: var(--navy); color: var(--cream);">
                        <th style="padding: 12px; text-align: left;">Column</th>
                        <th style="padding: 12px; text-align: left;">What to Write</th>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(201, 169, 98, 0.2);">
                        <td style="padding: 12px;">1. The Worry</td>
                        <td style="padding: 12px;">What exactly am I worried about?</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(201, 169, 98, 0.2);">
                        <td style="padding: 12px;">2. Solvable?</td>
                        <td style="padding: 12px;">Is this something I can actually influence?</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(201, 169, 98, 0.2);">
                        <td style="padding: 12px;">3. Next Step</td>
                        <td style="padding: 12px;">If yes: What's ONE small action I can take?</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px;">4. When</td>
                        <td style="padding: 12px;">When will I take this action? (Be specific)</td>
                    </tr>
                </table>

                <h3>The "Mental Shelf" Technique</h3>
                <p>For worries that arise at bedtime:</p>
                <ol>
                    <li>Visualize a shelf in another room (not your bedroom)</li>
                    <li>Mentally place each worry on the shelf, like putting away a book</li>
                    <li>Tell yourself: "It will be there tomorrow for worry time"</li>
                    <li>The shelf keeps your worries safe, but out of your bedroom</li>
                </ol>

                <h3>Common Challenges</h3>
                <p><strong>"I can't stop mid-worry"</strong></p>
                <p>This is normal at first. Gently redirect yourself: "Worry time is scheduled for tomorrow at 6 PM. I can pick this up then." With practice, it becomes easier.</p>

                <p><strong>"The worry feels too urgent"</strong></p>
                <p>Ask: "Can I actually do something about this RIGHT NOW?" Usually the answer is no. If yes, make a brief note and address it tomorrow.</p>

                <p><strong>"I forget to do worry time"</strong></p>
                <p>Set a daily alarm. Treat it like any other appointment. It's an investment in your sleep.</p>
            `
        },
        'circadian-rhythm': {
            id: 'circadian-rhythm',
            title: 'Circadian Rhythm Optimization',
            description: 'Align your internal clock for better sleep timing',
            icon: 'sun',
            locked: true,
            duration: '20 min read + lifestyle changes',
            difficulty: 'Intermediate',
            indications: ['Delayed sleep phase', 'Advanced sleep phase', 'Jet lag', 'Shift work', 'Irregular schedules'],
            evidence: 'Chronobiology research, light therapy RCTs',
            content: `
                <h2>Circadian Rhythm Optimization</h2>
                <p>Your circadian rhythm is your internal 24-hour clock that regulates sleep-wake cycles, hormone release, body temperature, and other biological functions. When properly aligned, you feel alert during the day and sleepy at night.</p>

                <h3>How the Circadian System Works</h3>
                <ul>
                    <li><strong>Master clock:</strong> Located in the suprachiasmatic nucleus (SCN) of the hypothalamus</li>
                    <li><strong>Light is the primary signal:</strong> The SCN receives light information directly from the eyes</li>
                    <li><strong>Melatonin rhythm:</strong> Darkness triggers melatonin release; light suppresses it</li>
                    <li><strong>Core body temperature:</strong> Drops in the evening to promote sleep, rises in the morning</li>
                </ul>

                <h3>Light Exposure Protocol</h3>
                <div style="background: white; padding: 25px; border: 1px solid rgba(201, 169, 98, 0.3); margin: 20px 0;">
                    <h4 style="color: var(--navy); margin-bottom: 15px;">Morning Light (Critical)</h4>
                    <ul>
                        <li>Get bright light within <strong>30-60 minutes</strong> of waking</li>
                        <li><strong>Duration:</strong> 10-30 minutes depending on intensity</li>
                        <li><strong>Best source:</strong> Natural sunlight (even cloudy days provide ~10,000 lux)</li>
                        <li><strong>Alternative:</strong> Light therapy box (10,000 lux, positioned at eye level)</li>
                        <li><strong>Effect:</strong> Stops melatonin, increases cortisol, sets circadian phase</li>
                    </ul>
                </div>

                <div style="background: white; padding: 25px; border: 1px solid rgba(201, 169, 98, 0.3); margin: 20px 0;">
                    <h4 style="color: var(--navy); margin-bottom: 15px;">Evening Light Restriction</h4>
                    <ul>
                        <li>Dim lights <strong>2-3 hours</strong> before bedtime</li>
                        <li>Avoid blue light from screens (use night mode, blue-blocking glasses)</li>
                        <li>Use warm-colored bulbs (2700K or lower) in evening</li>
                        <li>Total darkness in the bedroom during sleep</li>
                    </ul>
                </div>

                <h3>Temperature Manipulation</h3>
                <p>Core body temperature naturally drops at night. You can enhance this:</p>
                <ul>
                    <li><strong>Warm bath/shower 1-2 hours before bed:</strong> Causes subsequent cooling that promotes sleep</li>
                    <li><strong>Cool bedroom:</strong> 18-20°C (65-68°F) is optimal for most people</li>
                    <li><strong>Warm extremities:</strong> Wearing socks can help - warm hands/feet promote core cooling</li>
                    <li><strong>Avoid exercise close to bed:</strong> Raises core temperature for several hours</li>
                </ul>

                <h3>Meal Timing</h3>
                <p>When you eat affects your circadian rhythm:</p>
                <ul>
                    <li><strong>Eat breakfast within 1-2 hours of waking:</strong> Signals daytime to peripheral clocks</li>
                    <li><strong>Largest meals earlier in the day:</strong> Lunch > Dinner</li>
                    <li><strong>Avoid heavy meals within 3 hours of bed:</strong> Digestion raises body temperature and can disrupt sleep</li>
                    <li><strong>Consistent meal times:</strong> Regular schedule reinforces circadian rhythm</li>
                </ul>

                <h3>For Night Owls: Phase Advance Protocol</h3>
                <p>If you naturally fall asleep late and wake late, gradually shift earlier:</p>
                <ol>
                    <li><strong>Week 1:</strong> Wake 30 minutes earlier + immediate bright light</li>
                    <li><strong>Week 2:</strong> Wake 30 more minutes earlier</li>
                    <li><strong>Continue:</strong> Until reaching target wake time</li>
                    <li><strong>Maintain:</strong> Keep consistent schedule, especially on weekends</li>
                </ol>
                <p>Do not try to shift more than 30 minutes per week - it takes time for the clock to adjust.</p>

                <h3>For Early Birds: Phase Delay Protocol</h3>
                <p>If you fall asleep too early and wake too early:</p>
                <ol>
                    <li>Get bright light in the <strong>late afternoon/early evening</strong></li>
                    <li>Avoid morning bright light until closer to target wake time</li>
                    <li>Stay awake 15-30 minutes later each night</li>
                    <li>Exercise in the late afternoon (raises temperature)</li>
                </ol>

                <h3>Jet Lag & Shift Work</h3>
                <p><strong>Eastward travel (harder):</strong> Advance your clock gradually before departure. Use morning light at destination.</p>
                <p><strong>Westward travel:</strong> Delay your clock. Stay awake until local bedtime. Use evening light.</p>
                <p><strong>Shift work:</strong> Try to keep one consistent schedule. Use bright light during your "day" (even if it's night). Dark sunglasses on commute home. Blackout bedroom completely.</p>

                <h3>Social Jetlag</h3>
                <p>Different sleep times on weekdays vs. weekends creates "social jetlag":</p>
                <ul>
                    <li>Try to keep wake time within 1 hour across all days</li>
                    <li>If you must sleep in on weekends, do so only slightly</li>
                    <li>Get bright light at your regular wake time even on weekends</li>
                </ul>
            `
        },
        'jet-lag-calculator': {
            id: 'jet-lag-calculator',
            title: 'Jet Lag Calculator',
            description: 'Calculate optimal light, caffeine, and melatonin timing for travel',
            icon: 'plane',
            locked: true,
            duration: '5 min + personalized plan',
            difficulty: 'Intermediate',
            indications: ['Frequent travelers', 'Long-haul flights', 'Business travel', 'Athletes traveling for competition'],
            evidence: 'Chronobiology research, circadian rhythm science',
            content: `
                <h2>Jet Lag Calculator</h2>
                <p>Jet lag occurs when your internal body clock is out of sync with the local time at your destination. Use this calculator to get personalized recommendations for light exposure, caffeine timing, and melatonin use to minimize jet lag symptoms.</p>

                <div style="background: linear-gradient(135deg, rgba(201, 169, 98, 0.1), rgba(15, 28, 46, 0.05)); padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid var(--gold);">
                    <p style="margin: 0; font-size: 14px; color: var(--text-light);"><strong>Disclaimer:</strong> This calculator provides general guidance based on circadian rhythm science. Always consult with your sleep consultant for personalized advice tailored to your specific health conditions and travel needs.</p>
                </div>

                <h3>Your Travel Details</h3>
                <div class="jetlag-calculator" style="background: white; padding: 25px; border: 1px solid rgba(201, 169, 98, 0.3); border-radius: 8px; margin: 20px 0;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                        <div class="calc-field">
                            <label style="display: block; font-weight: 500; color: var(--navy); margin-bottom: 8px;">Your Home Timezone</label>
                            <select id="jlHomeTimezone" style="width: 100%; padding: 12px; border: 1px solid rgba(201, 169, 98, 0.3); border-radius: 6px; font-size: 14px;">
                                <option value="-12">UTC-12 (Baker Island)</option>
                                <option value="-11">UTC-11 (Samoa)</option>
                                <option value="-10">UTC-10 (Hawaii)</option>
                                <option value="-9">UTC-9 (Alaska)</option>
                                <option value="-8">UTC-8 (Los Angeles, Vancouver)</option>
                                <option value="-7">UTC-7 (Denver, Phoenix)</option>
                                <option value="-6">UTC-6 (Chicago, Mexico City)</option>
                                <option value="-5" selected>UTC-5 (New York, Boston)</option>
                                <option value="-4">UTC-4 (Halifax, Santiago)</option>
                                <option value="-3">UTC-3 (São Paulo, Buenos Aires)</option>
                                <option value="-2">UTC-2 (Mid-Atlantic)</option>
                                <option value="-1">UTC-1 (Azores)</option>
                                <option value="0">UTC+0 (London, Dublin)</option>
                                <option value="1">UTC+1 (Paris, Berlin, Rome)</option>
                                <option value="2">UTC+2 (Cairo, Athens, Jerusalem)</option>
                                <option value="3">UTC+3 (Moscow, Istanbul)</option>
                                <option value="4">UTC+4 (Dubai)</option>
                                <option value="5">UTC+5 (Karachi)</option>
                                <option value="5.5">UTC+5:30 (Mumbai, Delhi)</option>
                                <option value="6">UTC+6 (Dhaka)</option>
                                <option value="7">UTC+7 (Bangkok, Jakarta)</option>
                                <option value="8">UTC+8 (Singapore, Hong Kong, Beijing)</option>
                                <option value="9">UTC+9 (Tokyo, Seoul)</option>
                                <option value="9.5">UTC+9:30 (Adelaide)</option>
                                <option value="10">UTC+10 (Sydney, Melbourne)</option>
                                <option value="11">UTC+11 (Solomon Islands)</option>
                                <option value="12">UTC+12 (Auckland, Fiji)</option>
                            </select>
                        </div>
                        <div class="calc-field">
                            <label style="display: block; font-weight: 500; color: var(--navy); margin-bottom: 8px;">Destination Timezone</label>
                            <select id="jlDestTimezone" style="width: 100%; padding: 12px; border: 1px solid rgba(201, 169, 98, 0.3); border-radius: 6px; font-size: 14px;">
                                <option value="-12">UTC-12 (Baker Island)</option>
                                <option value="-11">UTC-11 (Samoa)</option>
                                <option value="-10">UTC-10 (Hawaii)</option>
                                <option value="-9">UTC-9 (Alaska)</option>
                                <option value="-8">UTC-8 (Los Angeles, Vancouver)</option>
                                <option value="-7">UTC-7 (Denver, Phoenix)</option>
                                <option value="-6">UTC-6 (Chicago, Mexico City)</option>
                                <option value="-5">UTC-5 (New York, Boston)</option>
                                <option value="-4">UTC-4 (Halifax, Santiago)</option>
                                <option value="-3">UTC-3 (São Paulo, Buenos Aires)</option>
                                <option value="-2">UTC-2 (Mid-Atlantic)</option>
                                <option value="-1">UTC-1 (Azores)</option>
                                <option value="0">UTC+0 (London, Dublin)</option>
                                <option value="1" selected>UTC+1 (Paris, Berlin, Rome)</option>
                                <option value="2">UTC+2 (Cairo, Athens, Jerusalem)</option>
                                <option value="3">UTC+3 (Moscow, Istanbul)</option>
                                <option value="4">UTC+4 (Dubai)</option>
                                <option value="5">UTC+5 (Karachi)</option>
                                <option value="5.5">UTC+5:30 (Mumbai, Delhi)</option>
                                <option value="6">UTC+6 (Dhaka)</option>
                                <option value="7">UTC+7 (Bangkok, Jakarta)</option>
                                <option value="8">UTC+8 (Singapore, Hong Kong, Beijing)</option>
                                <option value="9">UTC+9 (Tokyo, Seoul)</option>
                                <option value="9.5">UTC+9:30 (Adelaide)</option>
                                <option value="10">UTC+10 (Sydney, Melbourne)</option>
                                <option value="11">UTC+11 (Solomon Islands)</option>
                                <option value="12">UTC+12 (Auckland, Fiji)</option>
                            </select>
                        </div>
                        <div class="calc-field">
                            <label style="display: block; font-weight: 500; color: var(--navy); margin-bottom: 8px;">Departure Date</label>
                            <input type="date" id="jlDepartureDate" style="width: 100%; padding: 12px; border: 1px solid rgba(201, 169, 98, 0.3); border-radius: 6px; font-size: 14px;">
                        </div>
                        <div class="calc-field">
                            <label style="display: block; font-weight: 500; color: var(--navy); margin-bottom: 8px;">Arrival Time (local)</label>
                            <input type="time" id="jlArrivalTime" value="08:00" style="width: 100%; padding: 12px; border: 1px solid rgba(201, 169, 98, 0.3); border-radius: 6px; font-size: 14px;">
                        </div>
                        <div class="calc-field">
                            <label style="display: block; font-weight: 500; color: var(--navy); margin-bottom: 8px;">Duration of Stay</label>
                            <select id="jlStayDuration" style="width: 100%; padding: 12px; border: 1px solid rgba(201, 169, 98, 0.3); border-radius: 6px; font-size: 14px;">
                                <option value="1">1 day</option>
                                <option value="2">2 days</option>
                                <option value="3">3 days</option>
                                <option value="4">4 days</option>
                                <option value="5">5 days</option>
                                <option value="7" selected>1 week</option>
                                <option value="14">2 weeks</option>
                                <option value="30">1 month or more</option>
                            </select>
                        </div>
                        <div class="calc-field">
                            <label style="display: block; font-weight: 500; color: var(--navy); margin-bottom: 8px;">Your Usual Wake Time</label>
                            <input type="time" id="jlUsualWake" value="07:00" style="width: 100%; padding: 12px; border: 1px solid rgba(201, 169, 98, 0.3); border-radius: 6px; font-size: 14px;">
                        </div>
                    </div>
                    <button class="btn-primary" onclick="Content.calculateJetLag()" style="margin-top: 25px; width: 100%; padding: 14px;">
                        Calculate My Jet Lag Plan
                    </button>
                </div>

                <div id="jetlagResults" style="display: none;">
                    <h3>Your Personalized Jet Lag Plan</h3>

                    <div id="jetlagSummary" style="background: linear-gradient(135deg, var(--navy), #1a2d47); color: var(--cream); padding: 25px; border-radius: 8px; margin: 20px 0;">
                        <!-- Summary will be populated by JS -->
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 20px 0;">
                        <div style="background: white; padding: 25px; border: 1px solid rgba(201, 169, 98, 0.3); border-radius: 8px;">
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #FDB813, #F7931E); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                        <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                                    </svg>
                                </div>
                                <h4 style="margin: 0; color: var(--navy);">Light Exposure</h4>
                            </div>
                            <div id="lightRecommendation">
                                <!-- Will be populated by JS -->
                            </div>
                        </div>

                        <div style="background: white; padding: 25px; border: 1px solid rgba(201, 169, 98, 0.3); border-radius: 8px;">
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #6F4E37, #8B4513); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
                                    </svg>
                                </div>
                                <h4 style="margin: 0; color: var(--navy);">Caffeine Timing</h4>
                            </div>
                            <div id="caffeineRecommendation">
                                <!-- Will be populated by JS -->
                            </div>
                        </div>

                        <div style="background: white; padding: 25px; border: 1px solid rgba(201, 169, 98, 0.3); border-radius: 8px;">
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #4A148C, #6A1B9A); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                    </svg>
                                </div>
                                <h4 style="margin: 0; color: var(--navy);">Melatonin Timing</h4>
                            </div>
                            <div id="melatoninRecommendation">
                                <!-- Will be populated by JS -->
                            </div>
                        </div>

                        <div style="background: white; padding: 25px; border: 1px solid rgba(201, 169, 98, 0.3); border-radius: 8px;">
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, var(--navy), #2c4a6b); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                </div>
                                <h4 style="margin: 0; color: var(--navy);">Sleep Schedule</h4>
                            </div>
                            <div id="sleepRecommendation">
                                <!-- Will be populated by JS -->
                            </div>
                        </div>
                    </div>

                    <div id="dayByDayPlan" style="background: white; padding: 25px; border: 1px solid rgba(201, 169, 98, 0.3); border-radius: 8px; margin: 20px 0;">
                        <h4 style="color: var(--navy); margin-top: 0;">Day-by-Day Adaptation Plan</h4>
                        <div id="dayByDayContent">
                            <!-- Will be populated by JS -->
                        </div>
                    </div>

                    <div style="background: linear-gradient(135deg, rgba(201, 169, 98, 0.1), rgba(15, 28, 46, 0.05)); padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h4 style="color: var(--navy); margin-top: 0;">Additional Tips</h4>
                        <ul style="margin: 0; padding-left: 20px; color: var(--text);">
                            <li><strong>Hydration:</strong> Drink plenty of water before, during, and after your flight. Avoid excessive alcohol.</li>
                            <li><strong>In-flight:</strong> Set your watch to the destination time when you board. Try to sleep or stay awake according to your destination schedule.</li>
                            <li><strong>Meals:</strong> Eat meals at destination mealtimes to help reset your body clock.</li>
                            <li><strong>Exercise:</strong> Light exercise during the day can help adaptation, but avoid intense exercise close to bedtime.</li>
                            <li><strong>Short trips:</strong> If staying less than 3 days, consider staying on home time rather than adapting.</li>
                        </ul>
                    </div>
                </div>

                <h3>The Science of Jet Lag</h3>
                <p>Your body's master clock (located in the brain's suprachiasmatic nucleus) regulates a ~24-hour cycle of sleep, alertness, hormone release, and body temperature. When you travel across time zones, this internal clock becomes misaligned with local time.</p>

                <h4>Key Circadian Principles</h4>
                <ul>
                    <li><strong>Light is the primary signal:</strong> Bright light in the morning advances your clock (helps with eastward travel); evening light delays it (helps with westward travel)</li>
                    <li><strong>Core Body Temperature Minimum (CBTmin):</strong> Occurs about 2 hours before natural wake time. Light before CBTmin delays your clock; light after advances it.</li>
                    <li><strong>Adaptation rate:</strong> The body can shift approximately 1-1.5 hours per day with optimal light exposure</li>
                    <li><strong>Direction matters:</strong> Westward travel (delaying) is generally easier than eastward travel (advancing)</li>
                </ul>

                <h4>Why Melatonin Helps</h4>
                <p>Melatonin is your body's "darkness signal." Taking low-dose melatonin (0.5-3mg) at the right time can help shift your circadian rhythm:</p>
                <ul>
                    <li><strong>Eastward travel:</strong> Take melatonin in the early evening at destination</li>
                    <li><strong>Westward travel:</strong> Take melatonin in the early morning if waking too early</li>
                    <li><strong>Timing is crucial:</strong> Wrong timing can make jet lag worse</li>
                </ul>
            `
        },
        'guided-imagery': {
            id: 'guided-imagery',
            title: 'Guided Imagery for Sleep',
            description: 'Mental visualization techniques to promote relaxation',
            icon: 'image',
            locked: true,
            duration: '10-15 min practice',
            difficulty: 'Beginner',
            indications: ['Active imagination', 'Difficulty quieting mind', 'Stress relief', 'Visualization-responsive clients'],
            evidence: 'Relaxation response research',
            content: `
                <h2>Guided Imagery for Sleep</h2>
                <p>Guided imagery uses the power of visualization to create calm mental images that promote relaxation and sleep. It works by engaging your imagination to shift focus away from stressful thoughts.</p>

                <h3>Why Imagery Works</h3>
                <ul>
                    <li><strong>Engages the mind:</strong> Gives racing thoughts something peaceful to focus on</li>
                    <li><strong>Activates relaxation:</strong> Imagining calm scenes triggers real physiological relaxation</li>
                    <li><strong>Sensory engagement:</strong> Multi-sensory imagery is more absorbing than thinking</li>
                    <li><strong>Brain doesn't fully distinguish:</strong> Imagined experiences activate similar brain regions as real ones</li>
                </ul>

                <h3>The Peaceful Place Technique</h3>
                <p>Create a detailed mental sanctuary you can visit each night:</p>
                <ol>
                    <li><strong>Choose your place:</strong> Beach, forest, mountain meadow, cozy cabin - somewhere you feel completely safe</li>
                    <li><strong>Build it in detail:</strong> Spend time when not trying to sleep to construct every detail</li>
                    <li><strong>Engage all senses:</strong>
                        <ul>
                            <li>What do you see? Colors, light, shadows, movement</li>
                            <li>What do you hear? Waves, birds, wind, silence</li>
                            <li>What do you feel? Temperature, textures, breeze</li>
                            <li>What do you smell? Ocean, pine, flowers</li>
                        </ul>
                    </li>
                    <li><strong>Make it consistent:</strong> Return to the same place each night - familiarity deepens relaxation</li>
                </ol>

                <h3>Sample Imagery Scripts</h3>

                <div style="background: white; padding: 25px; border-left: 4px solid var(--gold); margin: 15px 0;">
                    <h4 style="color: var(--navy); margin-bottom: 10px;">The Beach at Sunset</h4>
                    <p style="font-style: italic; line-height: 1.8;">
                        You're walking on a quiet beach as the sun sets. The sand is warm beneath your feet, soft and yielding with each step. The sky is painted in oranges and pinks, reflecting on the gentle waves. You hear the rhythmic sound of waves rolling in and out... in and out... like slow, peaceful breathing. A warm breeze carries the salt air across your skin. You find a comfortable spot in the soft sand and sit down, watching the colors slowly deepen as the sun sinks lower. Each wave that washes up seems to carry away a little more tension. The water reaches your toes, warm and gentle, then retreats. You feel completely at peace...
                    </p>
                </div>

                <div style="background: white; padding: 25px; border-left: 4px solid var(--gold); margin: 15px 0;">
                    <h4 style="color: var(--navy); margin-bottom: 10px;">The Forest Path</h4>
                    <p style="font-style: italic; line-height: 1.8;">
                        You're walking along a soft forest path. Tall trees arch overhead, their leaves filtering the light into gentle green dapples. The air is cool and fresh, carrying the scent of pine and earth. Your footsteps are cushioned by a carpet of fallen leaves and soft moss. Birds sing quietly in the distance. A small stream runs alongside the path, its water clear and babbling softly over smooth stones. You come to a small clearing where a ray of golden sunlight warms a patch of soft grass. You lie down in this perfect spot, looking up through the branches at the blue sky above. The forest sounds continue their peaceful song...
                    </p>
                </div>

                <h3>The Descending Staircase</h3>
                <p>A classic technique for deepening relaxation:</p>
                <ol>
                    <li>Imagine yourself at the top of a beautiful staircase with 10 steps</li>
                    <li>With each step down, you become more relaxed</li>
                    <li>Count backwards: "10... going deeper... 9... more relaxed... 8..."</li>
                    <li>Describe each step: the feel of the handrail, the soft carpet</li>
                    <li>At the bottom, you find your peaceful place waiting</li>
                </ol>

                <h3>The Floating Technique</h3>
                <ol>
                    <li>Imagine lying on something that floats: a cloud, a raft on calm water, a hammock</li>
                    <li>Feel yourself supported completely - no need to hold any tension</li>
                    <li>Feel gentle rocking or swaying motion</li>
                    <li>With each sway, you sink deeper into relaxation</li>
                    <li>The floating support carries all your weight and worries</li>
                </ol>

                <h3>Tips for Effective Imagery</h3>
                <ul>
                    <li><strong>Practice during the day first:</strong> Build your imagery skills when you're not trying to sleep</li>
                    <li><strong>Be patient:</strong> Visualization is a skill that improves with practice</li>
                    <li><strong>Use your own images:</strong> Generic scripts are starting points - personalize them</li>
                    <li><strong>Don't force it:</strong> If an image isn't working, gently shift to another</li>
                    <li><strong>Combine with breathing:</strong> Sync imagery with slow breathing for deeper effect</li>
                    <li><strong>It's okay to drift:</strong> If imagery transitions into dreams, that's success</li>
                </ul>
            `
        },
        'autogenic-training': {
            id: 'autogenic-training',
            title: 'Autogenic Training',
            description: 'Self-suggestion technique for deep physical relaxation',
            icon: 'heart',
            locked: true,
            duration: '10-15 min practice',
            difficulty: 'Intermediate',
            indications: ['Chronic tension', 'Autonomic dysregulation', 'Anxiety', 'Clients who respond to self-suggestion'],
            evidence: 'Meta-analyses, 90+ years research',
            content: `
                <h2>Autogenic Training</h2>
                <p>Autogenic training is a relaxation technique developed by German psychiatrist Johannes Schultz in the 1930s. It uses self-suggestions of heaviness and warmth to induce a state of deep relaxation. Research shows it effectively reduces anxiety and improves sleep.</p>

                <h3>How Autogenic Training Works</h3>
                <ul>
                    <li><strong>Self-suggestion:</strong> You repeat phrases that describe physical sensations</li>
                    <li><strong>Passive concentration:</strong> You observe rather than force the sensations</li>
                    <li><strong>Physiological shift:</strong> The body responds to the suggestions with real relaxation</li>
                    <li><strong>Autonomic regulation:</strong> Shifts from sympathetic (stress) to parasympathetic (rest)</li>
                </ul>

                <h3>The Six Standard Exercises</h3>
                <p>Each exercise focuses on a different physical sensation. Master each before moving to the next.</p>

                <div style="background: white; padding: 25px; border: 1px solid rgba(201, 169, 98, 0.3); margin: 20px 0;">
                    <h4 style="color: var(--navy);">Exercise 1: Heaviness</h4>
                    <p>Repeat 6 times, moving through body parts:</p>
                    <ul>
                        <li>"My right arm is heavy."</li>
                        <li>"My left arm is heavy."</li>
                        <li>"Both arms are heavy."</li>
                        <li>"My right leg is heavy."</li>
                        <li>"My left leg is heavy."</li>
                        <li>"My arms and legs are heavy."</li>
                    </ul>
                    <p>Practice for 1-2 weeks before adding Exercise 2.</p>
                </div>

                <div style="background: white; padding: 25px; border: 1px solid rgba(201, 169, 98, 0.3); margin: 20px 0;">
                    <h4 style="color: var(--navy);">Exercise 2: Warmth</h4>
                    <p>After heaviness is established:</p>
                    <ul>
                        <li>"My right arm is warm."</li>
                        <li>"My left arm is warm."</li>
                        <li>"Both arms are warm."</li>
                        <li>"My right leg is warm."</li>
                        <li>"My left leg is warm."</li>
                        <li>"My arms and legs are warm and heavy."</li>
                    </ul>
                </div>

                <div style="background: white; padding: 25px; border: 1px solid rgba(201, 169, 98, 0.3); margin: 20px 0;">
                    <h4 style="color: var(--navy);">Exercise 3: Calm Heart</h4>
                    <p>"My heartbeat is calm and regular."</p>
                    <p>Don't try to change your heart rate - just observe it with acceptance.</p>
                </div>

                <div style="background: white; padding: 25px; border: 1px solid rgba(201, 169, 98, 0.3); margin: 20px 0;">
                    <h4 style="color: var(--navy);">Exercise 4: Breathing</h4>
                    <p>"My breathing is calm and relaxed."</p>
                    <p>Or: "It breathes me." (passive, effortless)</p>
                </div>

                <div style="background: white; padding: 25px; border: 1px solid rgba(201, 169, 98, 0.3); margin: 20px 0;">
                    <h4 style="color: var(--navy);">Exercise 5: Abdominal Warmth</h4>
                    <p>"My solar plexus is warm."</p>
                    <p>Focus on the area just below the sternum.</p>
                </div>

                <div style="background: white; padding: 25px; border: 1px solid rgba(201, 169, 98, 0.3); margin: 20px 0;">
                    <h4 style="color: var(--navy);">Exercise 6: Cool Forehead</h4>
                    <p>"My forehead is pleasantly cool."</p>
                    <p>This helps reduce mental activity and induces calm.</p>
                </div>

                <h3>Complete Session Structure</h3>
                <ol>
                    <li><strong>Position:</strong> Lie on your back or sit in a comfortable chair</li>
                    <li><strong>Close eyes</strong> and take a few deep breaths</li>
                    <li><strong>Begin with:</strong> "I am completely calm."</li>
                    <li><strong>Move through</strong> each exercise you've learned</li>
                    <li><strong>Repeat each phrase</strong> slowly 3-6 times</li>
                    <li><strong>Passive attention:</strong> Don't force sensations - observe what comes</li>
                    <li><strong>End with:</strong> "I am calm and refreshed."</li>
                    <li><strong>If going to sleep:</strong> Simply let the relaxation deepen into sleep</li>
                    <li><strong>If waking up:</strong> Flex fingers and toes, stretch, open eyes</li>
                </ol>

                <h3>Quick Sleep Version</h3>
                <p>Once you've mastered the full technique (after several weeks of practice):</p>
                <ol>
                    <li>"My arms and legs are heavy and warm."</li>
                    <li>"My heartbeat is calm."</li>
                    <li>"My breathing is slow and easy."</li>
                    <li>"My whole body is relaxed and comfortable."</li>
                    <li>"I am peaceful and sleepy."</li>
                </ol>

                <h3>Tips for Success</h3>
                <ul>
                    <li><strong>Learn systematically:</strong> Spend 1-2 weeks on each exercise before adding the next</li>
                    <li><strong>Practice regularly:</strong> 2-3 times daily for 5-10 minutes builds the skill</li>
                    <li><strong>Passive concentration:</strong> Don't try too hard - let sensations come naturally</li>
                    <li><strong>Consistent phrases:</strong> Use the same wording each time for conditioning</li>
                    <li><strong>Patience:</strong> Full proficiency takes 2-3 months of regular practice</li>
                </ul>

                <h3>The Science</h3>
                <p>Research shows autogenic training:</p>
                <ul>
                    <li>Reduces cortisol and stress hormones</li>
                    <li>Decreases heart rate and blood pressure</li>
                    <li>Improves sleep onset latency and sleep quality</li>
                    <li>Reduces anxiety symptoms comparable to some medications</li>
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
            'journal': '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
            'meditation': '<circle cx="12" cy="6" r="3"/><path d="M12 9v4"/><path d="M8 21c0-3 2-5 4-6 2 1 4 3 4 6"/><path d="M6 15c-1.5 1-2 3-2 6h4"/><path d="M18 15c1.5 1 2 3 2 6h-4"/>',
            'reverse': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
            'thought': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="9" cy="10" r="1"/><circle cx="12" cy="10" r="1"/><circle cx="15" cy="10" r="1"/>',
            'sun': '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
            'image': '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
            'heart': '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
            'plane': '<path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>'
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
    },

    /**
     * Calculate jet lag recommendations
     */
    calculateJetLag() {
        const homeTimezone = parseFloat(document.getElementById('jlHomeTimezone').value);
        const destTimezone = parseFloat(document.getElementById('jlDestTimezone').value);
        const stayDuration = parseInt(document.getElementById('jlStayDuration').value);
        const usualWake = document.getElementById('jlUsualWake').value;
        const arrivalTime = document.getElementById('jlArrivalTime').value;

        // Calculate timezone difference
        let timezoneDiff = destTimezone - homeTimezone;

        // Handle crossing the date line (use shortest path)
        if (timezoneDiff > 12) timezoneDiff -= 24;
        if (timezoneDiff < -12) timezoneDiff += 24;

        const absTimezoneDiff = Math.abs(timezoneDiff);
        const direction = timezoneDiff > 0 ? 'east' : 'west';
        const daysToAdapt = Math.ceil(absTimezoneDiff / 1.5); // ~1-1.5 hours adaptation per day

        // Parse usual wake time
        const [wakeH, wakeM] = usualWake.split(':').map(Number);
        const usualWakeMinutes = wakeH * 60 + wakeM;

        // Calculate CBTmin (Core Body Temperature minimum - ~2 hours before usual wake)
        const cbtMinMinutes = (usualWakeMinutes - 120 + 1440) % 1440;

        // Format time helper
        const formatTime = (minutes) => {
            const h = Math.floor(((minutes % 1440) + 1440) % 1440 / 60);
            const m = Math.round(((minutes % 1440) + 1440) % 1440 % 60);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const h12 = h % 12 || 12;
            return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
        };

        // Generate recommendations
        let lightRecommendation, caffeineRecommendation, melatoninRecommendation, sleepRecommendation;
        let dayByDayPlan = [];

        if (stayDuration <= 2 && absTimezoneDiff <= 6) {
            // Short trip - stay on home time
            lightRecommendation = `
                <p style="color: var(--text); line-height: 1.7;">For a short trip of ${stayDuration} day(s), consider <strong>staying on home time</strong> rather than adapting.</p>
                <p style="color: var(--text-light); font-size: 14px; margin-top: 10px;">Schedule meetings during your home daytime hours when possible.</p>
            `;
            caffeineRecommendation = `
                <p style="color: var(--text); line-height: 1.7;">Use caffeine strategically to stay alert during your home's daytime hours.</p>
                <p style="color: var(--text-light); font-size: 14px; margin-top: 10px;">Avoid caffeine during your home's evening/night hours.</p>
            `;
            melatoninRecommendation = `
                <p style="color: var(--text); line-height: 1.7;">Consider melatonin at your usual home bedtime to maintain your home schedule.</p>
            `;
            sleepRecommendation = `
                <p style="color: var(--text); line-height: 1.7;">Try to sleep during your home nighttime hours, even if it's daytime at destination.</p>
            `;
        } else if (direction === 'east') {
            // Eastward travel - need to advance clock
            const seekLightStart = formatTime(cbtMinMinutes + 120); // After CBTmin
            const seekLightEnd = formatTime(cbtMinMinutes + 360); // 4 hours after wake
            const avoidLightStart = formatTime(cbtMinMinutes - 180);
            const avoidLightEnd = formatTime(cbtMinMinutes + 60);
            const melatoninTime = formatTime(usualWakeMinutes + 12 * 60 - timezoneDiff * 60); // Early evening destination time
            const caffeineCutoff = formatTime(usualWakeMinutes + 8 * 60 - timezoneDiff * 60);

            lightRecommendation = `
                <p style="color: var(--text); line-height: 1.7;"><strong>Seek bright light:</strong> ${seekLightStart} - ${seekLightEnd} (destination time)</p>
                <p style="color: var(--text); line-height: 1.7; margin-top: 8px;"><strong>Avoid bright light:</strong> Before ${avoidLightEnd} (destination time) for the first few days</p>
                <p style="color: var(--text-light); font-size: 14px; margin-top: 10px;">Morning light advances your clock. Use sunlight, a light box (10,000 lux), or go outside.</p>
            `;
            caffeineRecommendation = `
                <p style="color: var(--text); line-height: 1.7;"><strong>OK to consume:</strong> Morning and early afternoon (destination time)</p>
                <p style="color: var(--text); line-height: 1.7; margin-top: 8px;"><strong>Cutoff:</strong> No caffeine after ~${caffeineCutoff} (destination time)</p>
                <p style="color: var(--text-light); font-size: 14px; margin-top: 10px;">Caffeine can help alertness but will impair sleep if taken too late.</p>
            `;
            melatoninRecommendation = `
                <p style="color: var(--text); line-height: 1.7;"><strong>Take 0.5-3mg melatonin</strong> in the early evening at destination (~${melatoninTime})</p>
                <p style="color: var(--text-light); font-size: 14px; margin-top: 10px;">Melatonin in the evening helps advance your body clock for eastward travel.</p>
            `;
            sleepRecommendation = `
                <p style="color: var(--text); line-height: 1.7;"><strong>Target bedtime:</strong> Local evening (~10-11 PM destination time)</p>
                <p style="color: var(--text); line-height: 1.7; margin-top: 8px;"><strong>Target wake time:</strong> Local morning (~${formatTime(usualWakeMinutes)})</p>
                <p style="color: var(--text-light); font-size: 14px; margin-top: 10px;">Even if you can't sleep, stay in bed and rest. Your clock will adjust over ${daysToAdapt} days.</p>
            `;

            // Generate day-by-day plan for eastward
            for (let day = 1; day <= Math.min(daysToAdapt, 5); day++) {
                const shiftSoFar = Math.min(day * 1.5, absTimezoneDiff);
                const adjustedWake = usualWakeMinutes - shiftSoFar * 60 + timezoneDiff * 60;
                dayByDayPlan.push({
                    day: day,
                    light: `Seek bright light ${formatTime(adjustedWake)} - ${formatTime(adjustedWake + 240)}`,
                    sleep: `Try to sleep by ${formatTime(adjustedWake + 15 * 60)}`,
                    notes: day === 1 ? 'First day may be tough - stay awake until local evening' :
                           day === daysToAdapt ? 'Should be mostly adapted by now' : 'Gradual improvement expected'
                });
            }
        } else {
            // Westward travel - need to delay clock
            const seekLightStart = formatTime(usualWakeMinutes + 10 * 60 + Math.abs(timezoneDiff) * 60);
            const seekLightEnd = formatTime(usualWakeMinutes + 14 * 60 + Math.abs(timezoneDiff) * 60);
            const avoidLightStart = formatTime(cbtMinMinutes + Math.abs(timezoneDiff) * 60 - 60);
            const caffeineCutoff = formatTime(usualWakeMinutes + 10 * 60 + Math.abs(timezoneDiff) * 60);

            lightRecommendation = `
                <p style="color: var(--text); line-height: 1.7;"><strong>Seek bright light:</strong> Late afternoon/evening (destination time)</p>
                <p style="color: var(--text); line-height: 1.7; margin-top: 8px;"><strong>Avoid bright light:</strong> Early morning (destination time) for the first few days</p>
                <p style="color: var(--text-light); font-size: 14px; margin-top: 10px;">Evening light delays your clock. Get outside in late afternoon or use bright indoor lighting.</p>
            `;
            caffeineRecommendation = `
                <p style="color: var(--text); line-height: 1.7;"><strong>Can use:</strong> Afternoon caffeine may help you stay awake until local bedtime</p>
                <p style="color: var(--text); line-height: 1.7; margin-top: 8px;"><strong>Cutoff:</strong> No caffeine after ~${caffeineCutoff} (destination time)</p>
                <p style="color: var(--text-light); font-size: 14px; margin-top: 10px;">Use caffeine to push through early evening fatigue on arrival day.</p>
            `;
            melatoninRecommendation = `
                <p style="color: var(--text); line-height: 1.7;"><strong>Usually not needed</strong> for westward travel</p>
                <p style="color: var(--text); line-height: 1.7; margin-top: 8px;">If waking too early, consider 0.5mg melatonin in the early morning</p>
                <p style="color: var(--text-light); font-size: 14px; margin-top: 10px;">Westward adaptation is typically easier than eastward.</p>
            `;
            sleepRecommendation = `
                <p style="color: var(--text); line-height: 1.7;"><strong>Stay awake</strong> until local bedtime on arrival day</p>
                <p style="color: var(--text); line-height: 1.7; margin-top: 8px;"><strong>Target bedtime:</strong> ~10-11 PM destination time</p>
                <p style="color: var(--text-light); font-size: 14px; margin-top: 10px;">Short naps (20-30 min) are OK if very fatigued, but avoid long naps.</p>
            `;

            // Generate day-by-day plan for westward
            for (let day = 1; day <= Math.min(daysToAdapt, 5); day++) {
                const shiftSoFar = Math.min(day * 1.5, absTimezoneDiff);
                dayByDayPlan.push({
                    day: day,
                    light: `Seek light in late afternoon/evening. Avoid early morning light.`,
                    sleep: `Stay awake until 10-11 PM local time`,
                    notes: day === 1 ? 'Avoid napping - push through to local bedtime' :
                           day === daysToAdapt ? 'Should be mostly adapted by now' : 'Getting easier each day'
                });
            }
        }

        // Update the summary section
        document.getElementById('jetlagSummary').innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                <div style="width: 50px; height: 50px; background: rgba(201, 169, 98, 0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2">
                        <path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                </div>
                <div>
                    <h3 style="margin: 0; color: var(--cream);">Traveling ${direction === 'east' ? 'Eastward' : 'Westward'}</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.8;">${absTimezoneDiff} hour${absTimezoneDiff !== 1 ? 's' : ''} ${direction === 'east' ? 'ahead' : 'behind'}</p>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-top: 20px;">
                <div style="text-align: center;">
                    <p style="font-size: 28px; font-weight: 600; color: var(--gold); margin: 0;">${daysToAdapt}</p>
                    <p style="font-size: 13px; opacity: 0.8; margin: 5px 0 0 0;">days to adapt</p>
                </div>
                <div style="text-align: center;">
                    <p style="font-size: 28px; font-weight: 600; color: var(--gold); margin: 0;">${stayDuration}</p>
                    <p style="font-size: 13px; opacity: 0.8; margin: 5px 0 0 0;">day${stayDuration !== 1 ? 's' : ''} staying</p>
                </div>
                <div style="text-align: center;">
                    <p style="font-size: 28px; font-weight: 600; color: var(--gold); margin: 0;">${direction === 'east' ? 'Harder' : 'Easier'}</p>
                    <p style="font-size: 13px; opacity: 0.8; margin: 5px 0 0 0;">adaptation</p>
                </div>
            </div>
        `;

        // Update recommendation sections
        document.getElementById('lightRecommendation').innerHTML = lightRecommendation;
        document.getElementById('caffeineRecommendation').innerHTML = caffeineRecommendation;
        document.getElementById('melatoninRecommendation').innerHTML = melatoninRecommendation;
        document.getElementById('sleepRecommendation').innerHTML = sleepRecommendation;

        // Generate day-by-day plan HTML
        let dayByDayHTML = '';
        if (stayDuration <= 2 && absTimezoneDiff <= 6) {
            dayByDayHTML = `
                <p style="color: var(--text); line-height: 1.7;">For a ${stayDuration}-day trip with ${absTimezoneDiff}-hour difference,
                consider staying on your home schedule rather than adapting. This minimizes disruption to your body clock.</p>
            `;
        } else {
            dayByDayHTML = '<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; min-width: 500px;">';
            dayByDayHTML += `
                <thead>
                    <tr style="background: var(--navy); color: var(--cream);">
                        <th style="padding: 12px; text-align: left; font-weight: 500;">Day</th>
                        <th style="padding: 12px; text-align: left; font-weight: 500;">Light Strategy</th>
                        <th style="padding: 12px; text-align: left; font-weight: 500;">Sleep Target</th>
                        <th style="padding: 12px; text-align: left; font-weight: 500;">Notes</th>
                    </tr>
                </thead>
                <tbody>
            `;
            dayByDayPlan.forEach(day => {
                dayByDayHTML += `
                    <tr style="border-bottom: 1px solid rgba(201, 169, 98, 0.2);">
                        <td style="padding: 12px; color: var(--navy); font-weight: 500;">Day ${day.day}</td>
                        <td style="padding: 12px; color: var(--text);">${day.light}</td>
                        <td style="padding: 12px; color: var(--text);">${day.sleep}</td>
                        <td style="padding: 12px; color: var(--text-light); font-size: 14px;">${day.notes}</td>
                    </tr>
                `;
            });
            dayByDayHTML += '</tbody></table></div>';
        }
        document.getElementById('dayByDayContent').innerHTML = dayByDayHTML;

        // Show results
        document.getElementById('jetlagResults').style.display = 'block';

        // Scroll to results
        document.getElementById('jetlagResults').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

// Make available globally
window.Content = Content;
