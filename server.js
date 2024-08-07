import dotenv from 'dotenv'
import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import morgan from 'morgan';
import session from 'express-session';
import bodyParser from 'body-parser';
import isSignedIn from './middleware/is-signed-in.js'; 

import authController from './controllers/auth.js';
import playerController from './controllers/players.js'
import { getAllPlayers } from './utils/soccerAPIconnection.js';
import {searchPlayers} from './utils/soccerAPIconnection.js'  


dotenv.config();
const app = express();
app.use(express.static('public'));

// Set the port from environment variable or default to 3000
const port = process.env.PORT || "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.urlencoded({ extended: true }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
// Add Session middleware 
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}))

// Routes
app.get('/', async (req, res) => {
  res.render('index.ejs', {
    user: req.session.user
  })
})

app.get('/search', isSignedIn, (req, res) => {
  const playerName = req.query.player;
  // Handle the search functionality here
  res.send(`Searching for player: ${playerName}`);
});

app.get('/vip-lounge', async (req, res) => { 
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}`)
  }
  else {
    res.redirect('/auth/sign-in')
  }
})

app.get('/search', (req, res) => {
  const playerName = req.query.player;
  // Handle the search functionality here
  res.send(`Searching for player: ${playerName}`);

});

app.use('/players', playerController)

app.get('/', async (req, res) => {
  const teamData = await getAllTeams()

  res.render('index.ejs', {
    teams: teamData.data
  })
}) 



//see all players

app.get('/players', async (req, res) => {
  try {
    const players = await getAllPlayers();
    res.render('players', { players });
  } catch (error) {
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


app.use('/auth', authController)

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});