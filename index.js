import express from 'express';
import { hello } from './Hello.js';
import Lab5 from './Lab5/index.js';
import cors from 'cors';
import session from 'express-session';
import UserRoutes from './Kambaz/routes.js';
const app = express();
UserRoutes(app);
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
app.use(session(sessionOptions));
app.use(express.json());

hello(app);
Lab5(app);
app.listen(process.env.PORT || 4000);
