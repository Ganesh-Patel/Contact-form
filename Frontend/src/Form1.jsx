import React, { useState } from 'react';
import axios from 'axios';
import './contect.css';

const Form1 = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

    // Regular expressions for validation
    const nameRegex = /^[a-zA-Z\s]+$/; 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const minMessageLength = 10; 
  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loading state

    // Validate form data
    if (!name || !email || !message) {
      setFormStatus('Please fill out all fields.');
      setIsLoading(false);
      return;
    } if (!nameRegex.test(name)) {
      setFormStatus('Please enter a valid name (letters and spaces only).');
      setIsLoading(false);
      return;
    }

    if (!emailRegex.test(email)) {
      setFormStatus('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (message.length < minMessageLength) {
      setFormStatus(`Message must be at least ${minMessageLength} characters long.`);
      setIsLoading(false);
      return;
    }

    try {
      // Make the API call  for live https://contact-form-pgqm.onrender.com/submit-form
      const response = await axios.post('http://localhost:5000/submit-form', {
        name,
        email,
        message
      });
      console.log('API Response:', JSON.stringify(response, null, 2)); 
      console.log('Response Status:', response.status);
      console.log('Response Data:', JSON.stringify(response.data, null, 2)); 
      // Handle the response
      if (response.status === 200) {
        setFormStatus('Thank you for your message, we will be in touch in no time!');
        setName('');
        setEmail('');
        setMessage('');
      } else if(response.status === 400)
      {
        setFormStatus('Email address is invalid.');
      }
      else {
        setFormStatus('Failed to send message. Please try again later.');
      }
    
    } catch (error) {
      console.error('There was an error sending the message:', error);
      setFormStatus('Failed to send message. Please try again later.');
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  return (
    <div id="contact-form">
      <form onSubmit={submit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
        {formStatus && <p className={formStatus.includes('Failed') ? 'error' : 'success'}>{formStatus}</p>}
      </form>
    </div>
  );
};

export default Form1;
