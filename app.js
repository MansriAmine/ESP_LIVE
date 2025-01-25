// Import required modules
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// POST endpoint to insert temperature data
app.post('/temperature', (req, res) => {
  const { temperature } = req.body;

  // Validate the input
  if (typeof temperature !== 'number') {
    return res.status(400).send('Invalid temperature value.');
  }

  // Prepare and execute the SQL query
  const query = 'INSERT INTO temperature_data (temperature) VALUES (?)';
  db.query(query, [temperature], (err, result) => {
    if (err) {
      console.error('Error inserting temperature data:', err);
      return res.status(500).send('Error inserting temperature data.');
    }
    res.send('Temperature data inserted successfully.');
  });
});

// Start the server
const PORT = process.env.PORT || 4321;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
