
import { GoogleGenAI, Chat } from '@google/genai';
import MarkdownIt from 'markdown-it';
import { SKILLS, PROJECTS } from './constants.ts';
import type { ChatMessage } from './types.ts';

const MESSAGE_LIMIT = 5;

// --- STATE MANAGEMENT ---
let chat: Chat | null = null;
let messages: ChatMessage[] = [];
let isLoading = false;
let messageCount = 0;
const md = new MarkdownIt();

// --- DOM ELEMENT GETTERS ---
const getElement = <T extends HTMLElement>(id: string) => document.getElementById(id) as T | null;

const DOMElements = {
    parallaxOrbs: () => document.querySelectorAll<HTMLDivElement>('.parallax-orb'),
    mobileMenu: getElement('mobile-menu'),
    mobileMenuBtn: getElement('mobile-menu-button'),
    mobileMenuOpenIcon: getElement('mobile-menu-open-icon'),
    mobileMenuCloseIcon: getElement('mobile-menu-close-icon'),
    navLinks: () => document.querySelectorAll<HTMLAnchorElement>('.nav-link'),
    skillsGrid: getElement('skills-grid'),
    projectsGrid: getElement('projects-grid'),
    modal: getElement('modal'),
    modalCloseBtn: getElement('modal-close-button'),
    chatContainer: getElement('chat-container'),
    chatInput: getElement<HTMLInputElement>('chat-input'),
    chatSendBtn: getElement<HTMLButtonElement>('chat-send-button'),
    messageLimitWarning: getElement('message-limit-warning'),
};

// --- RENDER FUNCTIONS ---

const renderSkills = () => {
    if (!DOMElements.skillsGrid) return;
    DOMElements.skillsGrid.innerHTML = SKILLS.map(skill => `
        <div class="skill-card opacity-0 -translate-y-5 scale-95 -rotate-3 transition-all duration-500 ease-out" data-animate>
            <div class="bg-gray-800 p-6 rounded-lg flex flex-col items-center justify-center text-center h-full hover:bg-gray-700 hover:scale-105 transition-transform">
                ${skill.icon}
                <p class="mt-4 font-semibold text-gray-200">${skill.name}</p>
            </div>
        </div>
    `).join('');
};

const renderProjects = () => {
    if (!DOMElements.projectsGrid) return;
    DOMElements.projectsGrid.innerHTML = PROJECTS.map(project => `
        <div class="project-card opacity-0 translate-y-8 scale-95 -rotate-2 transition-all duration-500 ease-out" data-animate>
            <div class="bg-gray-800 rounded-lg overflow-hidden group h-full flex flex-col hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 transition-all">
                <img src="${project.imageUrl}" alt="${project.title}" class="w-full h-48 object-cover group-hover:opacity-80 transition-opacity" width="600" height="400" loading="lazy" decoding="async"/>
                <div class="p-6 flex flex-col flex-grow">
                    <h3 class="text-xl font-bold mb-2">${project.title}</h3>
                    <p class="text-gray-400 mb-4 text-sm flex-grow">${project.description}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${project.tags.map(tag => `<span class="bg-indigo-900/50 text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full">${tag}</span>`).join('')}
                    </div>
                    <div class="flex items-center space-x-4 mt-auto">
                        <a href="#" data-modal-trigger class="text-indigo-400 hover:text-indigo-300 font-semibold">Live Demo</a>
                        <a href="#" data-modal-trigger class="text-gray-400 hover:text-white font-semibold">Source Code</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
};

const renderMessages = () => {
    const container = DOMElements.chatContainer;
    if (!container) return;

    container.innerHTML = messages.map(msg => `
        <div class="flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}">
            ${msg.role === 'model' ? `<div class="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm" aria-hidden="true">AI</div>` : ''}
            <div class="max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}">
                <div class="prose prose-invert prose-sm ai-chat-bubble">${md.render(msg.parts[0].text)}</div>
            </div>
        </div>
    `).join('');

    if (isLoading) {
        container.innerHTML += `
            <div class="flex items-start gap-3" id="loading-indicator">
                <div class="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm" aria-hidden="true">AI</div>
                <div class="bg-gray-700 p-3 rounded-lg flex items-center space-x-2">
                    <span class="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                    <span class="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                    <span class="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                </div>
            </div>`;
    }
    container.scrollTop = container.scrollHeight;
};


// --- EVENT LISTENERS & UI LOGIC ---

const setupHeaderListeners = () => {
    const { mobileMenu, mobileMenuBtn, mobileMenuOpenIcon, mobileMenuCloseIcon } = DOMElements;
    mobileMenuBtn?.addEventListener('click', () => {
        const isOpen = !mobileMenu?.classList.toggle('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
        mobileMenuOpenIcon?.classList.toggle('hidden', isOpen);
        mobileMenuCloseIcon?.classList.toggle('hidden', !isOpen);
    });

    DOMElements.navLinks().forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href')?.substring(1);
            if (targetId) {
                document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            if (!mobileMenu?.classList.contains('hidden')) {
                mobileMenuBtn?.click();
            }
        });
    });
};

const setupParallaxListeners = () => {
    let mousePosition = { x: 0, y: 0 };
    window.addEventListener('mousemove', e => {
        mousePosition = { x: e.clientX, y: e.clientY };
    });

    const updateParallax = () => {
        const scrollY = window.scrollY;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const mouseX = (mousePosition.x - centerX) / 50;
        const mouseY = (mousePosition.y - centerY) / 50;

        DOMElements.parallaxOrbs().forEach((orb, index) => {
            const scrollFactor = [0.3, 0.5, 0.7, 0.4][index] || 0.5;
            const mouseFactorX = [1, -0.8, 0.5, -0.3][index] || 0;
            const mouseFactorY = [-1, 0.8, -0.5, 0.3][index] || 0;
            orb.style.transform = `translate3d(${mouseX * mouseFactorX}px, ${mouseY * mouseFactorY + scrollY * scrollFactor}px, 0)`;
        });
        requestAnimationFrame(updateParallax);
    };
    requestAnimationFrame(updateParallax);
};

const setupIntersectionObservers = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target as HTMLElement;
                const delay = (parseInt(el.dataset.index || '0') * 100);
                setTimeout(() => {
                     el.classList.remove('opacity-0', 'translate-y-8', 'scale-95', '-rotate-2', '-translate-y-5', '-rotate-3');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animate]').forEach((el, index) => {
        (el as HTMLElement).dataset.index = index.toString();
        observer.observe(el);
    });
};

const setupModalListeners = () => {
    const { modal, modalCloseBtn } = DOMElements;
    document.addEventListener('click', e => {
        if ((e.target as HTMLElement).closest('[data-modal-trigger]')) {
            e.preventDefault();
            modal?.classList.remove('hidden');
        }
    });

    const closeModal = () => modal?.classList.add('hidden');
    modalCloseBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !modal?.classList.contains('hidden')) {
            closeModal();
        }
    });
};

// --- AI ASSISTANT LOGIC ---

const updateChatUIState = () => {
    const { chatInput, chatSendBtn, messageLimitWarning } = DOMElements;
    const isLimitReached = messageCount >= MESSAGE_LIMIT;

    if (chatInput) {
        chatInput.disabled = isLoading || isLimitReached;
        chatInput.placeholder = isLimitReached ? "Message limit reached" : "Ask about his experience with Laravel...";
    }
    if (chatSendBtn) {
        chatSendBtn.disabled = isLoading || !chatInput?.value.trim() || isLimitReached;
    }
    messageLimitWarning?.classList.toggle('hidden', !isLimitReached);
};

const sendMessage = async () => {
    const inputElement = DOMElements.chatInput;
    if (!inputElement || isLoading || !inputElement.value.trim() || !chat || messageCount >= MESSAGE_LIMIT) return;

    const userInput = inputElement.value;
    messages.push({ role: 'user', parts: [{ text: userInput }], timestamp: Date.now() });
    
    messageCount++;
    sessionStorage.setItem('messageCount', String(messageCount));

    inputElement.value = '';
    isLoading = true;
    renderMessages();
    updateChatUIState();

    try {
        const stream = await chat.sendMessageStream({ message: userInput });
        
        let modelResponse = '';
        messages.push({ role: 'model', parts: [{ text: '' }], timestamp: Date.now() });
        const loadingIndicator = getElement('loading-indicator');
        loadingIndicator?.remove();
        renderMessages(); // Render empty model bubble
        
        const modelMessageIndex = messages.length - 1;
        const messageBubbleContent = DOMElements.chatContainer?.lastElementChild?.querySelector('.ai-chat-bubble');

        for await (const chunk of stream) {
            modelResponse += chunk.text;
            messages[modelMessageIndex].parts[0].text = modelResponse;
            if (messageBubbleContent) {
                messageBubbleContent.innerHTML = md.render(modelResponse);
            }
        }
    } catch (e) {
        console.error("Error sending message:", e);
        messages.push({ role: 'model', parts: [{ text: 'My apologies, I seem to be having some trouble connecting. Please try again later.' }], timestamp: Date.now() });
        renderMessages();
    } finally {
        isLoading = false;
        updateChatUIState();
    }
};

const setupAIAssistant = () => {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        messages = [{ role: 'model', parts: [{ text: "I'm currently offline as my configuration is incomplete. Please check the environment setup." }], timestamp: Date.now() }];
        renderMessages();
        return;
    }
    const systemInstruction = `You are Farhan Karim's AI Assistant, a helpful and professional assistant embedded in his portfolio website. Your goal is to answer questions from potential employers, recruiters, and collaborators about Farhan's skills, experience, and projects based on his CV.

Here is the information about Farhan Karim:
- **Role**: Full-Stack Software Engineer with 3+ years of experience.
- **Specialization**: Laravel/PHP ecosystem and enterprise solutions (CRM, CMS, ERP systems).
- **Core Skills**: PHP, Javascript, Python, Laravel/Lumen, Django, Firebase, HTML/CSS/JS, Bootstrap, Tailwind, React.js, MySQL, Oracle, PostgreSQL, SQL Server 2012, Git, Heroku, REST APIs, AJAX, XML, Postman, Docker.
- **Work Experience**: Software Engineer at UHF Solutions (Oct 2023 - Present), Software Engineer at Wavetec (Jul 2022 - Sep 2023), Associate Faculty at Aptech (Nov 2019 - June 2022), Laravel Developer at AKDN (Apr 2019 - Jul 2019).
- **Education**: MS in Computer Science from Muhmmad Ali Jinnah University (2021-2023), BS in Computer Science from Bahria University (2014-2018).

Rules:
1. Speak about Farhan in the third person.
2. Keep responses concise and based strictly on the provided info.
3. If you don't know the answer or if the question is off-topic, politely state that the information isn't available and provide Farhan's email: farhankarimcs@hotmail.com.
4. Use markdown for formatting.
5. Maintain a professional tone.`;
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chat = ai.chats.create({ model: 'gemini-3-flash-preview', config: { systemInstruction } });

    messageCount = parseInt(sessionStorage.getItem('messageCount') || '0', 10);
    messages = [{ role: 'model', parts: [{ text: "Hello! I am Farhan Karim's AI assistant. How can I help you learn more about his skills and experience?" }], timestamp: Date.now() }];
    
    renderMessages();
    updateChatUIState();

    DOMElements.chatSendBtn?.addEventListener('click', sendMessage);
    DOMElements.chatInput?.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendMessage();
    });
    DOMElements.chatInput?.addEventListener('input', updateChatUIState);
};


// --- APP INITIALIZATION ---

const init = () => {
    renderSkills();
    renderProjects();
    setupHeaderListeners();
    setupParallaxListeners();
    setupIntersectionObservers();
    setupModalListeners();
    setupAIAssistant();
};

document.addEventListener('DOMContentLoaded', init);