
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import InputBox from './components/InputBox';
import OnboardingForm from './components/OnboardingForm';
import './App.css';

const LOCAL_STORAGE_KEY = 'chatbot_chats';
const ONBOARDING_KEY = 'chatbot_onboarding';
const defaultBotWelcome = 'Hi! I am your 11th & 12th Student Chatbot. How can I help you today?';

const App = () => {
  const [onboarding, setOnboarding] = useState(() => {
    const saved = localStorage.getItem(ONBOARDING_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedChatId, setSelectedChatId] = useState(() => chats[0]?.id || null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (onboarding) {
      localStorage.setItem(ONBOARDING_KEY, JSON.stringify(onboarding));
    }
  }, [onboarding]);

  const getCurrentChat = () => chats.find(c => c.id === selectedChatId);

  const handleOnboardingComplete = (answers) => {
    setOnboarding(answers);
    if (chats.length === 0) {
      const newChat = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [
          { text: defaultBotWelcome, isUser: false }
        ],
        created: Date.now(),
        onboarding: answers,
      };
      setChats([newChat]);
      setSelectedChatId(newChat.id);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const chatIdx = chats.findIndex(c => c.id === selectedChatId);
    if (chatIdx === -1) return;
    const userMsg = { text: input, isUser: true };
    const updatedChats = [...chats];
    updatedChats[chatIdx].messages.push(userMsg);
    setChats(updatedChats);
    setInput('');
    setIsTyping(true);
    // Call Google AI API
    try {
      const botReply = await fetchBotReply(input, onboarding, updatedChats[chatIdx].messages);
      updatedChats[chatIdx].messages.push({ text: botReply, isUser: false });
      setChats([...updatedChats]);
    } catch (e) {
      updatedChats[chatIdx].messages.push({ text: 'Sorry, there was an error. Please try again.', isUser: false });
      setChats([...updatedChats]);
    }
    setIsTyping(false);
  };

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: `Chat ${chats.length + 1}`,
      messages: [
        { text: defaultBotWelcome, isUser: false }
      ],
      created: Date.now(),
      onboarding,
    };
    setChats([newChat, ...chats]);
    setSelectedChatId(newChat.id);
  };

  const handleSelectChat = (id) => {
    setSelectedChatId(id);
  };

  // Backend API integration
  const fetchBotReply = async (userInput, onboarding, messages) => {
    // Check if the question is out of scope
    const allowedTopics = [
      'admission', 'stream', 'subject', 'career', 'study', 'school', '11th', '12th', 'student', 'class', 'guidance', 'tips', 'exam', 'board', 'syllabus', 'college', 'after 12th', 'after 11th', 'stream selection', 'subject selection', 'career guidance', 'study planning', 'student support', 'school doubts'
    ];
    const lowerInput = userInput.toLowerCase();
    const isRelevant = allowedTopics.some(topic => lowerInput.includes(topic));
    if (!isRelevant) {
      return 'Sorry, I can only help with academic and career guidance for 11th and 12th grade students.';
    }
    // Compose prompt for Gemini
    const prompt = `You are a helpful, friendly chatbot for 11th and 12th grade students. Only answer questions related to academic and career guidance for 11th and 12th students. If the question is not related, politely refuse.\n\nStudent info: Class: ${onboarding.class}, Stream: ${onboarding.stream}, Needs: ${onboarding.help}.\n\nChat history:\n${messages.map(m => (m.isUser ? 'Student: ' : 'Bot: ') + m.text).join('\n')}\n\nStudent: ${userInput}\nBot:`;
    // Call backend server
    const res = await fetch('http://localhost:5001/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.reply || 'Sorry, I could not generate a response.';
  };

  if (!onboarding) {
    return <OnboardingForm onComplete={handleOnboardingComplete} />;
  }

  const currentChat = getCurrentChat();

  return (
    <div className="app-container">
      <div className="main-content">
        <Sidebar
          chats={chats}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          selectedChatId={selectedChatId}
        />
        <div className="chat-section">
          <ChatWindow messages={currentChat?.messages || []} isTyping={isTyping} />
          <InputBox
            value={input}
            onChange={setInput}
            onSend={handleSend}
            disabled={isTyping || !currentChat}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
