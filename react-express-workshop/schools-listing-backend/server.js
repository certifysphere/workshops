const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware


const app = express();
const port = 3002;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes


// School Data (replace this with your database or data source)
let schools = [
  { id: 1, name: 'School 1', grades: '1-5', city: 'City 1', state: 'State 1', country: 'Country 1', zipCode: '12345' },
  { id: 2, name: 'School 2', grades: '6-8', city: 'City 2', state: 'State 2', country: 'Country 2', zipCode: '67890' },
];

// Get all schools
app.get('/schools', (req, res) => {
  res.json(schools);
});

// Get a specific school by ID
app.get('/schools/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const school = schools.find((school) => school.id === id);

  if (school) {
    res.json(school);
  } else {
    res.status(404).json({ message: 'School not found' });
  }
});

// Create a new school
app.post('/schools', (req, res) => {
  const { name, grades, city, state, country, zipCode } = req.body;
  const id = schools.length + 1;
  const newSchool = { id, name, grades, city, state, country, zipCode };

  schools.push(newSchool);

  res.status(201).json(newSchool);
});

// Update an existing school
app.put('/schools/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, grades, city, state, country, zipCode } = req.body;
  const school = schools.find((school) => school.id === id);

  if (school) {
    school.name = name;
    school.grades = grades;
    school.city = city;
    school.state = state;
    school.country = country;
    school.zipCode = zipCode;

    res.json(school);
  } else {
    res.status(404).json({ message: 'School not found' });
  }
});

// Delete a school
app.delete('/schools/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = schools.findIndex((school) => school.id === id);

  if (index !== -1) {
   

 const deletedSchool = schools.splice(index, 1);
    res.json(deletedSchool[0]);
  } else {
    res.status(404).json({ message: 'School not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});