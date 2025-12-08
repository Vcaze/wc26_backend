require('dotenv').config(); //{ debug: true }
// const database = require("./db/mongodb/src/database.js");;
const auth = require('./auth/auth.js');
// const { Server } = require('socket.io');
const http = require("http");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const { MongoClient, ObjectId } = require("mongodb");
// const setupSocket = require('./sockets/server-sockets.js');
const routes = require('./api/routes.js');

const app = express();
const port = process.env.PORT_API || 1337;
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(express.json());
const httpserver = http.createServer(app);

// app.use((req, res, next) => {
//     console.log(`Request received from Origin: ${req.headers.origin || 'Unknown'}`);
//     console.log(`Request Method: ${req.method}`);
//     console.log(`Request URL: ${req.originalUrl}`);
//     next();
// });

// Allow CORS
const corseOptions = {
    origin: [frontendURL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corseOptions));

app.options('*', cors(corseOptions));

// Increase the payload size limit
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

// Routes
app.use('/api', routes);


const server = httpserver.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = server;
