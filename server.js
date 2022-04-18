const express = require('express'); 
//Add the PORT designation and the app expression
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//print hello world if the  
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World'
  });
});


// Default response for any other request (Not Found), and this will always be the last route we add
app.use((req, res) => {
  res.status(404).end();
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});