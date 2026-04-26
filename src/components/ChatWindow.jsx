import React from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import './ChatWindow.css';

const ChatWindow = ({ messages, isTyping }) => (
  <div className="chat-window">
    {messages.map((msg, idx) => (
      <MessageBubble key={idx} message={msg.text} isUser={msg.isUser} />
    ))}
    {isTyping && <TypingIndicator />}
  </div>
);

export default ChatWindow;
