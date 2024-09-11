// routes/formRoutes.js
import express from 'express';
import ContactForm from '../models/ContactForm.js';
import nodemailer from 'nodemailer';
import kickbox from 'kickbox';
import { nameRegex, emailRegex, minMessageLength } from '../Constants/Regex1.js';
import dotenv from 'dotenv/config';

const router = express.Router();

const kb = kickbox.client(process.env.API_KEY).kickbox();

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
        // Verify the email address using Kickbox
        const verifyEmailResponse = await new Promise((resolve, reject) => {
            kb.verify(email, (err, response) => {
                if (err) {
                    return reject(err);
                }
                resolve(response.body);
            });
        });

        if (verifyEmailResponse.result === "undeliverable") {
            return res.status(400).json({ message: 'Email address is invalid.' });
        }

        // Save the contact form data
        const newContactForm = new ContactForm({ name, email, message });
        await newContactForm.save();

        // Send a confirmation email
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
            text: `Hello ${name},\n\nThank you for contacting us. We will get back to you soon!\n\nBest regards,\nGanesh Patel\n(Admin)`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Form submitted and email sent successfully!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred. Please try again later.', error: error.message });
    }
});

export default router;
