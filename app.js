var express = require('express'),
  session = require('express-session'),
  passport = require('passport'),
  SpotifyStrategy = require('passport-spotify').Strategy,
  consolidate = require('consolidate');

require('dotenv').config();

var port = 8888;
var authCallbackPath = '/auth/spotify/callback';

// Passport session setup
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// Use the SpotifyStrategy within Passport
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:' + port + authCallbackPath,
    },
    function (accessToken, refreshToken, expires_in, profile, done) {
      process.nextTick(function () {
        // Store the access token and refresh token in the user profile
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;
        profile.expires_in = expires_in;

        return done(null, profile);
      });
    }
  )
);

var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(
  session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })
);
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.engine('html', consolidate.nunjucks);

app.get('/', function (req, res) {
  const user = req.user;

  if (user && user.accessToken) {
    // Define the API URL
    const apiUrl = 'https://api.spotify.com/v1/me/playlists';

    // Make a GET request to Spotify API using the access token
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.accessToken}`, // Include the token in the Authorization header
        'Content-Type': 'application/json' // Optional, depending on the API requirements
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {

        res.render('index.html', { user: req.user, playlists:data.items })
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Error fetching data from Spotify');
      });
  } else {
    res.render('index.html', { user: req.user })
  }
  
});

app.get('/play/:playlistId', ensureAuthenticated, function (req, res) {

  const user = req.user;
  const playlistId = req.params.playlistId

  if (user && user.accessToken && playlistId) {
    // Define the API URL
    const apiUrl = `https://api.spotify.com/v1/playlists/${playlistId}`;

    // Make a GET request to Spotify API using the access token
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.accessToken}`, // Include the token in the Authorization header
        'Content-Type': 'application/json' // Optional, depending on the API requirements
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {

        let tracks = data.tracks.items
        let track = tracks[Math.floor(Math.random() * tracks.length)].track;

        console.log(track.id,track.name)

        res.render('play.html', { songId:track.id });

      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Error fetching data from Spotify');
      });
  } else {
    res.status(401).send('Unauthorized: No access token found');
  }
});




app.get('/account', ensureAuthenticated, function (req, res) {
  res.render('account.html', { user: req.user });
});

app.get('/tracks', ensureAuthenticated, function (req, res) {
  res.render('track.html', { user: req.user });
});


app.get('/track', ensureAuthenticated, function (req, res) {
  // console.log(req.params, req.user);

  const user = req.user;

  if (user && user.accessToken) {
    // Define the API URL
    const apiUrl = 'https://api.spotify.com/v1/me/playlists';

    // Make a GET request to Spotify API using the access token
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.accessToken}`, // Include the token in the Authorization header
        'Content-Type': 'application/json' // Optional, depending on the API requirements
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // console.log(data);
        playlists = []
        playlists.push(data.items[0])


        tracks = 'https://api.spotify.com/v1/tracks/5CVMb0H4Dn7v95KHf9znVI'


        fetch(tracks, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.accessToken}`, // Include the token in the Authorization header
            'Content-Type': 'application/json' // Optional, depending on the API requirements
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data2 => {

            // console.log(data2)

            song = data2.id

            // console.log(playlists)
            console.log(song)
            res.render('track.html', { playlists, song }); // Render track page with playlists

          })
          .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Error fetching data from Spotify');
          });




      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Error fetching data from Spotify');
      });
  } else {
    res.status(401).send('Unauthorized: No access token found');
  }
});

app.get('/login', function (req, res) {
  res.render('login.html', { user: req.user });
});

// GET /auth/spotify
app.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private', 'playlist-read-private'], // Include playlist-read-private scope
    showDialog: true,
  })
);

// GET /auth/spotify/callback
app.get(
  authCallbackPath,
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  }
);

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.listen(port, function () {
  console.log('App is listening on port http://localhost:' + port);
});

// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
