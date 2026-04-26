import React from 'react';
import './MessageBubble.css';

const MessageBubble = ({ message, isUser }) => (
  <div className={`message-bubble ${isUser ? 'user' : 'bot'}`}>
    {message}
  </div>
);

export default MessageBubble;
