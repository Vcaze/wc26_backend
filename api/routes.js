require('dotenv').config(); // { debug: true }
const database = require("../db/mongodb/database.js");
const auth = require('../auth/auth.js');
const express = require('express');
const { MongoClient, ObjectId } = require("mongodb");
const router = express.Router();

// Så här kan en fetch se ut med token. Fungerar på samma sätt med POST, PUT och DELETE routes
// fetch("http://localhost:1337/api/cities", {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
// })

router.get('/test', async (req, res) => {
    res.json({ message: 'Hello from the server!' });
});

router.get('/test2', async (req, res) => {
    data = {
        one: 1,
        two: 2,
        three: 3
    };

    res.json(data);
});

router.post('/user', async (req, res) => {
    // console.log("Trying to register user with data: ", req.body);
    const userData = {
        password: req.body.password,
        email: req.body.email,
        firstName: req.body.firstName,
        role: "user",
        score: 0
    };

    try {
        const userId = await auth.register(userData);
        // console.log("result: ", userId);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            userId: userId
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error', error: error.message
        });
    }
});

router.post('/login', async (req, res) => {
    const loginData = {
        email: req.body.email,
        password: req.body.password
    };

    // console.log("loginData: ", loginData);

    try {
        const userInfo = await auth.login(loginData);
        res.status(200).json(userInfo);
    } catch (error) {
        console.error('Failed to login:', error);
        res.status(401).json({ message: 'Invalid email or password', error: error.message });
    }
});

router.delete('/user/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await database.deleteOne("users", id);
        // console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.get('/cities', auth.verifyJwt, async (req, res) => {
    try {
        const result = await database.getAll("cities");
        // console.log("result: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.get('/city/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await database.getOne("cities", id);
        // console.log("result: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching city:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.post('/city', auth.verifyJwt, async (req, res) => {
    const cityData = {
        name: req.body.name,
        area: req.body.area,
        parkingStations: req.body.parkingStations,
        chargingStations: req.body.chargingStations
    };

    try {
        const result = await database.addOne("cities", cityData);
        // console.log("result: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error adding city:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.get('/users', auth.verifyJwt, async (req, res) => {
    try {
        const result = await database.getAll("users");
        // console.log("result: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.get('/user/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await database.getOne("users", id);
        // console.log("result: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching city:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.put('/user/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;

    const updatedUserData = {
        ...{ id: id },
        ...req.body
    };

    try {
        const result = await database.updateOne("users", updatedUserData);
        // console.log("result: ", result);
        res.json(result);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.put('/user/password/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;
    const newPassword = req.body.newPassword;

    try {
        const result = await auth.updatePassword(id, newPassword);
        // console.log("result: ", result);
        res.status(201).json({
            success: true,
            message: "Password updated successfully"
        });
        console.log("Password updated successfully and route returned success");
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error', error: error.message
        });
    }
});

router.post('/bike', auth.verifyJwt, async (req, res) => {
    // console.log(req.body)
    const bikeData = {
        city: req.body.city,
        position: req.body.position,
        location: req.body.location,
        charging: req.body.location === "chargingStation",
        available: true,
        operational: true,
        batteryPercentage: 100
    };

    try {
        const result = await database.addOne("bikes", bikeData);
        // console.log("result: ", result);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding new bike to database:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.put('/bike/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;

    const updatedBikeData = {
        ...{ id: id },
        ...req.body
    };

    try {
        const result = await database.updateOne("bikes", updatedBikeData);
        // console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error updating bike data:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.get('/bikes/:city', auth.verifyJwt, async (req, res) => {
    const { city } = req.params;

    const cityFilter = {
        city: city
    };

    try {
        const result = await database.filterAll("bikes", cityFilter);
        // console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error retrieving bikes:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.get('/bike/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await database.getOne("bikes", id);
        // console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error retrieving one bike:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.get('/bikes', auth.verifyJwt, async (req, res) => {
    try {
        const result = await database.getAll("bikes");
        // console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error retrieving all bikes:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.delete('/bike/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await database.deleteOne("bikes", id);
        // console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting bike:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.get('/rides', auth.verifyJwt, async (req, res) => {
    try {
        const result = await database.getAll("rides");
        // console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error retrieving all rides', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.get('/user/rides/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;

    const ridesFilter = { userId: id };

    try {
        const result = await database.filterAll("rides", ridesFilter);
        // console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error filtering rides on user id:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.get('/bike/rides/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;

    const ridesFilter = { bikeId: id };

    try {
        const result = await database.filterAll("rides", ridesFilter);
        // console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error filtering rides on user id:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.delete('/ride/:id', auth.verifyJwt, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await database.deleteOne("rides", id);
        // console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting ride:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.post('/bulk-insert/:collection', auth.verifyJwt, async (req, res) => {
    const { collection } = req.params;
    const data = req.body;

    const chunkSize = 350;
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
    };

    let insertedIds = [];
    
    try {
        for (const chunk of chunks) {
            const operations = chunk.map(doc => ({
                insertOne: { document: { ...doc, _id: new ObjectId() } }
            }));

            const result = await database.bulkWrite(collection, operations);
            // console.log("result: ", result);
            const chunkInsertedIds = operations.map(op => op.insertOne.document._id);
            insertedIds = insertedIds.concat(chunkInsertedIds);
        }

        res.status(200).json({message: 'Bulk inserts successful', insertedIds: insertedIds});
    } catch (error) {
        console.error('Error performing bulk inserts:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.post('/bulk-delete/:collection', auth.verifyJwt, async (req, res) => {
    const { collection } = req.params;
    const data = req.body;

    const chunkSize = 350;
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
    };

    // console.log("chunks.length: ", chunks.length);
    // console.log("chunks[0][0]: ", chunks[0][0]);

    let deleteResults = [];

    try {
        for (const chunk of chunks) {
            const operations = chunk.map(id => ({
                deleteOne: { filter: { _id: new ObjectId(String(id)) } }
            }));

            // console.log("operations: ", operations);

            const result = await database.bulkWrite(collection, operations);
            // console.log("result: ", result);
            deleteResults = deleteResults.concat(result);
        }

        res.status(200).json({message: 'Bulk deletes successful', result: deleteResults});
    } catch (error) {
        console.error('Error performing bulk deletes:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
