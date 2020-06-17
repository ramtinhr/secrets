//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser : true , useUnifiedTopology : true});

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});


userSchema.plugin(encrypt , {secret : process.env.SECRET , encryptedFields : ['password']})

const User = mongoose.model('user',userSchema);

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded(
    {extended: true}
));

app.get('/',(req,res)=> {
    res.render('home');
});
/////////////////login route///////////////////
app.route('/login')
    .get((req,res)=> {
        res.render('login');
    })
    .post((req,res) => {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({email : username },(err,user) => {
           if(err) {
               console.log(err);
           } else {
               if(user) {
                   user.password === password ? res.render('secrets') : null;
               }
           }
        })
    })
/////////////////register route////////////////
app.route('/register')
    .get((req,res)=> {
        res.render('register');
    })
    .post((req,res) => {
       const newUser = new User({
            email : req.body.username,
            password : req.body.password
       })
       newUser.save((err) => {
           !err ? res.render('secrets') : console.log(err);
       })
    })

//////////////////end register route/////////////




let port = process.env.PORT || 3000;
app.listen(port,()=> console.log(`Server started on port ${port}`));