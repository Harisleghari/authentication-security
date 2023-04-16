//jshint esversion:6
//import packages
require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const  md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
    extended: true
}));

//Connect with mongoose
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

//Schema
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

//collectoin or table
const User = new mongoose.model("User", userSchema);

//get requestes
app.get("/", function(req, res){
    res.render("home");
})

app.get("/register", function(req, res){
    res.render("register");
})

app.get("/login", function(req, res){
    res.render("login");
})

//Post requests
app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save()
    .then(function(){
        res.render("secrets");
    })
    .catch(function(err){
        console.log(err);
    })
})

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email:username})
    .then((foundUser) => {
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
   })
   .catch((error) => {
       //When there are errors We handle them here

        console.log(err);
        res.send(400, "Bad Request");
   });
});

//App run on local host port 3000
app.listen(3000, function(){
    console.log("Server started on port 3000.")
})