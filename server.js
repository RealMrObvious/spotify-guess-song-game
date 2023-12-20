const express = require("express");
const fs = require('fs');


const app = express();
app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const SpotifyWebApi = require("spotify-web-api-node");
require('dotenv').config();

const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret
test

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    //console.log(data.body)
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });


app.get('/app.js', (req, res) => {
  fs.readFile('app.js', 'utf8', function (err, data) {
    if (err) {
      return;
    }
    res.set('Content-Type', 'application/javascript');
    res.send(data);
  });

});

app.get('/stylesheets/artists-style.css', (req, res) => {
  fs.readFile('/stylesheets/artists-style.css', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    res.set('Content-Type', 'text/css');
    res.send(data);
  });
});



app.post('/artists', (req, res, next) => {
  //console.log('artist is', req.body.search)
  let search = req.body.search
  if (search) {
    spotifyApi
      .searchArtists(search)
      .then(data => {
        //console.log("The received data from the API: ", data.body.artists.items[0].images[0].url);
        //let image = data.body.artists.items[0].images[0].url
        //console.log(data.body.artists.items)
        res.render('artists', { artists: data.body.artists.items, search });
      })
      .catch(err => {
        console.log("The error while searching artists occurred: ", err);
      })
  } else {
    console.log("error")
  }

});


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/callback", (req, res) => {
  console.log(req.body)
  res.render("error");
});

app.post("/login", (req, res) => {
  console.log("s")
  res.render("error");
});

app.get("*", (req, res) => {
  res.render("error");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
