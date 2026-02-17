# AI Receptionist Web Application

AI Receptionist is a web-based virtual assistant that handles customer interactions and appointment bookings using AI-driven conversation.

## Features

### 🤖 Intelligent Conversation
- Natural language processing with intent recognition
- Recognizes greetings and responds appropriately
- Answers common questions about services, hours, location, and pricing
- Provides helpful fallback responses for unknown queries

### 📅 Appointment Booking
- Dynamic appointment booking form
- Comprehensive input validation
- Date and time selection
- Stores appointments in local storage
- Displays detailed confirmation messages

### 💬 Modern Chat Interface
- Clean, professional design
- Real-time message display
- Typing indicators
- Scrollable conversation history
- Timestamp for each message

### 📱 Responsive Design
- Mobile-first approach
- Works seamlessly on phones, tablets, and desktops
- Touch-friendly interface
- Optimized layouts for all screen sizes

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or build tools required

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Caresbin-45/ai-receptionist-app.git
cd ai-receptionist-app
```

2. Open `index.html` in your web browser:
```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

Or simply drag and drop `index.html` into your browser.

### Using a Local Server (Optional)

For a better development experience, you can use a local server:

```bash
# Python 3
python -m http.server 8080

# Node.js (with npx)
npx http-server -p 8080

# Then open http://localhost:8080 in your browser
```

## Usage

### Starting a Conversation

1. Open the application in your browser
2. You'll see a welcome message from the AI receptionist
3. Type your message in the input field at the bottom
4. Press Enter or click the Send button

### Asking Questions

Try asking questions like:
- "Hello" or "Hi" - Get a friendly greeting
- "What services do you offer?" - Learn about available services
- "What are your hours?" - Get business hours information
- "Where are you located?" - Get address and directions
- "How can I contact you?" - Get contact information
- "What are your prices?" - Get pricing information

### Booking an Appointment

1. Type "I'd like to book an appointment" or "Schedule a meeting"
2. A booking form will appear
3. Fill in all required fields:
   - Full Name
   - Email Address
   - Preferred Date
   - Preferred Time
   - Reason for Visit
4. Click "Submit Appointment"
5. You'll receive a confirmation message with your appointment details

### Viewing Appointments

Appointments are stored in your browser's local storage. To view stored appointments:
1. Open browser developer tools (F12)
2. Go to Application/Storage tab
3. Select Local Storage
4. Look for the 'appointments' key

## Project Structure

```
ai-receptionist-app/
├── index.html      # Main HTML structure
├── styles.css      # All styling and responsive design
├── script.js       # AI logic, intent matching, and interactions
└── README.md       # This file
```

## Technical Details

### Intent Recognition
The application uses a pattern-matching system to recognize user intents:
- **Greetings**: hello, hi, hey, good morning, etc.
- **Services**: services, what do you offer, help with
- **Hours**: hours, open, close, timing, schedule
- **Location**: location, address, where are you, directions
- **Contact**: contact, phone, email, call
- **Appointment**: appointment, book, schedule, meeting
- **Pricing**: price, cost, fee, charge
- **Goodbye**: bye, goodbye, thanks, thank you

### Data Storage
Appointments are stored in the browser's Local Storage as JSON:
```javascript
{
  "id": 1234567890,
  "name": "John Smith",
  "email": "john@example.com",
  "date": "2026-02-20",
  "time": "14:30",
  "reason": "Consultation",
  "createdAt": "2026-02-17T22:25:21.285Z"
}
```

### Form Validation
- Name: Minimum 2 characters
- Email: Valid email format (regex validation)
- Date: Today or future date
- Time: Required field
- Reason: Minimum 10 characters

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Customization

### Modifying AI Responses

Edit the `intents` object in `script.js` to customize responses:

```javascript
const intents = {
    greeting: {
        patterns: ['hello', 'hi', 'hey'],
        responses: ['Your custom greeting here']
    },
    // Add more intents as needed
};
```

### Changing Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #4A90E2;
    --secondary-color: #50C878;
    --background-color: #F5F7FA;
    /* Modify as needed */
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Contact

For questions or support, please open an issue on GitHub.

## Acknowledgments

- Built with vanilla JavaScript, HTML5, and CSS3
- No external dependencies or frameworks
- Designed for simplicity and ease of use
