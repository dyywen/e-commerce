const express = require('express');
const { connection } = require('../Database/connection');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res) => {

    console.log('body:', req.body)
    
    const { username, email, password } = req.body
    
    if(!username || !email) return  res.status(400).send('Missing or empty fields')
    
    const sql = `SELECT * FROM users WHERE username = ? OR email = ?`
    
    connection.query(sql, [username, email], (error, results) => {
        if(error) return res.status(500).send({message: "Error to verify the username or email", error})
            console.log('verif:', results);
        if(results.length > 0) {
            res.status(400).send('username or email already exist') 
            return;
        }
    })
    
    const saltRounds = 10 
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(password, salt)

    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`

    connection.query(query, [username, email, hash], (error, result) => {
        if(error) return res.status(500).send({message: "Error to insert values", error})
            console.log('User created successfully')

            const token = jwt.sign(
                { id: result.insert, username },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            )

            return res.status(201).json({message: "User created successfully", token: token })
    })

})

router.post('/signin', (req, res) => {

    const { email, password } = req.body
    
    if(!email || !password) return  res.status(404).send('Missing or empty fields')

    const sql = `SELECT * FROM users WHERE email = ?`

    connection.query(sql, [email], (error, result) => {
        if (error) return res.status(500).send({message: 'Email not found'}, error)
            console.log('result', result);
        if (result.length > 0 && bcrypt.compareSync(password, result[0].password)) {

            const token = jwt.sign(
                { id: result.insert, username: result[0].username },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            )

            return res.status(200).json({message: 'User found', username: result[0].username, token: token})

        } else {
            
            return res.status(404).json({ message: 'Incorrect email or password'})
        }            
    })
})

module.exports = router;