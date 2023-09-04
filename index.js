const express = require('express');
const morgan = require('morgan');

const mongoose = require('mongoose');
const bodyParser= require('body-parser');
const Joi = require('joi')
const app = express();
const Data = require('./data');
const cors = require('cors');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://sanjay:test@cluster0.eojavml.mongodb.net/?retryWrites=true&w=majority');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
 console.log('database connected'); 
});

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({
      message: 'Server Started'
    });
  });
app.get('/api/messages',(req,res)=>{
    Data.find({})
        .then(allMessages=>{
            res.json(allMessages);
        })
})

const schema = Joi.object().keys({
    name: Joi.string().min(1).max(30).required(),
    message:Joi.string().min(1).max(500).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude:Joi.number().min(-180).max(180).required(),
})


app.post('/api/messages',(req,res,next)=>{
    const result = Joi.validate(req.body,schema);
    if(result.error===null){
        const {name,message,latitude,longitude} = req.body;
        const userMessage =new Data({
            name,
            message,
            latitude,
            longitude,
            date:new Date()
        })
        userMessage.save()
            .then(savedMessage=>{
                res.json(savedMessage);
            })
    }else{
        next(result.error);
    }
})


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});