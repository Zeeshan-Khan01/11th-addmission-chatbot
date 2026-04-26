import React from 'react';
import './Sidebar.css';


const Sidebar = ({ chats, onSelectChat, onNewChat, selectedChatId }) => (
  <aside className="sidebar">
    <div className="sidebar-header">
      <div className="sidebar-title">11th & 12th Student Chatbot</div>
      <button className="new-chat-btn" onClick={onNewChat}>+ New Chat</button>
    </div>
    <ul className="chat-history">
      {chats.map(chat => (
        <li
          key={chat.id}
          className={chat.id === selectedChatId ? 'active' : ''}
          onClick={() => onSelectChat(chat.id)}
        >
          {chat.title}
        </li>
      ))}
    </ul>
  </aside>
);

export default Sidebar;
