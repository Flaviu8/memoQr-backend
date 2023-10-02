import express from 'express';
import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { RegisterGet, Register } from './queries.js';
import bcrypt from 'bcrypt';
import passwordValidator from 'password-validator';
import validator from 'validator';


const router = express.Router();

// Use JSON middleware before defining routes
router.use(express.json());

const passwordSchema = new passwordValidator();
passwordSchema
  .is().min(8) // Minimum length of 8 characters
  .has().uppercase() // Must have uppercase letters
  .has().lowercase() // Must have lowercase letters
  .has().digits(1) // Must have at least 1 digit
  .has().symbols(1) // Must have at least 1 special character
  .is().not().spaces(); // Cannot contain spaces

  router.post('/', (req, res) => {
    const { email, phone, lastName, firstName, password, repeatPassword } = req.body;
    const id = uuidv4();
  
    if (password !== repeatPassword) {
      return res.status(400).json({ error: 'Password and repeatPassword do not match' });
    }
  
    // if (!passwordSchema.validate(password)) {
    //   return res.status(400).json({ error: 'Password does not meet the criteria' });
    // }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
  
    const saltRounds = 10; // You can adjust the number of salt rounds
    try {
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Password hashing failed' });
        }
  
        // Save the email and hashed password to the database
        pool.query(
          Register,
          [id, email, phone, lastName, firstName, hashedPassword],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Failed to save user data to the database' });
            } else {
              console.log('User saved successfully');
              return res.status(201).json({ result: 'User saved' });
            }
          }
        );
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Password hashing failed' });
    }
  });


export default router;
