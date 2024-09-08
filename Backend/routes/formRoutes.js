// routes/formRoutes.js
import express from 'express';
import ContactForm from '../models/ContactForm.js';
import nodemailer from 'nodemailer';
import { nameRegex, emailRegex, minMessageLength } from '../Constants/Regex1.js'

const router = express.Router();


router.post('/submit-form', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!nameRegex.test(name)) {
        return res.status(400).json({ message: 'Please enter a valid name (letters and spaces only).' });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (message.length < minMessageLength) {
        return res.status(400).json({ message: `Message must be at least ${minMessageLength} characters long.` });
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
            subject: 'Ticket Registered',
            text: `Hello ${name},\n\nThank you for your message: "${message}". We will get back to you soon!\n\nBest regards,\nTeam`,
        };

        const MailRes = await transporter.sendMail(mailOptions);
        console.log('response', MailRes)
        res.status(200).json({ message: 'Form submitted and email sent successfully!' });
    } catch (error) {
        console.error('Error saving form data or sending email:', error);
        console.log(error.stack)
       return res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
});

export default router;
