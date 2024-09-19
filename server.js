const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Welcome to Cake Crumbs!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});