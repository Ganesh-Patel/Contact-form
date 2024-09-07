import React, { useState } from 'react';
import axios from 'axios';
import './contect.css';

const Form1 = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loading state

    // Validate form data
    if (!name || !email || !message) {
      setFormStatus('Please fill out all fields.');
      setIsLoading(false);
      return;
    }

    try {
      // Make the API call
      const response = await axios.post('https://contact-form-pgqm.onrender.com/submit-form', {
        name,
        email,
        message
      });

      // Handle the response
      if (response.status === 200) {
        setFormStatus('Thank you for your message, we will be in touch in no time!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
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
