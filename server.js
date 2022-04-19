const express = require('express');
const inputCheck = require('./utils/inputCheck');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'Unebellevie2018$inchalah',
    database: 'election'
  },
  console.log('Connected to the election database.')
);


// this will return the data from your database and exactly from the condidates table
// Get all candidates
app.get('/api/candidates', (req, res) => {
  // set a variable to get all the data from the candidates table 
  const sql = `SELECT * FROM candidates`;

  // get the data displayed as json using the db.query . note here we dont have a req.params due to us want to get all the data 
  db.query(sql, (err, rows) => {
    // if there is an error connecting to the db send a 500 error message
    if (err) {
      res.status(500).json({ error: err.message }); //500 is a server error and 404 is a user request error
      return;
    }
    //if res is ok send a message 'success' and the data of the rows as json
    res.json({
      message: 'success',
      data: rows // these rows are the data we gotten from the mysql database
    });
  });
});


// Get a single candidate
app.get('/api/candidate/:id', (req, res) => {
  // get the data from the database
  const sql = `SELECT * FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});


// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});


// Create a candidate
app.post('/api/candidate', ({ body }, res) => {
  const errors = inputCheck(
    body,
    'first_name',
    'last_name',
    'industry_connected'
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.industry_connected];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});


// Default response for any other request (Not Found)
// make sure that this need to be always last in your code 
app.use((req, res) => {
  res.status(404).end();
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});