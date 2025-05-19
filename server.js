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
app.post("/submit-form", async (req, res) => {
  try {
    console.log("Received form data:", req.body);

    const newEntry = new Portfolio(req.body);
    await newEntry.save();
    console.log("✅ Data saved successfully:", newEntry);

    // Email Notification Setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: req.body.email,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Inquiry: ${req.body.subject}`,
      html: `<h3>Portfolio Inquiry</h3>
             <p><strong>Name:</strong> ${req.body.name}</p>
             <p><strong>Email:</strong> ${req.body.email}</p>
             <p><strong>Phone:</strong> ${req.body.phone}</p>
             <p><strong>Message:</strong> ${req.body.message}</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");

    res.json({ success: true, message: "Form submitted successfully!" });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
