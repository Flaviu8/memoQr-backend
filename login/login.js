import express from 'express';
import { pool } from '../db.js';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import validator from 'validator';
import jwt from 'jsonwebtoken'

const router = express.Router();
const twoToThreeDaysInMillis = 2 * 24 * 60 * 60 * 1000;

// Use JSON middleware before defining routes
router.use(express.json());
router.use(cookieParser());

router.post('/', (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  // Fetch user data by email from the database
  pool.query('SELECT * FROM register WHERE email = $1', [email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    // Check if the user exists
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, user.hashedpassword, (bcryptErr, passwordMatch) => {
      if (bcryptErr) {
        console.error(bcryptErr);
        return res.status(500).json({ error: 'Password comparison failed' });
      }

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (req.cookies['cookies-jwt']) {
        // If the token is present, the user is authenticated
        return res.status(401).json( {message :'You are already authenticated' });
      }

         // Create a JWT token containing user data (including email)
         const token = jwt.sign({ id: user.id, email: user.email }, 'your-secret-key', {
          expiresIn: twoToThreeDaysInMillis, // Token expiration time in seconds
        });

      // Create a secure, httponly cookie to store user data
      res.cookie('cookies-jwt', token, {
        httpOnly: true, // Prevent JavaScript access to the cookie
        secure: false,   // Send the cookie only over HTTPS
        sameSite: 'strict', // Protect against CSRF attacks
        maxAge: twoToThreeDaysInMillis,
      });

        // Set Cache-Control header to prevent caching
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Expires', '0');
        res.setHeader('Pragma', 'no-cache');

      return res.status(200).json({ message: 'Login successful' });
    });
  });
});


router.get('/', (req, res) => {
  // Retrieve the JWT token from the cookies or session, depending on your setup
  const token = req.cookies['cookies-jwt']; // Update with your cookie name
      // Set Cache-Control header to prevent caching
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Expires', '0');
      res.setHeader('Pragma', 'no-cache');

  if (!req.cookies['cookies-jwt']) {
    // If the token is not present, the user is not authenticated
    return res.status(401).json({ authenticated: false });
  }

  // Verify the token using your secret key
  const secretKey = 'your-secret-key'; // Replace with your actual secret key
  try {
    const decoded = jwt.verify(token, secretKey);

    // If verification is successful, the user is authenticated
    return res.status(200).json({ authenticated: true, email: decoded.email });
  } catch (error) {
    // If verification fails (e.g., due to an expired or invalid token), the user is not authenticated
    return res.status(401).json({ authenticated: false });
  }
});

export default router
