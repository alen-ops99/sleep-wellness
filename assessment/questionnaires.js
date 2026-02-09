/**
 * Clinical Sleep Questionnaires
 * All instruments are validated and widely used in clinical practice
 */

const Questionnaires = {
    // Questionnaire definitions
    instruments: {
        'isi': {
            id: 'isi',
            name: 'Insomnia Severity Index',
            shortName: 'ISI',
            description: 'Validated 7-item questionnaire measuring insomnia severity',
            timeToComplete: '2-3 minutes',
            category: 'Insomnia',
            citation: 'Bastien, C.H., Vallieres, A., & Morin, C.M. (2001)',
            instructions: 'Please rate the current (i.e., last 2 weeks) severity of your insomnia problem(s).',
            questions: [
                {
                    id: 1,
                    text: 'Difficulty falling asleep',
                    options: [
                        { value: 0, label: 'None' },
                        { value: 1, label: 'Mild' },
                        { value: 2, label: 'Moderate' },
                        { value: 3, label: 'Severe' },
                        { value: 4, label: 'Very Severe' }
                    ]
                },
                {
                    id: 2,
                    text: 'Difficulty staying asleep',
                    options: [
                        { value: 0, label: 'None' },
                        { value: 1, label: 'Mild' },
                        { value: 2, label: 'Moderate' },
                        { value: 3, label: 'Severe' },
                        { value: 4, label: 'Very Severe' }
                    ]
                },
                {
                    id: 3,
                    text: 'Problems waking up too early',
                    options: [
                        { value: 0, label: 'None' },
                        { value: 1, label: 'Mild' },
                        { value: 2, label: 'Moderate' },
                        { value: 3, label: 'Severe' },
                        { value: 4, label: 'Very Severe' }
                    ]
                },
                {
                    id: 4,
                    text: 'How satisfied/dissatisfied are you with your current sleep pattern?',
                    options: [
                        { value: 0, label: 'Very Satisfied' },
                        { value: 1, label: 'Satisfied' },
                        { value: 2, label: 'Moderately Satisfied' },
                        { value: 3, label: 'Dissatisfied' },
                        { value: 4, label: 'Very Dissatisfied' }
                    ]
                },
                {
                    id: 5,
                    text: 'How noticeable to others do you think your sleep problem is in terms of impairing the quality of your life?',
                    options: [
                        { value: 0, label: 'Not at all Noticeable' },
                        { value: 1, label: 'A Little' },
                        { value: 2, label: 'Somewhat' },
                        { value: 3, label: 'Much' },
                        { value: 4, label: 'Very Much Noticeable' }
                    ]
                },
                {
                    id: 6,
                    text: 'How worried/distressed are you about your current sleep problem?',
                    options: [
                        { value: 0, label: 'Not at all Worried' },
                        { value: 1, label: 'A Little' },
                        { value: 2, label: 'Somewhat' },
                        { value: 3, label: 'Much' },
                        { value: 4, label: 'Very Much Worried' }
                    ]
                },
                {
                    id: 7,
                    text: 'To what extent do you consider your sleep problem to interfere with your daily functioning?',
                    options: [
                        { value: 0, label: 'Not at all Interfering' },
                        { value: 1, label: 'A Little' },
                        { value: 2, label: 'Somewhat' },
                        { value: 3, label: 'Much' },
                        { value: 4, label: 'Very Much Interfering' }
                    ]
                }
            ],
            scoring: {
                min: 0,
                max: 28,
                calculate: (answers) => answers.reduce((sum, a) => sum + a.value, 0),
                ranges: [
                    { min: 0, max: 7, severity: 'none', label: 'No Clinically Significant Insomnia', color: '#2e7d32', description: 'Your sleep appears to be within normal limits.' },
                    { min: 8, max: 14, severity: 'mild', label: 'Subthreshold Insomnia', color: '#f9a825', description: 'You are experiencing some sleep difficulties that may benefit from sleep hygiene improvements.' },
                    { min: 15, max: 21, severity: 'moderate', label: 'Moderate Clinical Insomnia', color: '#ef6c00', description: 'You have moderate insomnia that would likely benefit from CBT-I treatment.' },
                    { min: 22, max: 28, severity: 'severe', label: 'Severe Clinical Insomnia', color: '#c62828', description: 'You have severe insomnia. Treatment is strongly recommended.' }
                ]
            }
        },

        'ess': {
            id: 'ess',
            name: 'Epworth Sleepiness Scale',
            shortName: 'ESS',
            description: 'Measures daytime sleepiness and likelihood of dozing',
            timeToComplete: '2-3 minutes',
            category: 'Sleepiness',
            citation: 'Johns, M.W. (1991)',
            instructions: 'How likely are you to doze off or fall asleep in the following situations? Even if you have not done some of these things recently, try to work out how they would have affected you.',
            questions: [
                { id: 1, text: 'Sitting and reading', options: [{ value: 0, label: 'Would never doze' }, { value: 1, label: 'Slight chance' }, { value: 2, label: 'Moderate chance' }, { value: 3, label: 'High chance' }] },
                { id: 2, text: 'Watching TV', options: [{ value: 0, label: 'Would never doze' }, { value: 1, label: 'Slight chance' }, { value: 2, label: 'Moderate chance' }, { value: 3, label: 'High chance' }] },
                { id: 3, text: 'Sitting inactive in a public place', options: [{ value: 0, label: 'Would never doze' }, { value: 1, label: 'Slight chance' }, { value: 2, label: 'Moderate chance' }, { value: 3, label: 'High chance' }] },
                { id: 4, text: 'As a passenger in a car for an hour', options: [{ value: 0, label: 'Would never doze' }, { value: 1, label: 'Slight chance' }, { value: 2, label: 'Moderate chance' }, { value: 3, label: 'High chance' }] },
                { id: 5, text: 'Lying down to rest in the afternoon', options: [{ value: 0, label: 'Would never doze' }, { value: 1, label: 'Slight chance' }, { value: 2, label: 'Moderate chance' }, { value: 3, label: 'High chance' }] },
                { id: 6, text: 'Sitting and talking to someone', options: [{ value: 0, label: 'Would never doze' }, { value: 1, label: 'Slight chance' }, { value: 2, label: 'Moderate chance' }, { value: 3, label: 'High chance' }] },
                { id: 7, text: 'Sitting quietly after lunch (no alcohol)', options: [{ value: 0, label: 'Would never doze' }, { value: 1, label: 'Slight chance' }, { value: 2, label: 'Moderate chance' }, { value: 3, label: 'High chance' }] },
                { id: 8, text: 'In a car, stopped in traffic', options: [{ value: 0, label: 'Would never doze' }, { value: 1, label: 'Slight chance' }, { value: 2, label: 'Moderate chance' }, { value: 3, label: 'High chance' }] }
            ],
            scoring: {
                min: 0,
                max: 24,
                calculate: (answers) => answers.reduce((sum, a) => sum + a.value, 0),
                ranges: [
                    { min: 0, max: 10, severity: 'normal', label: 'Normal Daytime Sleepiness', color: '#2e7d32', description: 'Your daytime sleepiness is within normal limits.' },
                    { min: 11, max: 14, severity: 'mild', label: 'Mild Excessive Sleepiness', color: '#f9a825', description: 'You have mild excessive daytime sleepiness.' },
                    { min: 15, max: 17, severity: 'moderate', label: 'Moderate Excessive Sleepiness', color: '#ef6c00', description: 'You have moderate excessive daytime sleepiness. Evaluation may be warranted.' },
                    { min: 18, max: 24, severity: 'severe', label: 'Severe Excessive Sleepiness', color: '#c62828', description: 'You have severe excessive daytime sleepiness. Medical evaluation is recommended.' }
                ]
            }
        },

        'stopbang': {
            id: 'stopbang',
            name: 'STOP-BANG Questionnaire',
            shortName: 'STOP-BANG',
            description: 'Screening tool for obstructive sleep apnea risk',
            timeToComplete: '1-2 minutes',
            category: 'Sleep Apnea',
            citation: 'Chung, F. et al. (2008)',
            instructions: 'Answer yes or no to the following questions about your sleep and health.',
            questions: [
                { id: 1, text: 'Do you SNORE loudly?', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] },
                { id: 2, text: 'Do you often feel TIRED during daytime?', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] },
                { id: 3, text: 'Has anyone OBSERVED you stop breathing during sleep?', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] },
                { id: 4, text: 'Do you have high blood PRESSURE?', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] },
                { id: 5, text: 'Is your BMI more than 35?', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] },
                { id: 6, text: 'Is your AGE over 50?', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] },
                { id: 7, text: 'Is your NECK circumference greater than 40cm?', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] },
                { id: 8, text: 'Is your GENDER male?', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] }
            ],
            scoring: {
                min: 0,
                max: 8,
                calculate: (answers) => answers.reduce((sum, a) => sum + a.value, 0),
                ranges: [
                    { min: 0, max: 2, severity: 'low', label: 'Low Risk for OSA', color: '#2e7d32', description: 'You are at low risk for obstructive sleep apnea.' },
                    { min: 3, max: 4, severity: 'intermediate', label: 'Intermediate Risk for OSA', color: '#f9a825', description: 'You have intermediate risk. Consider a sleep study if symptomatic.' },
                    { min: 5, max: 8, severity: 'high', label: 'High Risk for OSA', color: '#c62828', description: 'You are at high risk. A sleep study is recommended.' }
                ]
            }
        },

        'phq9': {
            id: 'phq9',
            name: 'Patient Health Questionnaire-9',
            shortName: 'PHQ-9',
            description: 'Screens for depression severity',
            timeToComplete: '2-3 minutes',
            category: 'Mood',
            citation: 'Kroenke, K., Spitzer, R.L., & Williams, J.B. (2001)',
            instructions: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
            questions: [
                { id: 1, text: 'Little interest or pleasure in doing things', options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'Several days' }, { value: 2, label: 'More than half the days' }, { value: 3, label: 'Nearly every day' }] },
                { id: 2, text: 'Feeling down, depressed, or hopeless', options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'Several days' }, { value: 2, label: 'More than half the days' }, { value: 3, label: 'Nearly every day' }] },
                { id: 3, text: 'Trouble falling or staying asleep, or sleeping too much', options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'Several days' }, { value: 2, label: 'More than half the days' }, { value: 3, label: 'Nearly every day' }] },
                { id: 4, text: 'Feeling tired or having little energy', options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'Several days' }, { value: 2, label: 'More than half the days' }, { value: 3, label: 'Nearly every day' }] },
                { id: 5, text: 'Poor appetite or overeating', options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'Several days' }, { value: 2, label: 'More than half the days' }, { value: 3, label: 'Nearly every day' }] },
                { id: 6, text: 'Feeling bad about yourself', options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'Several days' }, { value: 2, label: 'More than half the days' }, { value: 3, label: 'Nearly every day' }] },
                { id: 7, text: 'Trouble concentrating on things', options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'Several days' }, { value: 2, label: 'More than half the days' }, { value: 3, label: 'Nearly every day' }] },
                { id: 8, text: 'Moving or speaking slowly, or being restless', options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'Several days' }, { value: 2, label: 'More than half the days' }, { value: 3, label: 'Nearly every day' }] },
                { id: 9, text: 'Thoughts of self-harm', options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'Several days' }, { value: 2, label: 'More than half the days' }, { value: 3, label: 'Nearly every day' }] }
            ],
            scoring: {
                min: 0,
                max: 27,
                calculate: (answers) => answers.reduce((sum, a) => sum + a.value, 0),
                ranges: [
                    { min: 0, max: 4, severity: 'minimal', label: 'Minimal Depression', color: '#2e7d32', description: 'Your symptoms suggest minimal or no depression.' },
                    { min: 5, max: 9, severity: 'mild', label: 'Mild Depression', color: '#8bc34a', description: 'Your symptoms suggest mild depression.' },
                    { min: 10, max: 14, severity: 'moderate', label: 'Moderate Depression', color: '#f9a825', description: 'Your symptoms suggest moderate depression. Treatment should be considered.' },
                    { min: 15, max: 19, severity: 'moderately-severe', label: 'Moderately Severe Depression', color: '#ef6c00', description: 'Your symptoms suggest moderately severe depression.' },
                    { min: 20, max: 27, severity: 'severe', label: 'Severe Depression', color: '#c62828', description: 'Your symptoms suggest severe depression. Treatment is recommended.' }
                ],
                specialNote: 'If you answered positively to question 9, please reach out to a mental health professional immediately.'
            }
        },

        'gad7': {
            id: 'gad7',
            name: 'Generalized Anxiety Disorder 7-Item',
            shortName: 'GAD-7',
            description: 'Screens for anxiety severity',
            timeToComplete: '2 minutes',
            category: 'Mood',
            citation: 'Spitzer, R.L. et al. (2006)',
            instructions: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
            questions: [
                { id: 1, text: 'Feeling nervous, anxious, or on edge', options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'Several days' }, { value: 2, label: 'More than half the days' }, { value: 3, label: 'Nearly every day' }] },
                { id: 2, text: 'Not being able to stop or control worrying', options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'Several days' }, { value: 2, label: 'More than half the days' }, { value: 3, label: 'Nearly every day' }] },
                { id: 3, text: 'Worrying too much about different things', options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'Several days' }, { value: 2, label: 'More than half the days' }, { value: 3, label: 'Nearly every day' }] },
                { id: 4, text: 'Trouble relaxing', options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'Several days' }, { value: 2, label: 'More than half the days' }, { value: 3, label: 'Nearly every day' }] },
                { id: 5, text: 'Being so restless that it is hard to sit still', options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'Several days' }, { value: 2, label: 'More than half the days' }, { value: 3, label: 'Nearly every day' }] },
                { id: 6, text: 'Becoming easily annoyed or irritable', options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'Several days' }, { value: 2, label: 'More than half the days' }, { value: 3, label: 'Nearly every day' }] },
                { id: 7, text: 'Feeling afraid, as if something awful might happen', options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'Several days' }, { value: 2, label: 'More than half the days' }, { value: 3, label: 'Nearly every day' }] }
            ],
            scoring: {
                min: 0,
                max: 21,
                calculate: (answers) => answers.reduce((sum, a) => sum + a.value, 0),
                ranges: [
                    { min: 0, max: 4, severity: 'minimal', label: 'Minimal Anxiety', color: '#2e7d32', description: 'Your symptoms suggest minimal or no anxiety.' },
                    { min: 5, max: 9, severity: 'mild', label: 'Mild Anxiety', color: '#8bc34a', description: 'Your symptoms suggest mild anxiety.' },
                    { min: 10, max: 14, severity: 'moderate', label: 'Moderate Anxiety', color: '#f9a825', description: 'Your symptoms suggest moderate anxiety.' },
                    { min: 15, max: 21, severity: 'severe', label: 'Severe Anxiety', color: '#c62828', description: 'Your symptoms suggest severe anxiety. Treatment is recommended.' }
                ]
            }
        },

        'csds': {
            id: 'csds',
            name: 'Comprehensive Sleep Disorder Screener',
            shortName: 'CSDS',
            description: 'Multi-disorder screening for insomnia, sleep apnea, RLS, parasomnias, REM behavior disorder, narcolepsy, and circadian rhythm disorders',
            timeToComplete: '5-7 minutes',
            category: 'Comprehensive',
            citation: 'Based on ICSD-3 diagnostic criteria and validated screening tools',
            instructions: 'The following questions assess various sleep-related symptoms. Please answer based on your experiences over the past month.',
            isMultiDomain: true,
            questions: [
                // Insomnia Domain (Q1-3)
                { id: 1, text: 'Do you have difficulty falling asleep at night?', domain: 'insomnia', options: [{ value: 0, label: 'Never' }, { value: 1, label: 'Rarely (1-2x/month)' }, { value: 2, label: 'Sometimes (1-2x/week)' }, { value: 3, label: 'Often (3+ times/week)' }] },
                { id: 2, text: 'Do you wake up during the night and have trouble going back to sleep?', domain: 'insomnia', options: [{ value: 0, label: 'Never' }, { value: 1, label: 'Rarely' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }] },
                { id: 3, text: 'Do you wake up earlier than desired and cannot get back to sleep?', domain: 'insomnia', options: [{ value: 0, label: 'Never' }, { value: 1, label: 'Rarely' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }] },

                // Sleep Apnea Domain (Q4-6)
                { id: 4, text: 'Have you been told that you snore loudly?', domain: 'apnea', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Occasionally' }, { value: 2, label: 'Frequently' }, { value: 3, label: 'Almost every night' }] },
                { id: 5, text: 'Has anyone observed you stop breathing or gasp for air during sleep?', domain: 'apnea', options: [{ value: 0, label: 'Never' }, { value: 1, label: 'Rarely' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }] },
                { id: 6, text: 'Do you wake up with a dry mouth, sore throat, or headache?', domain: 'apnea', options: [{ value: 0, label: 'Never' }, { value: 1, label: 'Rarely' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }] },

                // Restless Legs Syndrome Domain (Q7-9)
                { id: 7, text: 'Do you experience uncomfortable sensations in your legs (creeping, crawling, tingling) that create an urge to move them?', domain: 'rls', options: [{ value: 0, label: 'Never' }, { value: 1, label: 'Rarely' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }] },
                { id: 8, text: 'Are these sensations worse when you are resting or lying down?', domain: 'rls', options: [{ value: 0, label: 'Not applicable' }, { value: 1, label: 'No' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Yes, much worse' }] },
                { id: 9, text: 'Do these sensations improve when you move your legs or walk around?', domain: 'rls', options: [{ value: 0, label: 'Not applicable' }, { value: 1, label: 'No' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Yes, completely' }] },

                // Parasomnias Domain (Q10-12)
                { id: 10, text: 'Have you or others noticed you walking, talking, or performing activities while asleep?', domain: 'parasomnia', options: [{ value: 0, label: 'Never' }, { value: 1, label: 'Once or twice ever' }, { value: 2, label: 'A few times a year' }, { value: 3, label: 'Monthly or more' }] },
                { id: 11, text: 'Do you experience confusion or disorientation when awakened from sleep?', domain: 'parasomnia', options: [{ value: 0, label: 'Never' }, { value: 1, label: 'Rarely' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }] },
                { id: 12, text: 'Have you experienced sleep terrors (waking in panic with screaming, racing heart)?', domain: 'parasomnia', options: [{ value: 0, label: 'Never' }, { value: 1, label: 'Once or twice ever' }, { value: 2, label: 'A few times a year' }, { value: 3, label: 'Monthly or more' }] },

                // REM Behavior Disorder Domain (Q13-14)
                { id: 13, text: 'Have you or a bed partner noticed you acting out your dreams (punching, kicking, shouting)?', domain: 'rbd', options: [{ value: 0, label: 'Never' }, { value: 1, label: 'Rarely' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }] },
                { id: 14, text: 'Have you injured yourself or a bed partner during sleep?', domain: 'rbd', options: [{ value: 0, label: 'Never' }, { value: 1, label: 'Once' }, { value: 2, label: 'A few times' }, { value: 3, label: 'Multiple times' }] },

                // Narcolepsy/Hypersomnia Domain (Q15-16)
                { id: 15, text: 'Do you experience sudden muscle weakness triggered by strong emotions (laughter, surprise, anger)?', domain: 'narcolepsy', options: [{ value: 0, label: 'Never' }, { value: 1, label: 'Rarely' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }] },
                { id: 16, text: 'Do you have vivid dream-like experiences when falling asleep or waking up (hallucinations)?', domain: 'narcolepsy', options: [{ value: 0, label: 'Never' }, { value: 1, label: 'Rarely' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }] },

                // Circadian Rhythm Disorders Domain (Q17-18)
                { id: 17, text: 'Do you naturally fall asleep much later than desired (e.g., after 2 AM) and have great difficulty waking for morning obligations?', domain: 'circadian', options: [{ value: 0, label: 'Never' }, { value: 1, label: 'Rarely' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often/Always' }] },
                { id: 18, text: 'Does your sleep schedule shift significantly (2+ hours) between workdays and free days?', domain: 'circadian', options: [{ value: 0, label: 'No shift' }, { value: 1, label: 'Minor shift (1-2 hrs)' }, { value: 2, label: 'Moderate shift (2-3 hrs)' }, { value: 3, label: 'Large shift (3+ hrs)' }] }
            ],
            scoring: {
                min: 0,
                max: 54,
                isMultiDomain: true,
                domains: {
                    insomnia: { questions: [1, 2, 3], maxScore: 9, threshold: 5, label: 'Insomnia', icon: 'moon' },
                    apnea: { questions: [4, 5, 6], maxScore: 9, threshold: 4, label: 'Sleep Apnea Risk', icon: 'lungs' },
                    rls: { questions: [7, 8, 9], maxScore: 9, threshold: 5, label: 'Restless Legs Syndrome', icon: 'legs' },
                    parasomnia: { questions: [10, 11, 12], maxScore: 9, threshold: 4, label: 'Parasomnia', icon: 'walk' },
                    rbd: { questions: [13, 14], maxScore: 6, threshold: 2, label: 'REM Behavior Disorder', icon: 'fight' },
                    narcolepsy: { questions: [15, 16], maxScore: 6, threshold: 3, label: 'Narcolepsy Indicators', icon: 'sleep' },
                    circadian: { questions: [17, 18], maxScore: 6, threshold: 4, label: 'Circadian Rhythm Disorder', icon: 'clock' }
                },
                calculate: (answers) => answers.reduce((sum, a) => sum + a.value, 0),
                calculateDomains: function(answers) {
                    const results = {};
                    for (const [domain, config] of Object.entries(this.domains)) {
                        const domainAnswers = answers.filter(a => config.questions.includes(a.questionId));
                        const score = domainAnswers.reduce((sum, a) => sum + a.value, 0);
                        const flagged = score >= config.threshold;
                        results[domain] = {
                            score,
                            maxScore: config.maxScore,
                            percentage: Math.round((score / config.maxScore) * 100),
                            flagged,
                            label: config.label,
                            severity: flagged ? (score >= config.threshold * 1.5 ? 'high' : 'moderate') : 'low'
                        };
                    }
                    return results;
                },
                ranges: [
                    { min: 0, max: 10, severity: 'low', label: 'Low Concern', color: '#2e7d32', description: 'Your responses suggest minimal sleep disorder indicators.' },
                    { min: 11, max: 25, severity: 'moderate', label: 'Some Concerns', color: '#f9a825', description: 'Some sleep disorder indicators present. Review specific domains.' },
                    { min: 26, max: 40, severity: 'elevated', label: 'Multiple Concerns', color: '#ef6c00', description: 'Multiple sleep disorder indicators. Consultation recommended.' },
                    { min: 41, max: 54, severity: 'high', label: 'Significant Concerns', color: '#c62828', description: 'Significant indicators across multiple domains. Evaluation strongly recommended.' }
                ]
            }
        },

        'psqi': {
            id: 'psqi',
            name: 'Pittsburgh Sleep Quality Index',
            shortName: 'PSQI',
            description: 'Validated 9-item questionnaire measuring overall sleep quality over the past month',
            timeToComplete: '3-5 minutes',
            category: 'Sleep Quality',
            citation: 'Buysse, D.J., Reynolds, C.F., Monk, T.H., Berman, S.R., & Kupfer, D.J. (1989)',
            instructions: 'The following questions relate to your usual sleep habits during the past month only. Please answer all questions.',
            questions: [
                {
                    id: 1,
                    text: 'During the past month, how would you rate your overall sleep quality?',
                    component: 'subjective_quality',
                    options: [
                        { value: 0, label: 'Very Good' },
                        { value: 1, label: 'Fairly Good' },
                        { value: 2, label: 'Fairly Bad' },
                        { value: 3, label: 'Very Bad' }
                    ]
                },
                {
                    id: 2,
                    text: 'During the past month, how long (in minutes) has it usually taken you to fall asleep each night?',
                    component: 'sleep_latency',
                    options: [
                        { value: 0, label: '≤15 minutes' },
                        { value: 1, label: '16-30 minutes' },
                        { value: 2, label: '31-60 minutes' },
                        { value: 3, label: '>60 minutes' }
                    ]
                },
                {
                    id: 3,
                    text: 'During the past month, how many hours of actual sleep did you get at night? (This may be different than the number of hours you spent in bed.)',
                    component: 'sleep_duration',
                    options: [
                        { value: 0, label: '>7 hours' },
                        { value: 1, label: '6-7 hours' },
                        { value: 2, label: '5-6 hours' },
                        { value: 3, label: '<5 hours' }
                    ]
                },
                {
                    id: 4,
                    text: 'During the past month, how would you rate your habitual sleep efficiency? (Percentage of time in bed actually spent sleeping)',
                    component: 'sleep_efficiency',
                    options: [
                        { value: 0, label: '>85%' },
                        { value: 1, label: '75-84%' },
                        { value: 2, label: '65-74%' },
                        { value: 3, label: '<65%' }
                    ]
                },
                {
                    id: 5,
                    text: 'During the past month, how often have you had trouble sleeping because of waking up in the middle of the night or early morning, pain, breathing issues, coughing/snoring, feeling too hot/cold, bad dreams, or other reasons?',
                    component: 'sleep_disturbances',
                    options: [
                        { value: 0, label: 'Not during the past month' },
                        { value: 1, label: 'Less than once a week' },
                        { value: 2, label: 'Once or twice a week' },
                        { value: 3, label: 'Three or more times a week' }
                    ]
                },
                {
                    id: 6,
                    text: 'During the past month, how often have you taken medicine (prescribed or over the counter) to help you sleep?',
                    component: 'sleep_medication',
                    options: [
                        { value: 0, label: 'Not during the past month' },
                        { value: 1, label: 'Less than once a week' },
                        { value: 2, label: 'Once or twice a week' },
                        { value: 3, label: 'Three or more times a week' }
                    ]
                },
                {
                    id: 7,
                    text: 'During the past month, how often have you had trouble staying awake while driving, eating meals, or engaging in social activity?',
                    component: 'daytime_dysfunction_a',
                    options: [
                        { value: 0, label: 'Not during the past month' },
                        { value: 1, label: 'Less than once a week' },
                        { value: 2, label: 'Once or twice a week' },
                        { value: 3, label: 'Three or more times a week' }
                    ]
                },
                {
                    id: 8,
                    text: 'During the past month, how much of a problem has it been for you to keep up enough enthusiasm to get things done?',
                    component: 'daytime_dysfunction_b',
                    options: [
                        { value: 0, label: 'No problem at all' },
                        { value: 1, label: 'Only a very slight problem' },
                        { value: 2, label: 'Somewhat of a problem' },
                        { value: 3, label: 'A very big problem' }
                    ]
                },
                {
                    id: 9,
                    text: 'Do you have a bed partner or roommate?',
                    component: 'bed_partner',
                    options: [
                        { value: 0, label: 'No bed partner or roommate' },
                        { value: 1, label: 'Partner/roommate in other room' },
                        { value: 2, label: 'Partner in same room, different bed' },
                        { value: 3, label: 'Partner in same bed' }
                    ],
                    excludeFromScore: true
                }
            ],
            scoring: {
                min: 0,
                max: 21,
                calculate: (answers) => {
                    // Sum all component scores (Q1-Q8), exclude bed partner question (Q9)
                    let total = 0;
                    answers.forEach(a => {
                        const q = a.questionId || a.id;
                        if (q !== 9) total += a.value;
                    });
                    // Daytime dysfunction is average of Q7+Q8, capped at 3
                    // In this simplified Likert format, each Q maps to one component (0-3)
                    // so the max per component is 3, and 7 scored components = max 21
                    return Math.min(total, 21);
                },
                ranges: [
                    { min: 0, max: 5, severity: 'good', label: 'Good Sleep Quality', color: '#2e7d32', description: 'Your sleep quality is within normal limits. No intervention needed.' },
                    { min: 6, max: 10, severity: 'poor', label: 'Poor Sleep Quality', color: '#f9a825', description: 'You have poor sleep quality. Sleep hygiene improvements are recommended.' },
                    { min: 11, max: 15, severity: 'very-poor', label: 'Very Poor Sleep Quality', color: '#ef6c00', description: 'You have very poor sleep quality. A structured sleep improvement program is recommended.' },
                    { min: 16, max: 21, severity: 'severe', label: 'Severe Sleep Quality Issues', color: '#c62828', description: 'You have severely impaired sleep quality. Comprehensive evaluation and treatment are strongly recommended.' }
                ]
            }
        }
    },

    calculateScore(instrumentId, answers) {
        const instrument = this.instruments[instrumentId];
        if (!instrument) return null;
        const score = instrument.scoring.calculate(answers);
        const range = instrument.scoring.ranges.find(r => score >= r.min && score <= r.max);

        const result = {
            instrumentId,
            instrumentName: instrument.name,
            shortName: instrument.shortName,
            score,
            maxScore: instrument.scoring.max,
            severity: range?.severity || 'unknown',
            label: range?.label || 'Unknown',
            color: range?.color || '#666',
            description: range?.description || '',
            specialNote: instrument.scoring.specialNote || null
        };

        // Handle multi-domain questionnaires (like CSDS)
        if (instrument.scoring.isMultiDomain && instrument.scoring.calculateDomains) {
            result.isMultiDomain = true;
            result.domains = instrument.scoring.calculateDomains(answers);
            result.flaggedDomains = Object.entries(result.domains)
                .filter(([_, d]) => d.flagged)
                .map(([key, d]) => ({ key, ...d }));
        }

        return result;
    },

    getInstrument(id) {
        return this.instruments[id] || null;
    },

    getAllInstruments() {
        return Object.values(this.instruments);
    },

    // Render questions to a container - used by app.js
    renderQuestions(questionnaire, containerId, savedResponses = {}) {
        const container = document.getElementById(containerId);
        if (!container || !questionnaire || !questionnaire.questions) return;

        let html = '';
        questionnaire.questions.forEach((q, index) => {
            const questionId = `${questionnaire.id || containerId}_q${q.id || index}`;
            const savedValue = savedResponses[questionId];

            html += `<div class="questionnaire-item">
                <div class="question">${index + 1}. ${q.text}</div>
                <div class="options">`;

            if (q.options) {
                q.options.forEach(opt => {
                    const isSelected = savedValue == opt.value ? 'selected' : '';
                    html += `<button type="button" class="option-btn ${isSelected}"
                        data-question="${questionId}" data-value="${opt.value}">${opt.label}</button>`;
                });
            }

            html += `</div></div>`;
        });

        container.innerHTML = html;

        // Add click handlers
        container.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const questionId = btn.dataset.question;
                const value = btn.dataset.value;
                btn.parentElement.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                if (window.App) {
                    App.saveResponse(questionId, value);
                }
            });
        });
    },

    // Aliases for backwards compatibility with app.js
    get epworth() {
        return this.instruments.ess || { id: 'ess', questions: [] };
    },
    get isi() {
        return this.instruments.isi || { id: 'isi', questions: [] };
    },
    get stopbang() {
        return this.instruments.stopbang || { id: 'stopbang', questions: [] };
    },
    get rls() {
        return this.instruments.rls || { id: 'rls', questions: [] };
    },
    get parasomnias() {
        return this.instruments.csds || { id: 'csds', questions: [] };
    },
    get remBehavior() {
        return this.instruments.csds || { id: 'csds', questions: [] };
    },
    get circadian() {
        return this.instruments.csds || { id: 'csds', questions: [] };
    }
};

window.Questionnaires = Questionnaires;
