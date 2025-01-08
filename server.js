
// Import required modules
const express = require('express');
const path = require('path');

// Create an Express application
const app = express();



// Set Pug as the template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
  res.render('index', { title: 'HOME PAGE' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'ABOUT PAGE' });
});

app.get('/resume', (req, res) => {
  res.render('resume', { title: 'RESUME PAGE' });
});

app.get('/service', (req, res) => {
  res.render('service', { title: 'SERVICE PAGE' });
});

app.get('/dropdown', (req, res) => {
  res.render('dropdown', { title: 'DROPDOWN PAGE' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'CONTACT PAGE' });
});

// Start the server
// Set the port for the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
