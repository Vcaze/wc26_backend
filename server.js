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
const frontendLocalURL3 = process.env.FRONTEND_LOCAL_URL_3;


// Temporary to see incoming origins in logs for debugging CORS issues
// app.use((req, res, next) => {
//     console.log("Incoming Origin:", req.headers.origin);
//     next();
// });

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));

// CORS
const allowedOrigins = [
    frontendLocalURL,
    frontendLocalURL2,
    frontendLocalURL3,
    frontendURL
].filter(Boolean);

console.log('Allowed Frontend URLs:', allowedOrigins);

const corsOptions = {
    origin: function (origin, callback) {
        console.log("Checking origin:", origin);

        // allow requests without origin (browser direct / curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.log("Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
    },
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
