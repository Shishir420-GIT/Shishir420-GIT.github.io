// AI Chatbot Manager
export class ChatbotManager {
    constructor() {
        this.isInitialized = false;
        this.chatHistory = [];
        this.isTyping = false;
        this.apiKey = null;
    }

    // Initialize chatbot only if API key is available
    async init() {
        // Check for API key in environment or config
        this.apiKey = this.getApiKey();
        
        if (!this.apiKey) {
            console.log('No API key found - Chatbot disabled');
            this.hideChatbot();
            return;
        }

        const chatContainer = document.getElementById('chat-container');
        const chatToggle = document.getElementById('chat-toggle');
        const chatWidget = document.getElementById('chat-widget');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const chatMessages = document.getElementById('chat-messages');
        const aiCloud = document.querySelector('.ai-cloud');

        if (!chatContainer || !chatToggle || !chatWidget) {
            console.warn('Chat elements not found');
            return;
        }

        // Show chatbot
        chatContainer.style.display = 'block';

        // Cloud click functionality
        const toggleChat = () => {
            chatToggle.classList.toggle('active');
            chatWidget.classList.toggle('active');
            
            // Hide cloud when chat opens
            if (chatWidget.classList.contains('active')) {
                chatInput.focus();
                if (aiCloud) {
                    aiCloud.style.opacity = '0';
                    aiCloud.style.visibility = 'hidden';
                    aiCloud.style.transform = 'translateY(10px) scale(0.8)';
                }
            } else {
                // Show cloud again when chat closes (with delay)
                if (aiCloud) {
                    setTimeout(() => {
                        aiCloud.style.opacity = '1';
                        aiCloud.style.visibility = 'visible';
                        aiCloud.style.transform = 'translateY(0) scale(1)';
                    }, 500);
                }
            }
        };

        chatToggle.addEventListener('click', toggleChat);
        
        // Make cloud clickable to open chat
        if (aiCloud) {
            aiCloud.addEventListener('click', () => {
                if (!chatWidget.classList.contains('active')) {
                    toggleChat();
                }
            });
        }

        // Chat functionality
        const sendMessage = async (message) => {
            if (this.isTyping) return;
            
            // Add user message
            this.addMessage(message, 'user');
            chatInput.value = '';
            chatSend.disabled = true;
            
            // Show typing indicator
            this.showTypingIndicator();
            
            try {
                const response = await this.callAPI(message, this.chatHistory);
                
                this.hideTypingIndicator();
                this.addMessage(response, 'bot');
                
                // Update chat history
                this.chatHistory.push(
                    { role: 'user', text: message },
                    { role: 'model', text: response }
                );
                
            } catch (error) {
                this.hideTypingIndicator();
                this.addMessage('> ERROR: Connection failed. Please try again.', 'bot');
            }
            
            chatSend.disabled = false;
        };

        chatSend.addEventListener('click', () => {
            const message = chatInput.value.trim();
            if (message) {
                sendMessage(message);
            }
        });

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const message = chatInput.value.trim();
                if (message) {
                    sendMessage(message);
                }
            }
        });

        this.isInitialized = true;
        console.log('Chatbot initialized successfully');
    }

    // Get API key from environment variables or config
    getApiKey() {
        // Check for Vercel environment variables (injected at build time)
        if (typeof window !== 'undefined') {
            // Vercel injects environment variables as window.ENV
            if (window.ENV && (window.ENV.GEMINI_API_KEY || window.ENV.OPENAI_API_KEY)) {
                return window.ENV.GEMINI_API_KEY || window.ENV.OPENAI_API_KEY;
            }
            
            // Fallback: Check for direct window properties (less secure)
            if (window.GEMINI_API_KEY || window.OPENAI_API_KEY) {
                return window.GEMINI_API_KEY || window.OPENAI_API_KEY;
            }
        }
        
        // For local development with Node.js environment
        if (typeof process !== 'undefined' && process.env) {
            return process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
        }
        
        // Security: No API key found - chatbot will be disabled
        console.log('🔒 Security: No API key found. Chatbot disabled for security.');
        return null;
    }
    // Hide chatbot if no API key
    hideChatbot() {
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            chatContainer.style.display = 'none';
        }
    }

    // Call AI API (mock for now, replace with actual API)
    async callAPI(message, history) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Mock responses based on keywords
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('नमस्ते')) {
            return `> GREETING PROTOCOL ACTIVATED\n> Hello! I am Shishir's AI assistant\n> नमस्ते! मैं शिशिर का AI सहायक हूं\n> How can I help you today?`;
        } else if (lowerMessage.includes('project')) {
            return `> ACCESSING PROJECT DATABASE...\n> Shishir has worked on various AI/ML projects:\n• Manzil café - Virtual Space\n• Automation generator using AI\n• RAG-based knowledge retrieval systems\n• CRM data filling automation\n> Which project interests you most?`;
        } else if (lowerMessage.includes('skill') || lowerMessage.includes('technology')) {
            return `> SCANNING TECH STACK...\n> Primary technologies:\n• Python, JavaScript, TypeScript\n• AI/ML: Generative AI, LangChain, RAG\n• Cloud: AWS, Azure, GCP, OCI\n• Databases: MongoDB, MySQL\n> Specialization: Generative AI and automation`;
        } else if (lowerMessage.includes('experience')) {
            return `> RETRIEVING WORK HISTORY...\n> Current: Senior Technology Consultant II at EY GDS\n> Previous: Senior Python Developer at Wipro (4+ years)\n> Focus: AI/ML solutions, cloud automation, DevOps\n> Achievement: 30-40% reduction in resolution times`;
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('connect')) {
            return `> CONTACT PROTOCOLS AVAILABLE:\n• LinkedIn: Professional networking\n• GitHub: Code repositories\n• X (Twitter): Tech updates\n• YouTube: Technical content\n> Preferred method: LinkedIn for professional inquiries`;
        } else {
            return `> PROCESSING QUERY...\n> I can provide information about Shishir's:\n• Technical skills and expertise\n• Professional experience\n• Projects and achievements\n• Contact information\n> Please specify what you'd like to know!`;
        }
    }

    addMessage(text, sender) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = text.replace(/\\n/g, '<br>');
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        this.isTyping = true;
        const chatMessages = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message typing';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}