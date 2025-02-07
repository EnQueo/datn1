import React from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import './chatForm.css'; 

const ChatForm = ({ messages, setMessages, input, setInput, sendMessage, headerText }) => {
  return (
    <div className="chatbot-form">
      <div className="chatbot-header">
        <p>{headerText || 'Chatbot auto response'}</p>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'user-message' : 'bot-message'}>
            <p><b>{msg.sender === 'user' ? 'You:' : 'Bot:'}</b> {msg.text}</p>
          </div>
        ))}
      </div>

      <div className="chatbot-input-wrapper">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="chatbot-input"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="chatbot-send-btn">
          <FaPaperPlane size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatForm;
