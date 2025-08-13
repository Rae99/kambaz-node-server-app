import express from 'express';
import { hello } from './Hello.js';
import Lab5 from './Lab5/index.js';
import cors from 'cors';
import session from 'express-session';
import UserRoutes from './Kambaz/Users/routes.js';
import CourseRoutes from './Kambaz/Courses/routes.js';
import ModuleRoutes from './Kambaz/Modules/routes.js';
import AssignmentRoutes from './Kambaz/Assignments/routes.js';
import EnrollmentRoutes from './Kambaz/Enrollments/routes.js';
import QuizRoutes from './Kambaz/Quizzes/routes.js';
import QuizAttemptRoutes from './Kambaz/QuizAttempts/routes.js';
import mongoose from 'mongoose';
import 'dotenv/config';
const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/kambaz';

console.log('🔗 Attempting to connect to MongoDB...');
console.log('📍 Environment:', process.env.SERVER_ENV || 'development');
console.log(
  '🔑 Using DATABASE_CONNECTION_STRING:',
  CONNECTION_STRING ? 'SET' : 'NOT SET'
);

mongoose
  .connect(CONNECTION_STRING)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
  });
const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  })
);

// support cookies
// restrict cross origin resource
// sharing to the react application

const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'kambaz',
  resave: false,
  saveUninitialized: false,
};
if (process.env.SERVER_ENV !== 'development') {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: 'none',
    secure: true,
    domain: process.env.SERVER_URL,
  };
}
// See note_about_index.txt for more information

// Make sure to configure sessions after configuring cors.
// The following two lines must be before the routes are defined
app.use(session(sessionOptions)); // This is a middleware that creates a session for the user
app.use(express.json()); // This is a middleware that parses the request body and makes it available in req.body

UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);
QuizRoutes(app);
QuizAttemptRoutes(app);
hello(app);
Lab5(app);

// Debug endpoint to check MongoDB connection
app.get('/api/debug/db', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    res.json({
      connectionState: states[dbState],
      dbName: mongoose.connection.db?.databaseName,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT || 4000);

// JS object (client)
// → JSON string
// → HTTP bytes
// → (server)
// → express.json()
// → JS object (req.body)

// At first, Express only receives raw bytes and does not automatically convert them into JavaScript objects.

// Middleware (express.json())
// 	•	express.json() is a body-parser middleware.
// 	•	It does the following:
// 	1.	Reads the raw bytes from the HTTP request body
// 	2.	Checks whether the Content-Type is application/json
// 	3.	Uses JSON.parse() to convert the raw bytes into a JavaScript object
// 	4.	Attaches the resulting object to req.body
