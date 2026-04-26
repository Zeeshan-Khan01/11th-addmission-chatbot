import React from 'react';
import './InputBox.css';

const InputBox = ({ value, onChange, onSend, disabled }) => (
  <div className="input-box">
    <input
      type="text"
      placeholder="Type your message..."
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter' && !disabled) onSend();
      }}
      disabled={disabled}
    />
    <button onClick={onSend} disabled={disabled || !value.trim()} className="send-btn">Send</button>
  </div>
);

export default InputBox;
