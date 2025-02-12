const bcrypt = require('bcrypt')
const validator = require('validator')
const pool = require('./db') // Assuming your connection pool is in db.js

// Static signup method
async function signup(email, password) {
    if (!email || !password) {
      throw Error('All fields must be filled');
    }
  
    if (!validator.isEmail(email)) {
      throw Error('Email not valid');
    }
  
    if (!validator.isStrongPassword(password)) {
      throw Error('Password not strong enough');
    }
  
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      throw Error('Email already in use.');
    }
  
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
  
    // Insert the user and return the created user object
    const insertResult = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hash]);
    return insertResult.rows[0];  // Return the user object with _id
  }
  

// Static login method
async function login(email, password) {
    if (!email || !password) {
      throw Error('All fields must be filled');
    }
  
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  
    if (result.rows.length === 0) {
      throw Error('Incorrect email');
    }
  
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
  
    if (!match) {
      throw Error('Incorrect password');
    }
  
    return user;
  }
  
module.exports = { signup, login }
