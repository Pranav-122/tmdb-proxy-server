require("dotenv").config();
//dotenv → Loads environment variables from a .env file (for storing your TMDB API key securely).
const express = require("express");
//express → Creates an API server to handle HTTP requests.
const axios = require("axios");
//axios → Makes API requests to TMDB.
const cors = require("cors");
//cors → Allows your frontend (React) to communicate with this backend from a different domain.


const app = express();
//Creates an Express server (app).

const PORT = process.env.PORT || 5000;
//Defines a port (either from environment variables or defaults to 5000).

app.use(express.json());
//Allows handling JSON request bodies (used in POST requests).
app.use(cors());
// Prevents CORS (Cross-Origin Resource Sharing) errors when your frontend calls this backend from a different origin.


// TMDB API Key from .env file
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Proxy Route for TMDB Authentication (Request Token)
app.get("/api/tmdb/request-token", async (req, res) => {
    try {
        const response = await axios.get(
            `${TMDB_BASE_URL}/authentication/token/new?api_key=${TMDB_API_KEY}`
            //Calls TMDB API (authentication/token/new) to generate a request token.
    );
    res.json(response.data);
    //Returns the request token to the frontend.
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Proxy Route for TMDB Authentication (Login)
app.post("/api/tmdb/login", async (req, res) => {
    try {
    //Takes username, password, and request_token from the React frontend.
    const { username, password, request_token } = req.body;
    const response = await axios.post(
        `${TMDB_BASE_URL}/authentication/token/validate_with_login?api_key=${TMDB_API_KEY}`,
      //Calls TMDB API (validate_with_login) to check if the login is correct.

      {
        username,
        password,
        request_token,
      }
    );
    res.json(response.data);
    //If successful, the request token is validated and ready for session creation.
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Proxy Route for Session Creation
app.post("/api/tmdb/session", async (req, res) => {
    try {
    //Takes the validated request token from the previous step.

    const { request_token } = req.body;
    const response = await axios.post(
        `${TMDB_BASE_URL}/authentication/session/new?api_key=${TMDB_API_KEY}`,
      //Calls TMDB API (session/new) to create a session ID.

      { request_token }
      //Returns the session ID, which is required for fetching user-specific data (like watchlists).

    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
