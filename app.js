require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const MongoDb = require('mongodb').MongoClient;


app.listen(process.env.PORT, () => console.log('server is running', process.env.PORT ))
app.use(express.json());
app.use(cors(
    {
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204
      }
))


let db;
MongoDb.connect(process.env.url, (err, client) =>{
    if(err) throw err
    db = client.db('tokentesting')
})


// users login

app.post('/api/login', async (req, res) =>{

    const {name, password} = await req.body;

    await db.collection('users').findOne({name, password})
    .then((result) =>{
        if(result){
            jwt.sign({result}, 'seafdsfsa', (err, token) =>{
                res.status(200).json({token, result})
            })
        } else {
            res.json({error: "not found"})
        }
    })
    // const users = {
    //     name: 'mgmg',
    //     password: 123,
    // }
    // jwt.sign({users}, "fjdsaofjdsa33", (err, token) =>{
    //     res.status(200).json({token, users})
    // })
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
