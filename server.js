const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer'); // Ensure nodemailer is required
const Portfolio = require('./module/portfolio');
const connectDB = require('./db/dbconnect');
const dotenv = require('dotenv');

// Create an Express application
const app = express();

dotenv.config();

// Connect to the database
connectDB();

// Set Pug as the template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse incoming JSON requests and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
  res.render('index', { title: 'ARNAV PORTFOLIO' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'ABOUT PAGE' });
});

app.get('/resume', (req, res) => {
  res.render('resume', { title: 'RESUME PAGE' });
});

app.get('/skills', (req, res) => {
  res.render('skills', { title: 'SKILL PAGE' });
});

app.get('/service', (req, res) => {
  res.render('service', { title: 'SERVICE PAGE' });
});

app.get('/project', (req, res) => {
  res.render('project', { title: 'PROJECT PAGE' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'CONTACT PAGE' });
});

// POST route to handle form submission
app.post('/submit-form', async (req, res) => {
  try {
    console.log('Received form data:', req.body);

    // Check if all required fields are present
    const requiredFields = ['name', 'email', 'subject', 'phone', 'message'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        console.error(`Missing required field: ${field}`);
        return res.status(400).json({ success: false, message: `Missing required field: ${field}` });
      }
    }

    const newPortfolio = new Portfolio(req.body); // Create a new instance with the request body
    await newPortfolio.save(); // Save the portfolio data

    console.log('Portfolio data saved:', newPortfolio);

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: req.body.email, // Use the user's email address
      to: process.env.EMAIL_USER,
      subject: `Portfolio Form : ${req.body.subject}`,
      html: `
        <h3>Portfolio Form Submission</h3>
        <table border="1" cellpadding="10" cellspacing="0">
          <tr>
            <th>Name</th>
            <td>${req.body.name}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>${req.body.email}</td>
          </tr>
          <tr>
            <th>Phone Number</th>
            <td>${req.body.phone}</td>
          </tr>
          <tr>
            <th>Message</th>
            <td>${req.body.message}</td>
          </tr>
        </table>
      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.json({ success: true, message: 'Form data has been received. Thank you!' }); // Send JSON response
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ success: false, message: 'There was an error saving the form data. Please try again.' }); // Return JSON error response
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
