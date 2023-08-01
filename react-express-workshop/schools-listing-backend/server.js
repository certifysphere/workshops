const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 3002;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection settings
const mongoUrl = process.env.MONGO_DB_URL;
const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });

// Connect to the MongoDB database
client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB database');
});

// MongoDB Collection Name
const collectionName = 'schools';

// Get all schools
app.get('/schools', async (req, res) => {
  try {
    const db = client.db();
    const schoolsCollection = db.collection(collectionName);
    const schools = await schoolsCollection.find({}).toArray();
    res.json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ error: 'An error occurred while fetching schools' });
  }
});

// Get a specific school by ID
app.get('/schools/:id', async (req, res) => {
  try {
    const db = client.db();
    const schoolsCollection = db.collection(collectionName);
    const school = await schoolsCollection.findOne({ _id: ObjectId(req.params.id) });

    if (school) {
      res.json(school);
    } else {
      res.status(404).json({ message: 'School not found' });
    }
  } catch (error) {
    console.error('Error fetching school by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the school' });
  }
});

// Create a new school
app.post('/schools', async (req, res) => {
  try {
    const db = client.db();
    const schoolsCollection = db.collection(collectionName);
    const { name, grades, city, state, country, zipCode } = req.body;
    const newSchool = { name, grades, city, state, country, zipCode };

    const result = await schoolsCollection.insertOne(newSchool);
    newSchool._id = result.insertedId;

    res.status(201).json(newSchool);
  } catch (error) {
    console.error('Error creating a new school:', error);
    res.status(500).json({ error: 'An error occurred while creating the school' });
  }
});

// Update an existing school
app.put('/schools/:id', async (req, res) => {
  try {
    const db = client.db();
    const schoolsCollection = db.collection(collectionName);
    const { name, grades, city, state, country, zipCode } = req.body;

    const updatedSchool = await schoolsCollection.findOneAndUpdate(
      { _id: ObjectId(req.params.id) },
      { $set: { name, grades, city, state, country, zipCode } },
      { returnOriginal: false }
    );

    if (updatedSchool.value) {
      res.json(updatedSchool.value);
    } else {
      res.status(404).json({ message: 'School not found' });
    }
  } catch (error) {
    console.error('Error updating the school:', error);
    res.status(500).json({ error: 'An error occurred while updating the school' });
  }
});

// Delete a school
app.delete('/schools/:id', async (req, res) => {
  try {
    const db = client.db();
    const schoolsCollection = db.collection(collectionName);
    const deletedSchool = await schoolsCollection.findOneAndDelete({ _id: ObjectId(req.params.id) });

    if (deletedSchool.value) {
      res.json(deletedSchool.value);
    } else {
      res.status(404).json({ message: 'School not found' });
    }
  } catch (error) {
    console.error('Error deleting the school:', error);
    res.status(500).json({ error: 'An error occurred while deleting the school' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
