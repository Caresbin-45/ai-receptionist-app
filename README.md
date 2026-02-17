# AI Receptionist Application

AI Receptionist is a web-based virtual assistant that handles customer interactions, manages user preferences, processes orders, and respectfully addresses problems and concerns using AI-driven conversation.

## Features

### 🤖 Intelligent Conversation Handling
- Natural language understanding to identify user intent
- Context-aware responses for greetings, questions, and requests
- Professional and respectful communication style

### ⚙️ User Preferences Management
- Store and retrieve user preferences
- Personalized recommendations based on saved preferences
- Easy preference updates through natural conversation

### 📦 Order Management
- Place new orders through conversational interface
- Track order status and history
- View all past and current orders

### 🔧 Problem Resolution
- Empathetic problem reporting and handling
- Priority-based problem tracking
- Respectful and professional issue management

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Caresbin-45/ai-receptionist-app.git
cd ai-receptionist-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Chat Interface
The main chat interface allows you to interact with the AI receptionist naturally. Simply type your message and the receptionist will:
- Understand your intent (greeting, preference query, order, problem, etc.)
- Provide appropriate responses
- Offer helpful suggestions for next steps

### Example Conversations

**Setting Preferences:**
```
You: I prefer morning appointments
Receptionist: I've noted that you prefer morning appointments. I'll remember this for future bookings.
```

**Placing Orders:**
```
You: I'd like to book an appointment for next Tuesday
Receptionist: I'd be delighted to help you book an appointment. Could you provide more details about the time and service you need?
```

**Reporting Problems:**
```
You: I have a problem with my recent booking
Receptionist: I'm sorry to hear that you're experiencing an issue. I'm here to help resolve it. Could you please provide more details?
```

### API Endpoints

The application provides the following REST API endpoints:

#### Chat
- `POST /api/chat` - Send a message to the receptionist
  ```json
  {
    "message": "Hello",
    "userId": "user-123"
  }
  ```

#### Preferences
- `POST /api/preferences` - Save user preferences
  ```json
  {
    "userId": "user-123",
    "preferences": {
      "appointmentTime": "morning",
      "favoriteColor": "blue"
    }
  }
  ```
- `GET /api/preferences/:userId` - Get user preferences

#### Orders
- `POST /api/orders` - Create a new order
  ```json
  {
    "userId": "user-123",
    "description": "Book appointment",
    "details": {}
  }
  ```
- `GET /api/orders/:userId` - Get user orders

#### Problems
- `POST /api/problems` - Report a problem
  ```json
  {
    "userId": "user-123",
    "description": "Issue with booking",
    "priority": "high"
  }
  ```
- `GET /api/problems/:userId` - Get user problems

## Architecture

The application consists of:

1. **Backend Server (server.js)**: Express.js server with AI receptionist logic
2. **Frontend Interface (public/index.html)**: Interactive web interface with chat, preferences, orders, and problems tabs
3. **In-Memory Storage**: Simple data storage for preferences, orders, and problems

## Key Features

### Respectful Communication
The AI receptionist is designed to be:
- Professional and courteous in all interactions
- Empathetic when handling problems or complaints
- Clear and helpful in providing information
- Patient and understanding with user requests

### Intent Recognition
The receptionist can identify:
- Greetings and social interactions
- Preference-related queries
- Order and booking requests
- Problem reports and complaints
- Thanks and acknowledgments

## Future Enhancements

- Integration with real AI/ML services (OpenAI, Google AI, etc.)
- Persistent database storage (MongoDB, PostgreSQL)
- User authentication and authorization
- Email notifications for orders and problems
- Multi-language support
- Voice interaction capabilities
- Advanced analytics and reporting

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
