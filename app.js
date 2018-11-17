var mongo = require("mongodb");
var express = require("express");
var MongoClient = mongo.MongoClient;

const app = express();
const port = 6000;

var mongo = require('./db.js');

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render("index"));
app.get("/login",(req,res) => res.send("Log In"));
app.get("/register",(req,res) => res.send("Register"));
app.get("/main",(req,res)=>res.send("Enhorabona has entrat al nosttre domini web 2003 copyright"))

app.post("/register",function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    mongo.register(username,passord,function(err,result){
        if(err){
            res.render("Error");
        }else{
            app.redirect("/");
        }
    });
});

app.post("/login",function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    mongo.login(username,passord,function(err,result){
        if(err){
            res.render("Error");
        }else if(result === null){
            res.render("Error, aquest usuari i contrasenya no existeix");
        }else{
            app.redirect("/main");
        }
    });
});

app.get("*",(req,res) =>app.redirect("/"));
app.listen(port, () => console.log(`Database listening on port ${port}!`));




