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
app.get("/register",(req,res) => res.render("register"));

app.get("/login",function(req,res){
    var username = req.query.username;
    var password = req.query.password;

    mongo.login(username,password,function(err,result){
        if(err){
            res.render("Error");
        }else if(result === null){
            res.render("Error, aquest usuari i contrasenya no existeix");
        }else{
            res.status(200).send(result);
            console.log(result);
        }
    });
});

app.post("/register",function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var is_professor = req.body.is_professor;

    mongo.register(username,password,is_professor,function(err,result){
        if(err){
            res.render("Error");
        }else{
            res.redirect("/");
        }
    });
});


app.post("/insert_tfg",function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var is_professor = req.body.is_professor;

    mongo.insert_tfg(title,is_professor,email,function(err,result){
        if(err){
            res.render("Error la db no furula");
        }else{
            res.redirect("/");
        }
    });
});

app.get("/get_tfg",function(req,res){
    mongo.get_tfg(function(err,result){
        if(err){
            res.render("Error");
        }else if(result === null){
            res.render("Error, no hi ha cap tfg");
        }else{
            res.status(200).send(result);
        }
    });
});

app.get("/reset",function(req,res){
    mongo.resetdb(function(err,result){

        console.log("Reset Data");

    });
});

app.get("*",(req,res) => res.redirect("/"));
app.listen(port, () => console.log(`Database listening on port ${port}!`));




