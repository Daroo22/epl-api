// Load environment variables from .env file
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import morgan from 'morgan';
import session from 'express-session';
import bodyParser from 'body-parser';
import isSignedIn from './middleware/is-signed-in.js';
import Player from './models/player.js';
import User from './models/user.js';

import authController from './controllers/auth.js';
import playerController from './controllers/players.js';
import { getAllPlayers, searchPlayers } from './utils/soccerAPIconnection.js';

// Configure environment variables
dotenv.config();
const app = express();

// Middleware setup
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

// Route to render the index page
app.get('/', async (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

// Route to display a list of all players
app.get('/players', async (req, res) => {
  try {
    const players = await getAllPlayers();
    if (Array.isArray(players) && players.length > 0) {
      res.render('players.ejs', { players });
    } else {
      res.render('players.ejs', { players: [] });
    }
  } catch (error) {
    console.error('Error retrieving players:', error);
    res.status(500).send('Error retrieving players');
  }
});

// Route to search players by name and render search results
app.get('/search', isSignedIn, async (req, res) => {
  const playerName = req.query.player;
  try {
    const players = await searchPlayers(playerName);
    res.render('search-results.ejs', { players });
  } catch (error) {
    res.status(500).send('Error retrieving players');
  }
});

// Route to display a user's favorite players
app.get('/favorites', isSignedIn, async (req, res) => {
  const username = req.session.user;
  let user = await User.findOne(username).populate('favorites');
  res.render('favorites.ejs', {
    favorites: user.favorites
  });
});

// Route to display a user's profile information
app.get('/profile', isSignedIn, async (req, res) => {
  const username = req.session.user;
  let user = await User.findOne(username);
  user.populate('firstname');
  user.populate('lastname');
  console.log(user.firstname);
  console.log(user.lastname);
  res.render('profile.ejs', {
    user: user
  });
});

// Route to render the profile update form
app.get('/profile/update', isSignedIn, async (req, res) => {
  let user = await User.findOne(req.session.user);
  res.render('update.ejs');
});

// Route to handle profile update form submission
app.post('/profile/update', isSignedIn, async (req, res) => {
  let user = await User.findOne(req.session.user);
  const updatedProfile = await User.findByIdAndUpdate(user._id, {
    firstname: req.body.firstname,
    lastname: req.body.lastname
  });

  user = await User.findById(user._id);
  res.render('profile.ejs', {
    user: user
  });
});

// Route to add a player to the user's favorites
app.post('/favorites/:playerName', isSignedIn, async (req, res) => {
  console.log(req.params.playerName);

  const newPlayer = await Player.create({
    playerName: req.params.playerName
  });

  const username = req.session.user;
  let user = await User.findOne(username);
  user.favorites.push(newPlayer._id);
  await user.save();

  user = await User.findOne(username).populate('favorites');

  res.render('favorites.ejs', {
    favorites: user.favorites
  });
});

// Route to remove a player from the user's favorites
app.delete('/favorites/:playerName', async (req, res) => {
  await Player.findByIdAndDelete(req.params.playerName);
  res.redirect('/favorites');
});

app.use('/auth', authController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
