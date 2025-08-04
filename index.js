import express from 'express';
import { hello } from './Hello.js';
import Lab5 from './Lab5/index.js';
import cors from 'cors';
import session from 'express-session';
import UserRoutes from './Kambaz/routes.js';
const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  })
);
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

// The following two lines must be before the routes are defined
app.use(session(sessionOptions)); // This is a middleware that creates a session for the user
app.use(express.json()); // This is a middleware that parses the request body and makes it available in req.body


UserRoutes(app);
hello(app);
Lab5(app);
app.listen(process.env.PORT || 4000);

// JS object (client) 
// → JSON string 
// → HTTP bytes 
// → (server) 
// → express.json() 
// → JS object (req.body)