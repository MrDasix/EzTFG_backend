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
    console.log("register executed");
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
    console.log("Insert_tfg executed");
    var title = req.body.title;
    var email = req.body.email;
    var is_professor = req.body.is_professor;
    mongo.insert_tfg(title,is_professor,email,function(err,result){
        if(err){
            res.render("Error la db no furula");
        }else{
            res.redirect("/");
        }
    });
});

app.post("/remove_tfg",function(req,res){
    console.log("remove_tfg executed");
    var title = req.body.title;
    mongo.remove_tfg(title,function(err,result){
        if(err){
            res.render("Error la db no furula");
        }else{
            res.redirect("/");
        }
    });
});

app.post("/add_tfg_description",function(req,res){
    console.log("remove_tfg executed");
    var title = req.body.title;
    var description = req.body.description;
    mongo.add_tfg_description(title,description,function(err,result){
        if(err){
            res.render("Error la db no furula");
        }else{
            res.redirect("/");
        }
    });
});

app.post("/add_user_to_tfg",function(req,res){
    console.log("add_user_to_tfg executed");
    var title = req.body.title;
    var user = req.body.user;
    var is_professor = req.body.is_professor;
    mongo.add_user_to_tfg(title,user,is_professor,function(err,result){
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
        }else if(res === null){
            res.render("Error, no hi ha cap tfg");
        }else{
            res.status(200).send(result);
        }
    });
});

app.get("/get_tfg_user",function(req,res){
    console.log("get_tfg_user is executed");
    var user = req.query.user;
    mongo.get_tfg_user(user,function(err,result){
        if(err){
            res.render("Error");
        }else if(res === null){
            res.render("Error, no hi ha cap tfg d'aquest user");
        }else{
            res.status(200).send(result);
        }
    });
});

app.get("/get_tfg_by_title",function(req,res){
    console.log("get_tfg_by_title is executed");
    var title = req.query.title;
    mongo.get_tfg_by_title(title,function(err,result){
        if(err){
            res.render("Error");
        }else if(res === null){
            res.render("Error, no hi ha cap tfg d'aquesta title");
        }else{
            res.status(200).send(result);
        }
    });
});

app.get("/get_tfg_disponibles",function(req,res){
    console.log("get_tfg_disponibles is executed");
    var is_professor = req.query.is_professor;
    mongo.get_tfg_disponibles(is_professor,function(err,result){
        if(err){
            res.render("Error");
        }else if(res === null){
            res.render("Error, no hi ha cap tfg fet per profes");
        }else{
            res.status(200).send(result);
        }
    });
});

app.post("/add_comment_to_tfg",function(req,res){
    console.log("add_comment_to_tfg executed");
    var title = req.body.title;
    var username = req.body.username;
    var comment = req.body.comment;
    var fullcomment = {
        name:username,
        comm:comment
    }
    mongo.add_comment_to_tfg(title,fullcomment,function(err,result){
        if(err){
            res.render("Error la db no furula");
        }else{
            res.redirect("/");
        }
    });
});

app.get("/reset",function(req,res){
   mongo.resetdb(function(err,result){
        console.log("HEH");
   });
});

app.get("*",(req,res) => res.redirect("/"));
app.listen(port, () => console.log(`Database listening on port ${port}!`));




