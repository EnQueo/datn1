import React, { useState } from 'react';
import { FaComments } from 'react-icons/fa';
import ChatForm from './chatForm.jsx'; 
import './chatBot.css'; 

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setInput('');
  };

  const toggleChatbot = () => setIsVisible(!isVisible);

  return (
    <>
      <div
        onClick={toggleChatbot}
        className="chatbot-icon"
      >
        <FaComments />
      </div>

      {isVisible && (
        <ChatForm
          messages={messages}
          setMessages={setMessages}
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
        />
      )}
    </>
  );
};

export default Chatbot;
