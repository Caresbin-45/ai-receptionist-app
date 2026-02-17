const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting middleware to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory storage for user preferences, orders, and problems
const userPreferences = new Map();
const orders = [];
const problems = [];
let orderIdCounter = 1;
let problemIdCounter = 1;

// AI Receptionist class
class AIReceptionist {
  constructor() {
    this.greetings = [
      "Hello! I'm your AI receptionist. How may I assist you today?",
      "Good day! I'm here to help you with any questions or concerns.",
      "Welcome! How can I be of service to you today?"
    ];
  }

  greet() {
    return this.greetings[Math.floor(Math.random() * this.greetings.length)];
  }

  analyzeMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for thanks first (highest priority for gratitude)
    if (this.isThanks(lowerMessage)) {
      return { type: 'thanks', confidence: 0.9 };
    }
    
    // Check for problem/complaint
    if (this.isProblemReport(lowerMessage)) {
      return { type: 'problem', confidence: 0.85 };
    }
    
    // Check for order-related messages
    if (this.isOrderRelated(lowerMessage)) {
      return { type: 'order', confidence: 0.9 };
    }
    
    // Check for preference-related queries
    if (this.isPreferenceQuery(lowerMessage)) {
      return { type: 'preference', confidence: 0.85 };
    }
    
    // Check for greeting
    if (this.isGreeting(lowerMessage)) {
      return { type: 'greeting', confidence: 0.9 };
    }
    
    return { type: 'general', confidence: 0.5 };
  }

  isGreeting(message) {
    const greetingPatterns = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
    return greetingPatterns.some(pattern => message.includes(pattern));
  }

  isPreferenceQuery(message) {
    const preferencePatterns = ['preference', 'prefer', 'like', 'favorite', 'favourite', 'settings', 'my choice'];
    return preferencePatterns.some(pattern => message.includes(pattern));
  }

  isOrderRelated(message) {
    const orderPatterns = ['order', 'purchase', 'buy', 'booking', 'book', 'appointment', 'reserve', 'reservation'];
    return orderPatterns.some(pattern => message.includes(pattern));
  }

  isProblemReport(message) {
    const problemPatterns = ['problem', 'issue', 'complaint', 'error', 'wrong', 'not working', 'broken', 'help', 'trouble'];
    return problemPatterns.some(pattern => message.includes(pattern));
  }

  isThanks(message) {
    const thanksPatterns = ['thank', 'thanks', 'appreciate'];
    return thanksPatterns.some(pattern => message.includes(pattern));
  }

  generateResponse(messageType, message, userId) {
    switch (messageType) {
      case 'greeting':
        return this.handleGreeting();
      
      case 'preference':
        return this.handlePreference(message, userId);
      
      case 'order':
        return this.handleOrder(message, userId);
      
      case 'problem':
        return this.handleProblem(message, userId);
      
      case 'thanks':
        return this.handleThanks();
      
      default:
        return this.handleGeneral(message);
    }
  }

  handleGreeting() {
    return {
      response: this.greet(),
      suggestions: [
        "Tell me about your preferences",
        "I'd like to place an order",
        "I need help with a problem"
      ]
    };
  }

  handlePreference(message, userId) {
    const lowerMessage = message.toLowerCase();
    
    // Check if user is asking about their preferences
    if (lowerMessage.includes('what') || lowerMessage.includes('my') || lowerMessage.includes('show')) {
      const prefs = userPreferences.get(userId);
      if (prefs && Object.keys(prefs).length > 0) {
        const prefList = Object.entries(prefs)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        return {
          response: `Here are your current preferences: ${prefList}. Would you like to update any of them?`,
          suggestions: ["Update preferences", "That's all for now"]
        };
      } else {
        return {
          response: "I don't have any preferences stored for you yet. Would you like to set some preferences?",
          suggestions: ["Yes, set my preferences", "Not right now"]
        };
      }
    }
    
    // If user is setting preferences
    return {
      response: "I'd be happy to help you set your preferences. Could you please tell me what you'd like me to remember? For example, 'I prefer morning appointments' or 'My favorite color is blue'.",
      suggestions: ["I prefer morning appointments", "Save that preference"]
    };
  }

  handleOrder(message, userId) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('place') || lowerMessage.includes('make') || lowerMessage.includes('create')) {
      return {
        response: "I'd be delighted to help you place an order. Could you please provide details about what you'd like to order?",
        suggestions: ["Book an appointment", "Order a service", "Reserve a time slot"]
      };
    }
    
    if (lowerMessage.includes('status') || lowerMessage.includes('check') || lowerMessage.includes('view')) {
      const userOrders = orders.filter(order => order.userId === userId);
      if (userOrders.length > 0) {
        const orderList = userOrders.map((order, idx) => 
          `Order ${idx + 1}: ${order.description} (Status: ${order.status})`
        ).join('\n');
        return {
          response: `Here are your orders:\n${orderList}`,
          suggestions: ["Place a new order", "That's all"]
        };
      } else {
        return {
          response: "You don't have any orders yet. Would you like to place one?",
          suggestions: ["Yes, place an order", "Not right now"]
        };
      }
    }
    
    return {
      response: "I can help you with orders, bookings, and appointments. What would you like to do?",
      suggestions: ["Place a new order", "Check order status", "Cancel an order"]
    };
  }

  handleProblem(message, userId) {
    const lowerMessage = message.toLowerCase();
    
    // Express empathy and willingness to help
    const empathyResponses = [
      "I'm sorry to hear that you're experiencing an issue. I'm here to help resolve it.",
      "I understand your concern, and I apologize for any inconvenience. Let me assist you with this.",
      "Thank you for bringing this to my attention. I'll do my best to help you resolve this problem."
    ];
    
    const empathyResponse = empathyResponses[Math.floor(Math.random() * empathyResponses.length)];
    
    return {
      response: `${empathyResponse} Could you please provide more details about the problem you're facing?`,
      suggestions: ["Describe the issue", "Request human assistance", "View problem history"]
    };
  }

  handleThanks() {
    const responses = [
      "You're very welcome! Is there anything else I can help you with?",
      "My pleasure! Please don't hesitate to reach out if you need anything else.",
      "Happy to help! Feel free to contact me anytime you need assistance."
    ];
    
    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      suggestions: ["I have another question", "That's all for now"]
    };
  }

  handleGeneral(message) {
    return {
      response: "I understand. I'm here to help you with user preferences, orders, appointments, and any problems you might have. Could you please tell me more about what you need?",
      suggestions: [
        "Tell me about preferences",
        "Help with an order",
        "Report a problem"
      ]
    };
  }
}

const receptionist = new AIReceptionist();

// API Routes
app.post('/api/chat', (req, res) => {
  const { message, userId = 'default-user' } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  try {
    const analysis = receptionist.analyzeMessage(message);
    const response = receptionist.generateResponse(analysis.type, message, userId);
    
    res.json({
      success: true,
      analysis,
      ...response
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

app.post('/api/preferences', (req, res) => {
  const { userId = 'default-user', preferences } = req.body;
  
  if (!preferences || typeof preferences !== 'object') {
    return res.status(400).json({ error: 'Preferences object is required' });
  }
  
  const existingPrefs = userPreferences.get(userId) || {};
  const updatedPrefs = { ...existingPrefs, ...preferences };
  userPreferences.set(userId, updatedPrefs);
  
  res.json({
    success: true,
    message: 'Preferences saved successfully',
    preferences: updatedPrefs
  });
});

app.get('/api/preferences/:userId', (req, res) => {
  const { userId } = req.params;
  const preferences = userPreferences.get(userId) || {};
  
  res.json({
    success: true,
    preferences
  });
});

app.post('/api/orders', (req, res) => {
  const { userId = 'default-user', description, details } = req.body;
  
  if (!description) {
    return res.status(400).json({ error: 'Order description is required' });
  }
  
  const order = {
    id: orderIdCounter++,
    userId,
    description,
    details,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  orders.push(order);
  
  res.json({
    success: true,
    message: 'Order placed successfully',
    order
  });
});

app.get('/api/orders/:userId', (req, res) => {
  const { userId } = req.params;
  const userOrders = orders.filter(order => order.userId === userId);
  
  res.json({
    success: true,
    orders: userOrders
  });
});

app.post('/api/problems', (req, res) => {
  const { userId = 'default-user', description, priority = 'normal' } = req.body;
  
  if (!description) {
    return res.status(400).json({ error: 'Problem description is required' });
  }
  
  const problem = {
    id: problemIdCounter++,
    userId,
    description,
    priority,
    status: 'open',
    createdAt: new Date().toISOString()
  };
  
  problems.push(problem);
  
  res.json({
    success: true,
    message: 'Problem reported successfully. We will address it as soon as possible.',
    problem
  });
});

app.get('/api/problems/:userId', (req, res) => {
  const { userId } = req.params;
  const userProblems = problems.filter(problem => problem.userId === userId);
  
  res.json({
    success: true,
    problems: userProblems
  });
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`AI Receptionist server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to interact with the receptionist`);
});

module.exports = app;
