import React, { useState } from 'react';
import './App.css';

const App = () => {
  const API_URL = 'http://localhost:3000';

  const [messages, setMessages] = useState([
    { text: 'Olá, como posso ajudar?', type: 'server' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleMessageSend = async () => {
    if (newMessage.trim() !== '') {
      const userMessage = { text: newMessage, type: 'user' };
      setMessages([...messages, userMessage]);
      messages.push(userMessage);
      setNewMessage('');
      setMessages([...messages, {
        text: '...', type: 'server'
      }]);
      try {
        const response = await fetch(API_URL + '/documents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ request: newMessage }),
        });

        const data = await response.json();

        const text = data.message.replace(/R:/g, ' ').replace(/Resposta:/g, ' ');

        // Handle the response from the server
        const serverMessage = { text, type: 'server' };
        setMessages([...messages, serverMessage]);
      } catch (error) {
        console.log('Error:', error);
      }
    }
  };

  return (
    <div className="chat-app">
      <div className="chat-history">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.type === 'server' ? 'server' : 'user'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Fique a vontade para digitar algo"
        />
        <button onClick={handleMessageSend}>Send</button>
      </div>
    </div>
  );
};

export default App;
