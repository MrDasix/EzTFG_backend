var mongo = require("mongodb");
var express = require("express");
var bodyParser = require('body-parser');
var MongoClient = mongo.MongoClient;

const app = express();
const port = 3000;

var mongo = require('./db.js');

app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render("index"));
app.get("/login",(req,res) => res.render("login"));
app.get("/register",(req,res) => res.render("register"));
app.get("/main",(req,res)=>res.render("main"));

app.post("/register",function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var professor = req.body.professor;
    mongo.register(username,password,professor,function(err,result){
        if(err){
            res.render("Error");
        }else{
            res.redirect("/");
        }
    });
});

app.post("/login",function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    mongo.login(username,password,function(err,result){
        if(err){
            res.render("Error");
        }else if(result === null){
            res.render("Error, aquest usuari i contrasenya no existeix");
        }else{
            res.redirect("/main");
        }
    });
});

app.get("*",(req,res) => res.redirect("/"));
app.listen(port, () => console.log(`Database listening on port ${port}!`));




