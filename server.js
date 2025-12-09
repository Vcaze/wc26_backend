require('dotenv').config();
const auth = require('./auth/auth.js');
const http = require("http");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./api/routes.js');

const app = express();
const port = process.env.PORT_API || 1337;
const frontendURL = process.env.FRONTEND_URL;
const frontendLocalURL = process.env.FRONTEND_LOCAL_URL;
const frontendLocalURL2 = process.env.FRONTEND_LOCAL_URL_2;

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));

// CORS
console.log('Allowed Frontend URLs:', frontendLocalURL, frontendURL, frontendLocalURL2);
const corsOptions = {
    origin: [frontendLocalURL, frontendURL, frontendLocalURL2],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

// Routes
app.use('/api', routes);

// Start server
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = server;
