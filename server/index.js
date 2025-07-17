const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock data
const mockConversations = [];
const mockUsers = [
  { id: 1, email: 'demo@deeppuse.com', password: 'demo123', name: 'Demo User' }
];

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    const token = 'mock-jwt-token-' + Date.now();
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (mockUsers.find(u => u.email === email)) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered'
    });
  }
  
  const newUser = {
    id: mockUsers.length + 1,
    email,
    password,
    name: name || email.split('@')[0]
  };
  
  mockUsers.push(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.json({
    success: true,
    token: 'mock-jwt-token-' + Date.now(),
    user: userWithoutPassword
  });
});

// Chat endpoints
app.get('/api/chat/conversations', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token || !token.startsWith('mock-jwt-token')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  
  res.json(mockConversations);
});

app.post('/api/chat/conversations', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token || !token.startsWith('mock-jwt-token')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  
  const { title = 'New Chat' } = req.body;
  
  const newConversation = {
    id: Date.now().toString(),
    title,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockConversations.unshift(newConversation);
  res.json(newConversation);
});

app.get('/api/chat/conversations/:id/messages', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token || !token.startsWith('mock-jwt-token')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  
  const { id } = req.params;
  const conversation = mockConversations.find(c => c.id === id);
  
  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: 'Conversation not found'
    });
  }
  
  res.json(conversation.messages);
});

app.post('/api/chat/message', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token || !token.startsWith('mock-jwt-token')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  
  const { conversationId, message } = req.body;
  
  if (!message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Message is required'
    });
  }
  
  let conversation = mockConversations.find(c => c.id === conversationId);
  
  if (!conversation) {
    conversation = {
      id: conversationId || Date.now().toString(),
      title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockConversations.unshift(conversation);
  }
  
  // Add user message
  const userMessage = {
    id: Date.now().toString(),
    content: message,
    sender: 'user',
    timestamp: new Date().toISOString()
  };
  
  conversation.messages.push(userMessage);
  
  // Generate AI response
  const aiResponses = [
    "That's an interesting question! Let me help you with that.",
    "I understand what you're asking. Here's my perspective:",
    "Great question! Based on my knowledge, I would say:",
    "Let me break this down for you:",
    "I can definitely help with that. Here's what I think:",
    "That's a thoughtful question. Here's my response:",
    "From my understanding, I would suggest:",
    "I appreciate your question. Let me provide some insights:"
  ];
  
  const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
  const aiMessage = {
    id: (Date.now() + 1).toString(),
    content: `${randomResponse}\n\n${message} is a fascinating topic that deserves deeper exploration. I can provide more detailed information if you'd like to continue this conversation.`,
    sender: 'assistant',
    timestamp: new Date().toISOString()
  };
  
  conversation.messages.push(aiMessage);
  conversation.updatedAt = new Date().toISOString();
  
  // Update conversation title if it's still "New Chat"
  if (conversation.title === 'New Chat' && message.length > 5) {
    conversation.title = message.substring(0, 30) + (message.length > 30 ? '...' : '');
  }
  
  res.json({
    success: true,
    response: aiMessage.content,
    conversation: {
      id: conversation.id,
      title: conversation.title,
      updatedAt: conversation.updatedAt
    }
  });
});

app.delete('/api/chat/conversations/:id', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token || !token.startsWith('mock-jwt-token')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  
  const { id } = req.params;
  const index = mockConversations.findIndex(c => c.id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Conversation not found'
    });
  }
  
  mockConversations.splice(index, 1);
  res.json({ success: true });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`DeepPuse server running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
