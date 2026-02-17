// AI Receptionist Application - Main JavaScript File

// ============================================
// Global Variables and State Management
// ============================================

let conversationHistory = [];
let isWaitingForResponse = false;
let appointmentBookingMode = false;

// ============================================
// DOM Elements
// ============================================

const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const appointmentFormContainer = document.getElementById('appointmentFormContainer');
const appointmentForm = document.getElementById('appointmentForm');
const cancelFormButton = document.getElementById('cancelForm');

// ============================================
// Intent Recognition and Response Logic
// ============================================

/**
 * Intent patterns for recognizing user queries
 * Each intent has patterns (keywords/phrases) and corresponding responses
 */
const intents = {
    greeting: {
        patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
        responses: [
            "Hello! Welcome to our office. I'm your AI receptionist. How can I assist you today?",
            "Hi there! It's great to have you here. How may I help you?",
            "Greetings! I'm here to help. What can I do for you today?"
        ]
    },
    services: {
        patterns: ['services', 'what do you offer', 'what services', 'help with', 'what can you do'],
        responses: [
            "We offer a variety of services including consultations, appointments, general inquiries, and booking assistance. Would you like to know more about any specific service?",
            "Our services include professional consultations, appointment scheduling, and answering your questions. How can I assist you specifically?"
        ]
    },
    hours: {
        patterns: ['hours', 'open', 'close', 'timing', 'schedule', 'when are you open'],
        responses: [
            "We're open Monday to Friday, 9:00 AM to 6:00 PM, and Saturday from 10:00 AM to 4:00 PM. We're closed on Sundays.",
            "Our business hours are: Mon-Fri: 9 AM - 6 PM, Saturday: 10 AM - 4 PM. We're closed on Sundays."
        ]
    },
    location: {
        patterns: ['location', 'address', 'where are you', 'directions', 'how to reach'],
        responses: [
            "We're located at 123 Business Street, Suite 100, City Center. You can easily reach us by taking the main highway exit 5.",
            "Our address is 123 Business Street, Suite 100, City Center. We have ample parking available on-site."
        ]
    },
    contact: {
        patterns: ['contact', 'phone', 'email', 'call', 'reach you'],
        responses: [
            "You can reach us at (555) 123-4567 or email us at info@company.com. We typically respond within 24 hours.",
            "Feel free to contact us at (555) 123-4567 or send an email to info@company.com."
        ]
    },
    appointment: {
        patterns: ['appointment', 'book', 'schedule', 'meeting', 'reservation', 'visit'],
        responses: [
            "I'd be happy to help you book an appointment! Let me get some information from you.",
            "Great! I can help you schedule an appointment. Please provide the necessary details."
        ]
    },
    pricing: {
        patterns: ['price', 'cost', 'fee', 'charge', 'how much'],
        responses: [
            "Our pricing varies depending on the service. Basic consultations start at $50, while comprehensive packages range from $100-$300. Would you like details on a specific service?",
            "Prices depend on the type of service you need. Please let me know what you're interested in, and I can provide specific pricing information."
        ]
    },
    goodbye: {
        patterns: ['bye', 'goodbye', 'see you', 'thanks', 'thank you'],
        responses: [
            "Thank you for visiting! Have a great day. Feel free to come back if you need anything else.",
            "Goodbye! It was my pleasure assisting you. Don't hesitate to reach out if you need help in the future."
        ]
    }
};

/**
 * Escapes special regex characters in a pattern string
 * @param {string} pattern - Pattern to escape
 * @returns {string} - Escaped pattern
 */
function escapeRegexPattern(pattern) {
    return pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Analyzes user input and determines the intent
 * @param {string} input - User's message
 * @returns {string} - Detected intent or 'unknown'
 */
function detectIntent(input) {
    const normalizedInput = input.toLowerCase().trim();
    
    for (const [intent, data] of Object.entries(intents)) {
        for (const pattern of data.patterns) {
            // Use word boundary matching to avoid false positives
            const escapedPattern = escapeRegexPattern(pattern);
            const regex = new RegExp('\\b' + escapedPattern + '\\b');
            if (regex.test(normalizedInput)) {
                return intent;
            }
        }
    }
    
    return 'unknown';
}

/**
 * Generates an appropriate response based on detected intent
 * @param {string} intent - The detected intent
 * @returns {string} - AI response message
 */
function generateResponse(intent) {
    if (intent === 'unknown') {
        const fallbackResponses = [
            "I'm not sure I understand. Could you please rephrase that? I can help with services, appointments, hours, location, and contact information.",
            "I didn't quite catch that. I can assist you with booking appointments, answering questions about our services, hours, and location. What would you like to know?",
            "I apologize, but I'm not sure how to help with that. Feel free to ask about our services, schedule an appointment, or inquire about our hours and location."
        ];
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
    
    const responses = intents[intent].responses;
    return responses[Math.floor(Math.random() * responses.length)];
}

// ============================================
// Message Display Functions
// ============================================

/**
 * Adds a message to the chat interface
 * @param {string} text - Message text
 * @param {string} sender - 'user' or 'bot'
 */
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    messageText.textContent = text;
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = getCurrentTime();
    
    messageContent.appendChild(messageText);
    messageContent.appendChild(messageTime);
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Save to conversation history
    conversationHistory.push({
        text: text,
        sender: sender,
        timestamp: new Date().toISOString()
    });
}

/**
 * Shows typing indicator animation
 */
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.id = 'typing-indicator';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    
    messageContent.appendChild(typingIndicator);
    typingDiv.appendChild(messageContent);
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Removes typing indicator
 */
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * Gets current time in formatted string
 * @returns {string} - Formatted time (HH:MM AM/PM)
 */
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
}

// ============================================
// Message Processing and AI Response
// ============================================

/**
 * Processes user input and generates AI response
 * @param {string} userMessage - User's message
 */
async function processUserMessage(userMessage) {
    if (!userMessage.trim() || isWaitingForResponse) return;
    
    isWaitingForResponse = true;
    
    // Add user message
    addMessage(userMessage, 'user');
    
    // Clear input field
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate processing delay for realistic interaction
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Remove typing indicator
    removeTypingIndicator();
    
    // Detect intent and generate response
    const intent = detectIntent(userMessage);
    const response = generateResponse(intent);
    
    // Add bot response
    addMessage(response, 'bot');
    
    // If appointment intent detected, show booking form
    if (intent === 'appointment') {
        await new Promise(resolve => setTimeout(resolve, 500));
        showAppointmentForm();
    }
    
    isWaitingForResponse = false;
}

// ============================================
// Appointment Booking Functions
// ============================================

/**
 * Shows the appointment booking form
 */
function showAppointmentForm() {
    appointmentFormContainer.style.display = 'flex';
    appointmentBookingMode = true;
    
    // Set minimum date to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

/**
 * Hides the appointment booking form
 */
function hideAppointmentForm() {
    appointmentFormContainer.style.display = 'none';
    appointmentBookingMode = false;
    appointmentForm.reset();
}

/**
 * Validates appointment form data
 * @param {Object} formData - Form data object
 * @returns {Object} - Validation result with isValid flag and errors array
 */
function validateAppointmentForm(formData) {
    const errors = [];
    
    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Please enter a valid name (at least 2 characters)');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Date validation
    const selectedDate = new Date(formData.date);
    selectedDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!formData.date || selectedDate < today) {
        errors.push('Please select a valid date (today or later)');
    }
    
    // Time validation
    if (!formData.time) {
        errors.push('Please select a time for your appointment');
    }
    
    // Reason validation
    if (!formData.reason || formData.reason.trim().length < 10) {
        errors.push('Please provide a detailed reason for your visit (at least 10 characters)');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Saves appointment data to local storage
 * @param {Object} appointmentData - Appointment details
 */
function saveAppointment(appointmentData) {
    // Get existing appointments from local storage
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    
    // Add new appointment with unique ID and timestamp
    const newAppointment = {
        id: Date.now(),
        ...appointmentData,
        createdAt: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    
    // Save back to local storage
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    return newAppointment;
}

/**
 * Displays validation errors in the form
 * @param {Array} errors - Array of error messages
 */
function displayFormErrors(errors) {
    // Remove any existing error display
    const existingErrorDiv = document.getElementById('form-errors');
    if (existingErrorDiv) {
        existingErrorDiv.remove();
    }
    
    // Create error display
    const errorDiv = document.createElement('div');
    errorDiv.id = 'form-errors';
    errorDiv.style.cssText = 'background: #f44336; color: white; padding: 12px; border-radius: 8px; margin-bottom: 16px;';
    
    const errorList = document.createElement('ul');
    errorList.style.cssText = 'margin: 0; padding-left: 20px;';
    
    errors.forEach(error => {
        const li = document.createElement('li');
        li.textContent = error;
        errorList.appendChild(li);
    });
    
    errorDiv.appendChild(errorList);
    
    // Insert at the top of the form
    const form = document.getElementById('appointmentForm');
    form.insertBefore(errorDiv, form.firstChild);
    
    // Scroll to the error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Handles appointment form submission
 * @param {Event} e - Form submit event
 */
async function handleAppointmentSubmit(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        reason: document.getElementById('reason').value.trim()
    };
    
    // Validate form data
    const validation = validateAppointmentForm(formData);
    
    if (!validation.isValid) {
        // Display validation errors inline
        displayFormErrors(validation.errors);
        return;
    }
    
    // Hide form
    hideAppointmentForm();
    
    // Show processing message
    showTypingIndicator();
    await new Promise(resolve => setTimeout(resolve, 1500));
    removeTypingIndicator();
    
    // Save appointment
    const savedAppointment = saveAppointment(formData);
    
    // Format date and time for display
    const formattedDate = new Date(formData.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const formattedTime = new Date(`2000-01-01T${formData.time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    // Generate confirmation message
    const confirmationMessage = `✅ Appointment Confirmed!\n\nThank you, ${formData.name}! Your appointment has been successfully booked.\n\nDetails:\n📅 Date: ${formattedDate}\n🕒 Time: ${formattedTime}\n📧 Confirmation sent to: ${formData.email}\n\nWe look forward to seeing you! You'll receive a reminder email 24 hours before your appointment.`;
    
    // Add confirmation message
    addMessage(confirmationMessage, 'bot');
}

// ============================================
// Event Listeners
// ============================================

/**
 * Initialize event listeners
 */
function initializeEventListeners() {
    // Send button click
    sendButton.addEventListener('click', () => {
        const message = userInput.value;
        processUserMessage(message);
    });
    
    // Enter key press in input field
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = userInput.value;
            processUserMessage(message);
        }
    });
    
    // Appointment form submission
    appointmentForm.addEventListener('submit', handleAppointmentSubmit);
    
    // Cancel form button
    cancelFormButton.addEventListener('click', () => {
        hideAppointmentForm();
        addMessage('Appointment booking cancelled. Let me know if you need anything else!', 'bot');
    });
    
    // Close form when clicking outside
    appointmentFormContainer.addEventListener('click', (e) => {
        if (e.target === appointmentFormContainer) {
            hideAppointmentForm();
            addMessage('Appointment booking cancelled. Let me know if you need anything else!', 'bot');
        }
    });
}

// ============================================
// Initialization
// ============================================

/**
 * Initialize the application
 */
function initializeApp() {
    // Display welcome message
    addMessage("👋 Welcome! I'm your AI receptionist assistant. I'm here to help you with information about our services, hours, location, and I can help you book an appointment. How can I assist you today?", 'bot');
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Focus on input field
    userInput.focus();
    
    console.log('AI Receptionist initialized successfully');
}

// Start the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);
