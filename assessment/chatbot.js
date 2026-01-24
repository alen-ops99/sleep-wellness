/**
 * Sleep Wellness AI Chatbot
 * Provides sleep education and wellness guidance (NOT medical advice)
 * Integrates with Anthropic Claude API via backend proxy
 */

const SleepChatbot = {
    isOpen: false,
    messages: [],
    isLoading: false,

    // System prompt that guides the AI to be helpful but not give medical advice
    systemPrompt: `You are a friendly and knowledgeable Sleep Wellness Assistant for Dr. Alen Juginovic's Sleep Wellness practice. Your role is to:

1. PROVIDE sleep education and general wellness information
2. EXPLAIN sleep hygiene practices, circadian rhythm concepts, and healthy sleep habits
3. HELP users understand their assessment results at a high level
4. ENCOURAGE healthy sleep behaviors and lifestyle changes
5. ANSWER questions about sleep science in an accessible way

You must NEVER:
- Provide medical diagnoses or suggest specific medical conditions
- Recommend specific medications or supplements with dosages
- Interpret medical test results or sleep study data
- Provide treatment plans or medical advice
- Make claims about curing or treating any condition

When users ask about symptoms, diagnoses, or medical concerns, respond warmly with:
"That's an important question that would be best discussed with Dr. Alen during your consultation. He can review your complete history and provide personalized guidance."

Keep responses concise (2-4 sentences typically), friendly, and focused on education. Use simple language. You can use formatting like bullet points when helpful.

Remember: You're here to educate and support, not to diagnose or treat.`,

    // Initialize the chatbot
    init() {
        this.renderWidget();
        this.loadHistory();
    },

    // Render the chatbot widget
    renderWidget() {
        const widget = document.createElement('div');
        widget.id = 'sleep-chatbot';
        widget.innerHTML = `
            <div id="chatbot-panel" class="chatbot-panel">
                <div class="chatbot-header">
                    <div class="chatbot-header-info">
                        <div class="chatbot-avatar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                        </div>
                        <div>
                            <h4>Sleep Wellness Assistant</h4>
                            <span class="chatbot-status">Online</span>
                        </div>
                    </div>
                    <button class="chatbot-close" onclick="SleepChatbot.toggle()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="chatbot-messages" id="chatbot-messages">
                    <div class="chatbot-welcome">
                        <div class="welcome-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                            </svg>
                        </div>
                        <h4>Welcome!</h4>
                        <p>I'm here to help you learn about sleep wellness and healthy sleep habits. Ask me anything about:</p>
                        <ul>
                            <li>Sleep hygiene tips</li>
                            <li>Understanding your sleep patterns</li>
                            <li>Relaxation techniques</li>
                            <li>Circadian rhythm basics</li>
                        </ul>
                        <p class="chatbot-disclaimer">I provide educational information only, not medical advice. For personal health questions, please consult with Dr. Alen.</p>
                    </div>
                </div>
                <div class="chatbot-suggestions" id="chatbot-suggestions">
                    <button onclick="SleepChatbot.sendSuggestion('What are the best sleep hygiene practices?')">Sleep hygiene tips</button>
                    <button onclick="SleepChatbot.sendSuggestion('How can I improve my sleep quality?')">Improve sleep quality</button>
                    <button onclick="SleepChatbot.sendSuggestion('What is circadian rhythm?')">Circadian rhythm</button>
                </div>
                <div class="chatbot-input-container">
                    <input type="text" id="chatbot-input" placeholder="Ask about sleep wellness..." onkeypress="if(event.key==='Enter')SleepChatbot.sendMessage()">
                    <button class="chatbot-send" onclick="SleepChatbot.sendMessage()" id="chatbot-send-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="22" y1="2" x2="11" y2="13"/>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                    </button>
                </div>
            </div>
            <button id="chatbot-toggle" class="chatbot-toggle" onclick="SleepChatbot.toggle()">
                <svg class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                <span class="chatbot-badge" id="chatbot-badge" style="display: none;">1</span>
            </button>
        `;
        document.body.appendChild(widget);
        this.addStyles();
    },

    // Add chatbot styles
    addStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            #sleep-chatbot {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: 'Montserrat', sans-serif;
            }

            .chatbot-toggle {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #0f1c2e 0%, #1a2a3a 100%);
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 20px rgba(15, 28, 46, 0.4);
                transition: all 0.3s ease;
                position: relative;
            }

            .chatbot-toggle:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 25px rgba(15, 28, 46, 0.5);
            }

            .chatbot-toggle svg {
                width: 28px;
                height: 28px;
                stroke: #C9A962;
            }

            .chatbot-toggle.open .chat-icon { display: none; }
            .chatbot-toggle.open .close-icon { display: block; }

            .chatbot-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #c62828;
                color: white;
                font-size: 11px;
                font-weight: 600;
                padding: 2px 6px;
                border-radius: 10px;
                min-width: 18px;
                text-align: center;
            }

            .chatbot-panel {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 380px;
                max-width: calc(100vw - 40px);
                height: 500px;
                max-height: calc(100vh - 120px);
                background: white;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
            }

            .chatbot-panel.open {
                display: flex;
            }

            .chatbot-header {
                background: linear-gradient(135deg, #0f1c2e 0%, #1a2a3a 100%);
                color: white;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .chatbot-header-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .chatbot-avatar {
                width: 40px;
                height: 40px;
                background: rgba(201, 169, 98, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .chatbot-avatar svg {
                width: 20px;
                height: 20px;
                stroke: #C9A962;
            }

            .chatbot-header h4 {
                margin: 0;
                font-size: 14px;
                font-weight: 600;
            }

            .chatbot-status {
                font-size: 11px;
                color: #8BC34A;
            }

            .chatbot-close {
                background: none;
                border: none;
                cursor: pointer;
                padding: 8px;
            }

            .chatbot-close svg {
                width: 18px;
                height: 18px;
                stroke: rgba(255,255,255,0.7);
            }

            .chatbot-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: #fafafa;
            }

            .chatbot-welcome {
                text-align: center;
                padding: 20px;
            }

            .welcome-icon {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #0f1c2e 0%, #1a2a3a 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 15px;
            }

            .welcome-icon svg {
                width: 30px;
                height: 30px;
                stroke: #C9A962;
            }

            .chatbot-welcome h4 {
                color: #0f1c2e;
                margin: 0 0 10px;
                font-size: 18px;
            }

            .chatbot-welcome p {
                color: #666;
                font-size: 13px;
                margin: 0 0 15px;
                line-height: 1.5;
            }

            .chatbot-welcome ul {
                text-align: left;
                color: #666;
                font-size: 13px;
                margin: 0 0 15px;
                padding-left: 25px;
            }

            .chatbot-welcome li {
                margin: 5px 0;
            }

            .chatbot-disclaimer {
                font-size: 11px !important;
                color: #999 !important;
                font-style: italic;
            }

            .chatbot-suggestions {
                padding: 10px 15px;
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                background: white;
                border-top: 1px solid #eee;
            }

            .chatbot-suggestions button {
                background: rgba(201, 169, 98, 0.1);
                border: 1px solid rgba(201, 169, 98, 0.3);
                color: #0f1c2e;
                padding: 6px 12px;
                border-radius: 15px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .chatbot-suggestions button:hover {
                background: rgba(201, 169, 98, 0.2);
                border-color: #C9A962;
            }

            .chatbot-input-container {
                padding: 15px;
                background: white;
                border-top: 1px solid #eee;
                display: flex;
                gap: 10px;
            }

            #chatbot-input {
                flex: 1;
                padding: 12px 15px;
                border: 1px solid #ddd;
                border-radius: 25px;
                font-size: 14px;
                outline: none;
                font-family: inherit;
            }

            #chatbot-input:focus {
                border-color: #C9A962;
            }

            .chatbot-send {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: #0f1c2e;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }

            .chatbot-send:hover {
                background: #1a2a3a;
            }

            .chatbot-send:disabled {
                background: #ccc;
                cursor: not-allowed;
            }

            .chatbot-send svg {
                width: 18px;
                height: 18px;
                stroke: #C9A962;
            }

            .chat-message {
                margin-bottom: 15px;
                display: flex;
                flex-direction: column;
            }

            .chat-message.user {
                align-items: flex-end;
            }

            .chat-message.assistant {
                align-items: flex-start;
            }

            .message-bubble {
                max-width: 85%;
                padding: 12px 16px;
                border-radius: 18px;
                font-size: 14px;
                line-height: 1.5;
            }

            .chat-message.user .message-bubble {
                background: #0f1c2e;
                color: white;
                border-bottom-right-radius: 4px;
            }

            .chat-message.assistant .message-bubble {
                background: white;
                color: #333;
                border-bottom-left-radius: 4px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }

            .message-time {
                font-size: 10px;
                color: #999;
                margin-top: 4px;
                padding: 0 5px;
            }

            .typing-indicator {
                display: flex;
                gap: 4px;
                padding: 15px;
            }

            .typing-indicator span {
                width: 8px;
                height: 8px;
                background: #C9A962;
                border-radius: 50%;
                animation: typing 1.4s infinite;
            }

            .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
            .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

            @keyframes typing {
                0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                30% { transform: translateY(-5px); opacity: 1; }
            }

            @media (max-width: 480px) {
                .chatbot-panel {
                    width: 100%;
                    max-width: none;
                    right: 0;
                    left: 0;
                    bottom: 70px;
                    border-radius: 16px 16px 0 0;
                }
            }
        `;
        document.head.appendChild(styles);
    },

    // Toggle chatbot visibility
    toggle() {
        this.isOpen = !this.isOpen;
        const panel = document.getElementById('chatbot-panel');
        const toggle = document.getElementById('chatbot-toggle');

        if (this.isOpen) {
            panel.classList.add('open');
            toggle.classList.add('open');
            document.getElementById('chatbot-input').focus();
            // Hide suggestions if there are messages
            if (this.messages.length > 0) {
                document.getElementById('chatbot-suggestions').style.display = 'none';
            }
        } else {
            panel.classList.remove('open');
            toggle.classList.remove('open');
        }
    },

    // Send a suggested question
    sendSuggestion(text) {
        document.getElementById('chatbot-input').value = text;
        this.sendMessage();
    },

    // Send a message
    async sendMessage() {
        const input = document.getElementById('chatbot-input');
        const text = input.value.trim();
        if (!text || this.isLoading) return;

        // Hide welcome and suggestions
        const welcome = document.querySelector('.chatbot-welcome');
        const suggestions = document.getElementById('chatbot-suggestions');
        if (welcome) welcome.style.display = 'none';
        if (suggestions) suggestions.style.display = 'none';

        // Add user message
        this.addMessage('user', text);
        input.value = '';

        // Show loading
        this.isLoading = true;
        this.showTypingIndicator();

        try {
            // Get AI response
            const response = await this.getAIResponse(text);
            this.hideTypingIndicator();
            this.addMessage('assistant', response);
        } catch (error) {
            console.error('Chatbot error:', error);
            this.hideTypingIndicator();
            this.addMessage('assistant', "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or reach out to Dr. Alen directly for assistance.");
        }

        this.isLoading = false;
        this.saveHistory();
    },

    // Add a message to the chat
    addMessage(role, content) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        this.messages.push({ role, content, time: now.toISOString() });

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;
        messageDiv.innerHTML = `
            <div class="message-bubble">${this.formatMessage(content)}</div>
            <span class="message-time">${timeStr}</span>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    // Format message content (handle markdown-like formatting)
    formatMessage(content) {
        // Simple formatting
        return content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/• /g, '&bull; ');
    },

    // Show typing indicator
    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const indicator = document.createElement('div');
        indicator.className = 'chat-message assistant';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `
            <div class="message-bubble">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(indicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    // Hide typing indicator
    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    },

    // Get AI response (using backend proxy)
    async getAIResponse(userMessage) {
        // Build conversation history for context
        const conversationHistory = this.messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
        }));

        // Check if we have a backend endpoint configured
        const CHATBOT_API_ENDPOINT = window.CHATBOT_API_ENDPOINT || null;

        if (CHATBOT_API_ENDPOINT) {
            // Production: Use backend proxy
            const response = await fetch(CHATBOT_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: conversationHistory,
                    systemPrompt: this.systemPrompt
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            return data.response;
        } else {
            // Demo mode: Provide helpful responses without API
            return this.getDemoResponse(userMessage);
        }
    },

    // Demo responses when no API is configured
    getDemoResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        // Check for medical/diagnosis questions
        if (lowerMessage.includes('diagnos') || lowerMessage.includes('symptom') ||
            lowerMessage.includes('treat') || lowerMessage.includes('medication') ||
            lowerMessage.includes('sleep apnea') || lowerMessage.includes('insomnia') ||
            lowerMessage.includes('disorder') || lowerMessage.includes('should i take')) {
            return "That's an important question that would be best discussed with Dr. Alen during your consultation. He can review your complete history and provide personalized guidance. In the meantime, I'm happy to share general information about sleep wellness practices.";
        }

        // Sleep hygiene
        if (lowerMessage.includes('hygiene') || lowerMessage.includes('habits') || lowerMessage.includes('tips')) {
            return "Great question! Here are key sleep hygiene practices:\n\n• **Consistent schedule**: Wake up at the same time every day, even weekends\n• **Cool, dark room**: Keep your bedroom at 65-68°F (18-20°C)\n• **No screens before bed**: Avoid phones/tablets for 1 hour before sleep\n• **Limit caffeine**: No caffeine after 2 PM\n• **Wind-down routine**: Create a relaxing 30-60 minute pre-sleep ritual\n\nWould you like more details on any of these?";
        }

        // Circadian rhythm
        if (lowerMessage.includes('circadian') || lowerMessage.includes('body clock') || lowerMessage.includes('internal clock')) {
            return "Your circadian rhythm is your body's internal 24-hour clock that regulates sleep-wake cycles. It's primarily influenced by **light exposure** - morning sunlight helps you wake up, while darkness triggers melatonin production for sleep.\n\nTo support a healthy circadian rhythm:\n• Get bright light within 30 minutes of waking\n• Dim lights in the evening\n• Keep a consistent sleep schedule\n\nWould you like to know more about optimizing your circadian rhythm?";
        }

        // Can't sleep / falling asleep
        if (lowerMessage.includes("can't sleep") || lowerMessage.includes('fall asleep') || lowerMessage.includes('trouble sleeping')) {
            return "Difficulty falling asleep is common and often related to hyperarousal or racing thoughts. Here are some evidence-based techniques:\n\n• **4-7-8 Breathing**: Inhale for 4 counts, hold for 7, exhale for 8\n• **Progressive Muscle Relaxation**: Systematically tense and release muscle groups\n• **The 20-minute rule**: If you can't sleep after 20 minutes, get up and do something relaxing until you feel sleepy\n\nIf this is a persistent issue, I'd recommend discussing it with Dr. Alen for personalized guidance.";
        }

        // Quality
        if (lowerMessage.includes('quality') || lowerMessage.includes('better sleep') || lowerMessage.includes('improve')) {
            return "Improving sleep quality involves several factors:\n\n• **Optimize your environment**: Dark, quiet, cool bedroom\n• **Limit alcohol and heavy meals** close to bedtime\n• **Exercise regularly**, but not within 4 hours of sleep\n• **Manage stress** with relaxation techniques\n• **Reserve your bed for sleep** - this strengthens the mental association\n\nYour assessment results can also highlight specific areas to focus on. Would you like tips on any specific aspect?";
        }

        // Relaxation
        if (lowerMessage.includes('relax') || lowerMessage.includes('calm') || lowerMessage.includes('stress')) {
            return "Relaxation is key to good sleep! Here are proven techniques:\n\n• **Deep breathing**: Slow, diaphragmatic breaths activate your parasympathetic nervous system\n• **Body scan meditation**: Focus attention progressively through your body\n• **Progressive Muscle Relaxation (PMR)**: Systematically tense and release muscles\n• **Guided imagery**: Visualize a peaceful scene in detail\n\nPractice these regularly - they become more effective with time!";
        }

        // Default helpful response
        return "I'd be happy to help with sleep wellness information! I can share tips about:\n\n• Sleep hygiene practices\n• Circadian rhythm and sleep timing\n• Relaxation techniques for better sleep\n• Creating an optimal sleep environment\n• Understanding sleep cycles\n\nWhat would you like to learn about? For any personal health concerns, I'd recommend discussing them with Dr. Alen.";
    },

    // Save chat history to localStorage
    saveHistory() {
        try {
            localStorage.setItem('sleepwellness_chat_history', JSON.stringify(this.messages.slice(-50)));
        } catch (e) {
            console.warn('Could not save chat history');
        }
    },

    // Load chat history from localStorage
    loadHistory() {
        try {
            const saved = localStorage.getItem('sleepwellness_chat_history');
            if (saved) {
                const history = JSON.parse(saved);
                const messagesContainer = document.getElementById('chatbot-messages');
                const welcome = messagesContainer.querySelector('.chatbot-welcome');

                if (history.length > 0 && welcome) {
                    welcome.style.display = 'none';
                    document.getElementById('chatbot-suggestions').style.display = 'none';
                }

                history.forEach(msg => {
                    this.messages.push(msg);
                    const time = new Date(msg.time);
                    const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    const messageDiv = document.createElement('div');
                    messageDiv.className = `chat-message ${msg.role}`;
                    messageDiv.innerHTML = `
                        <div class="message-bubble">${this.formatMessage(msg.content)}</div>
                        <span class="message-time">${timeStr}</span>
                    `;
                    messagesContainer.appendChild(messageDiv);
                });
            }
        } catch (e) {
            console.warn('Could not load chat history');
        }
    },

    // Clear chat history
    clearHistory() {
        this.messages = [];
        localStorage.removeItem('sleepwellness_chat_history');
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.innerHTML = `
            <div class="chatbot-welcome">
                <div class="welcome-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                </div>
                <h4>Welcome!</h4>
                <p>I'm here to help you learn about sleep wellness and healthy sleep habits.</p>
            </div>
        `;
        document.getElementById('chatbot-suggestions').style.display = 'flex';
    }
};

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SleepChatbot.init());
} else {
    SleepChatbot.init();
}

// Make available globally
window.SleepChatbot = SleepChatbot;
