const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route to handle chat messages
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4', // or the model you are using
        messages: [{ role: 'user', content: userMessage }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const botReply = response.data.choices[0].message.content.trim();
    res.json({ reply: botReply });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error.response ? error.response.data : error.message);
    res.status(500).json({ reply: 'Sorry, there was an error processing your request.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const response = await fetch('https://api.openai.com/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: userInput })
  });
  async function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput === '') return;
  
    appendMessage('You', userInput);
    document.getElementById('user-input').value = '';
  
    // Show loading indicator
    appendMessage('ChatGPT', 'Typing...');
  
    // Send to back-end
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userInput })
    });
  
    const data = await response.json();
    // Remove loading indicator
    const messagesDiv = document.getElementById('messages');
    messagesDiv.removeChild(messagesDiv.lastChild);
    
    appendMessage('ChatGPT', data.reply);
  }
  const conversations = {}; // key: sessionId, value: messages array

  app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const sessionId = req.body.sessionId; // Generate and send a sessionId from front-end
  
    if (!conversations[sessionId]) {
      conversations[sessionId] = [{ role: 'system', content: 'You are a helpful assistant.' }];
    }
  
    conversations[sessionId].push({ role: 'user', content: userMessage });
  
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: conversations[sessionId],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
  
      const botReply = response.data.choices[0].message.content.trim();
      conversations[sessionId].push({ role: 'assistant', content: botReply });
  
      res.json({ reply: botReply });
    } catch (error) {
      console.error('Error communicating with OpenAI:', error.response ? error.response.data : error.message);
      res.status(500).json({ reply: 'Sorry, there was an error processing your request.' });
    }
  });
      