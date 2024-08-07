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

app.post('/favorites/:playerName', isSignedIn, async (req, res) => {
  console.log(req.params.playerName)
  // Create a new player in the database.


// Save the player to the database
// newPlayer.save((err, player) => {
//     if (err) {
//         console.error('Error saving player:', err);
//     } else {
//         console.log('Player saved successfully:', player);
//     }
// });

  // Step1: Get Player data from API using the ID
  

  // Step2: Then do a Player.create() on MongoDB 
  const newPlayer = await Player.create({ 
    playerName: req.params.playerName
  })

  // Step2.5: ALSO add the new Player to the User.favorites

  const username = req.session.user;
  let user = await User.findOne(username);
  user.favorites.push(newPlayer._id)
  await user.save();

 user = await User.findOne( username ).populate('favorites');
 console.log(user)

  // Step3: Pass the favorites {} to favorites.ejs to render
 
  res.render('favorites.ejs', {
    favorites: user.favorites
  })
})


app.use('/auth', authController); 


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});