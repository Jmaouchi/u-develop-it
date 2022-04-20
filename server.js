const express = require('express');
// import the connection to database

const db = require('./db/connection');
// require the routes form apiRoutes folder

const apiRoutes = require('./routes/apiRoutes');
//Set up a port 
const PORT = process.env.PORT || 3001;

const app = express();


// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
// make sure that this need to be always last in your code 
app.use((req, res) => {
  res.status(404).end();
});


// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});