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
  // set a variable to get all the data from the candidates table + the data that we gotten from the other table
  const sql = `SELECT candidates.*, parties.name  AS party_name 
             FROM candidates LEFT JOIN parties ON candidates.party_id = parties.id`;

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
  // get the data from the database ==> here we selected the database table and we added the party.name from the parties table then sent it
  // whenever the id = user provided id then send the data that has that id. for exmpl http://localhost:3001/api/candidate/1 
  //will provide them the data with first_name = Roland, last_name = Fribrank, party_id =1 ...+ Party_name = JS ..
  const sql = `SELECT candidates.*, parties.name AS party_name 
    FROM candidates 
    LEFT JOIN parties ON candidates.party_id = parties.id
    WHERE candidates.id = ?`;
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
  // the inputCheck function will is like a validation function, to validate if something is misssing after trying to post data
  // with that it will match the data inside your database table 
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


// Update a candidate's party
app.put('/api/candidate/:id', (req, res) => {
  const sql = `UPDATE candidates SET party_id = ? 
               WHERE id = ?`;
  const params = [req.body.party_id, req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      // check if a record was found
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'successsss',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

// get all parties
app.get('/api/parties', (req, res) => {
  const sql = `SELECT * FROM parties`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});


// get a single party
app.get('/api/party/:id', (req, res) => {
  const sql = `SELECT * FROM parties WHERE id = ?`;
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


// delete party
app.delete('/api/party/:id', (req, res) => {
  const sql = `DELETE FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
      // checks if anything was deleted
    } else if (!result.affectedRows) {
      res.json({
        message: 'Party not found'
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





// Default response for any other request (Not Found)
// make sure that this need to be always last in your code 
app.use((req, res) => {
  res.status(404).end();
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});