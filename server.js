import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import morgan from 'morgan';
import session from 'express-session';
import bodyParser from 'body-parser';
import isSignedIn from './middleware/is-signed-in.js';

import authController from './controllers/auth.js';
import playerController from './controllers/players.js';
import { getAllPlayers, searchPlayers } from './utils/soccerAPIconnection.js';

dotenv.config();
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

const port = process.env.PORT || '3000';

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.get('/', async (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

app.get('/vip-lounge', async (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}`);
  } else {
    res.redirect('/auth/sign-in');
  }
});

app.get('/players', async (req, res) => {
  try {
    const players = await getAllPlayers();
    console.log('Players:', players); // Log to confirm it is an array
    if (Array.isArray(players) && players.length > 0) {
      res.render('players.ejs', { players });
    } else {
      res.render('players.ejs', { players: [] }); // Ensure it always sends an array
    }
  } catch (error) {
    console.error('Error retrieving players:', error);
    res.status(500).send('Error retrieving players');
  }
});

app.get('/search', isSignedIn, async (req, res) => {
  const playerName = req.query.player;
  try {
    const players = await searchPlayers(playerName);
    res.render('search-results.ejs', { players });
  } catch (error) {
    res.status(500).send('Error retrieving players');
  }
});

app.get('/favorites', isSignedIn, async (req, res) => {
  res.render('favorites.ejs')
})


app.use('/auth', authController);


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});