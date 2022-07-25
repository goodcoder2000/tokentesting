require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const MongoDb = require('mongodb').MongoClient;


app.listen(process.env.PORT, () => console.log('server is running', process.env.PORT ))
app.use(express.json());


let url = "mongodb+srv://goodcoder2000:1082018mgmg@cluster0.puynx.mongodb.net/?retryWrites=true&w=majority";
let db;
MongoDb.connect(url, (err, client) =>{
    if(err) throw err
    db = client.db('tokentesting')
})


// users login

app.post('/api/login', (req, res) =>{
    
    const {name, password} = req.body;

    db.collection('users').findOne({name, password})
    .then((result) =>{

        jwt.sign(result, 'secret123',
        (err, token) =>{
        res.status(201).json({token, user: result})
    })
    })    
})

// USER REGISTER

app.post('/api/register', (req, res) =>{

    const data = req.body;
    try {
        db.collection('users').insertOne(data)
    .then(result =>{
        res.status(201).json(result)
    })
    } catch (error) {
        res.status(500).json(error)
    }
})

//all users

app.get('/api/users', (req, res) =>{
    db.collection('users').find().toArray((err, result) => {
        if (err) throw err
    
        res.status(200).json(result)
      })
})
