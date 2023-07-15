
// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const twilio = require('twilio');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/signup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a schema for the signup data
const signupSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
});

// Create a model based on the schema
const Signup = mongoose.model('Signup', signupSchema);

// Twilio configuration
const accountSid = '';
const authToken = '';
const twilioClient = twilio(accountSid, authToken);
const twilioPhoneNumber = '';

// Signup API endpoint
app.post('/signup', async (req, res) => {
  try {
    // Generate OTP (6-digit number)
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Send OTP via SMS
    await twilioClient.messages.create({
      body: `Your OTP: ${otp}`,
      from: twilioPhoneNumber,
      to: req.body.mobile,
    });

    // Create a new signup entry
    const signup = new Signup({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
    });

    // Save the signup data to MongoDB
    await signup.save();

    res.json({ success: true, message: 'OTP sent to your mobile number.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

// Start the server
const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
