// routes/formRoutes.js
import express from 'express';
import ContactForm from '../models/ContactForm.js';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/submit-form', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill out all fields.' });
  }

  try {
    const newContactForm = new ContactForm({ name, email, message });
    await newContactForm.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, 
      subject: 'Form Submission Confirmation',
      text: `Hello ${name},\n\nThank you for your message: "${message}". We will get back to you soon!\n\nBest regards,\nTeam`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Form submitted and email sent successfully!' });
  } catch (error) {
    console.error('Error saving form data or sending email:', error);
    res.status(500).json({ message: 'An error occurred. Please try again.' });
  }
});

export default router;
