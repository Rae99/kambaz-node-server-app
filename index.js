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
import 'dotenv/config';
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
hello(app);
Lab5(app);
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
