# DeepPuse - AI Chat Assistant

A fully functional ChatGPT clone built with React and Node.js. DeepPuse provides a modern, clean interface for AI-powered conversations with conversation history, real-time messaging, and responsive design.

## Features

- **Modern UI/UX**: Clean, minimalist design inspired by ChatGPT
- **Real-time Chat**: Instant messaging with AI responses
- **Conversation History**: Save and manage multiple conversations
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Authentication**: Secure login system with demo credentials
- **Error Handling**: Comprehensive error handling and user feedback
- **No External Icons**: Uses only text and CSS for a clean aesthetic

## Demo Credentials

- **Email**: demo@deeppuse.com
- **Password**: demo123

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd deeppuse
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Start the development servers**

   **Option 1: Run both frontend and backend together**
   ```bash
   npm run dev
   ```

   **Option 2: Run separately**
   
   Terminal 1 (Backend):
   ```bash
   cd server
   npm start
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm start
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Project Structure

```
deeppuse/
├── public/
│   └── index.html          # HTML entry point
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ChatInput.js    # Message input component
│   │   ├── ChatSidebar.js  # Conversation sidebar
│   │   ├── ChatWindow.js   # Main chat display
│   │   ├── ErrorNotification.js # Error messages
│   │   ├── LoginForm.js    # Login form
│   │   └── MessageBubble.js # Individual message display
│   ├── pages/
│   │   ├── ChatPage.js     # Main chat interface
│   │   └── LoginPage.js    # Login page
│   ├── styles/
│   │   └── main.css        # Global styles
│   ├── utils/
│   │   ├── api.js          # API utilities
│   │   └── auth.js         # Authentication utilities
│   ├── App.js              # Main app component
│   └── index.js            # React entry point
├── server/
│   ├── index.js            # Express server
│   └── package.json        # Server dependencies
├── package.json            # Frontend dependencies
└── README.md              # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Chat
- `GET /api/chat/conversations` - Get all conversations
- `POST /api/chat/conversations` - Create new conversation
- `GET /api/chat/conversations/:id/messages` - Get messages for conversation
- `POST /api/chat/message` - Send message
- `DELETE /api/chat/conversations/:id` - Delete conversation

## Development

### Frontend Development
The frontend is built with React and uses:
- React Router for navigation
- Axios for API calls
- CSS for styling (no external UI libraries)
- Responsive design with mobile-first approach

### Backend Development
The backend is a simple Express server that:
- Provides RESTful API endpoints
- Uses CORS for cross-origin requests
- Includes mock AI responses for development
- Handles authentication and conversation management

### Environment Variables
Create a `.env` file in the root directory for frontend:
```
REACT_APP_API_URL=http://localhost:3001/api
```

## Production Build

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm start
   ```

3. **Serve the built frontend**
   The backend server is configured to serve the built frontend files from the `build` directory.

## Customization

### Styling
All styles are in `src/styles/main.css`. The design uses:
- Inter font from Google Fonts
- Modern color palette with grays and blacks
- Responsive breakpoints at 768px
- Clean typography and spacing

### AI Integration
To integrate with a real AI service:
1. Replace the mock responses in `server/index.js`
2. Add your AI service API key to environment variables
3. Update the message handling logic

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues or questions, please open an issue on the GitHub repository.
