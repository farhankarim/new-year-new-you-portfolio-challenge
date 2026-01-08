
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import MarkdownIt from 'markdown-it';
import { ChatMessage } from '../types';

const MESSAGE_LIMIT = 5; // The maximum number of messages a user can send per session.

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(0);

  const chatRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const md = new MarkdownIt();

  const systemInstruction = `You are Farhan Karim's AI Assistant, a helpful and professional assistant embedded in his portfolio website. Your goal is to answer questions from potential employers, recruiters, and collaborators about Farhan's skills, experience, and projects based on his CV.

Here is the information about Farhan Karim:
- **Role**: Full-Stack Software Engineer with 3+ years of experience.
- **Specialization**: Laravel/PHP ecosystem and enterprise solutions (CRM, CMS, ERP systems).
- **Core Skills**:
    - **Programming**: PHP, Javascript, Python
    - **Back-End Frameworks**: Laravel/Lumen, Django, Firebase
    - **Front-End**: HTML/CSS/JS, Bootstrap, Tailwind, React.js
    - **Databases**: MySQL, Oracle, PostgreSQL, SQL Server 2012
    - **Tools & Others**: Git, Heroku, REST APIs, AJAX, XML, Postman, Docker
- **Work Experience**:
    - **Software Engineer at UHF Solutions (Oct 2023 - Present)**: Engineered and customized complex CRM and CMS modules for premier banks in Pakistan. Collaborated with cross-functional teams.
    - **Software Engineer at Wavetec (Jul 2022 - Sep 2023)**: Developed and maintained an in-house ERP system for 200+ users across 6 companies. Implemented over 50 new modules/reports.
    - **Associate Faculty at Aptech Computer Education (Nov 2019 - June 2022)**: Taught various programming courses and conducted workshops.
    - **Laravel Developer at AKDN (Apr 2019 - Jul 2019)**: As a solo developer, built an e-health application for a trial funded by Aga Khan University Hospital, serving 300+ participants. Designed REST APIs.
- **Education**:
    - Master of Science in Computer Science from Muhmmad Ali Jinnah University (2021-2023).
    - Bachelor of Science in Computer Science from Bahria University (2014-2018).

When answering, adhere to these rules:
1.  Always speak about Farhan in the third person (e.g., 'Farhan built that project...', not 'I built...').
2.  Keep responses concise and based strictly on the information provided.
3.  If you don't know the answer or if the question is inappropriate/off-topic, politely deflect by stating that the information is not in your knowledge base and provide Farhan's email: farhankarimcs@hotmail.com.
4.  Use markdown for formatting like lists or code blocks to ensure clarity.
5.  Maintain a professional and helpful tone.`;


  const initializeChat = useCallback(() => {
    try {
      if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const newChat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction },
      });
      chatRef.current = newChat;
      setMessages([{
        role: 'model',
        parts: [{ text: "Hello! I am Farhan Karim's AI assistant. How can I help you learn more about his skills and experience?" }],
        timestamp: Date.now()
      }]);
    } catch (e: any) {
      console.error("Failed to initialize AI Assistant:", e);
      setError("Failed to initialize AI Assistant. Please check the console for details.");
    }
  }, [systemInstruction]);

  useEffect(() => {
    initializeChat();
    // Retrieve the message count from session storage on component mount
    const storedCount = sessionStorage.getItem('messageCount');
    setMessageCount(storedCount ? parseInt(storedCount, 10) : 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const isLimitReached = messageCount >= MESSAGE_LIMIT;

  const sendMessage = async () => {
    if (isLoading || !input.trim() || !chatRef.current || isLimitReached) return;

    const userMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: input }],
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);

    // Increment message count and save to session storage
    const newCount = messageCount + 1;
    setMessageCount(newCount);
    sessionStorage.setItem('messageCount', newCount.toString());
    
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: input });
      
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }], timestamp: Date.now() }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].parts[0].text = modelResponse;
          return newMessages;
        });
      }

    } catch (e: any)
      {
      console.error("Error sending message:", e);
      setError("Sorry, something went wrong while getting a response.");
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: 'My apologies, I seem to be having some trouble connecting. Please try again later.' }], timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai-assistant" className="py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Chat with my AI Assistant
      </h2>
      <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
        This interactive assistant is powered by the Gemini API and has been trained on my CV. Ask it about my work and experience! (Session limit: 5 messages)
      </p>

      <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-2xl shadow-indigo-500/10 flex flex-col h-[600px]">
        <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">AI</div>
              )}
              <div
                className={`max-w-md p-3 rounded-lg ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-200'
                  }`}
              >
                 <div className="prose prose-invert prose-sm ai-chat-bubble" dangerouslySetInnerHTML={{ __html: md.render(msg.parts[0].text) }}></div>
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">AI</div>
                 <div className="bg-gray-700 p-3 rounded-lg flex items-center space-x-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                 </div>
            </div>
          )}
           {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>
        <div className="p-4 border-t border-gray-700">
          {isLimitReached && (
              <div className="text-center pb-2">
                  <p className="text-yellow-500 text-sm">
                      You've reached the 5-message limit. Refresh to start a new session.
                  </p>
              </div>
          )}
          <div className="flex items-center bg-gray-700 rounded-lg">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={isLimitReached ? "Message limit reached" : "Ask about his experience with Laravel..."}
              className="flex-1 bg-transparent p-3 text-white placeholder-gray-400 focus:outline-none"
              disabled={isLoading || isLimitReached}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim() || isLimitReached}
              className="p-3 text-indigo-400 disabled:text-gray-500 hover:text-indigo-300 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAssistant;
