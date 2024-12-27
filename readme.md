# Spotify Song Guessing Game

Welcome to the **Spotify Song Guessing Game**! This is an in development project that makes use of the spotify api to pick songs from a selected playlist and to challenge you to guess songs from the playlist.

---

## Table of Contents

- [Features](#features)
- [To-Dos](#to-dos)
- [Installation](#installation)
- [How to Play](#how-to-play)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **Spotify Integration**: A user can log in and can play actual music clips from a playlist.


---

## To-Dos
- **Searching for a playlist**: Enabling the ability to search for not only a users playlists, but any on spotify.
- **Scoring**: Actually taking in an input verifying the correctness
- **Music timer**: How many seconds of the song are played.
- **Hiding song info**: Actually hiding the song information.
- **Leaderboards?**: leaderboards per playlists.
- **Multiple Difficulty Levels**: Choose between easy, medium, or hard based on how many seconds of the song are played.
- **Leaderboard**: Track your progress and compete with friends to see who knows the most songs.
- **Hints**: If you're stuck, use hints like the artist's name or genre to help you out.

---

## Installation

Follow these steps to get the game up and running on your local machine (Playable web version coming soon 🤞):

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/spotify-guess-song-game.git
   ```

2. Navigate to the project folder:

   ```bash
   cd spotify-song-guessing-game
   ```

3. Install the necessary dependencies:

   ```bash
   npm install
   ```

4. Set up your Spotify API credentials:
   - Create a [Spotify Developer account](https://developer.spotify.com/dashboard/applications).
   - Create an app to obtain your **Client ID** and **Client Secret**.
   - Add these credentials to a `.env` file in the project directory as follows:

     ```text
     CLIENT_ID="your-client-id"
     CLIENT_SECRET="your-client-secret"
     ```

5. Start the game:

   ```bash
   node app.js
   ```

Now, open your browser and navigate to `http://localhost:8888` to start playing the game!

---

## How to Play

TBD

---

## Technologies Used

- **Spotify API**: To fetch song data and stream clips from Spotify.
- **Node.js**: Server-side JavaScript environment to handle API calls and game logic.
- **Express.js**: Web framework to serve the game interface and API routes.
---

## Contributing

Shoot me a dm

---

## License

Uhhhh....Yes

---

Enjoy the game and test your music knowledge! Let us know how you did or if you have any feedback! 🎶