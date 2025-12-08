require('dotenv').config();
const auth = require('./auth/auth.js');
const http = require("http");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./api/routes.js');

const app = express();
const port = process.env.PORT_API || 1337;
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));

// CORS
const corsOptions = {
    origin: frontendURL,
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
