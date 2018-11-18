var MongoClient = require("mongodb").MongoClient;

var url = "mongodb://localhost:27017/tfg";

var id_tfg = 1;

module.exports = {

    login: function(username,password,callback){
        MongoClient.connect(url, function(err, client) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error: ', err);
                callback(err, null);
            } else {
                var db = client.db("tfg");
                var oldUser = {
                    username:username,
                    password:password
                };
                db.collection("users").findOne(oldUser, function(err, result) {
                    if(err){
                        console.log('no existeix l\'usuari ', err);
                        callback(err, null);                 
                    }
                   // console.log("login successful for :" + username);
                    console.log(result);
                    callback(err, result);
                    client.close();
                });
            }
        });
    },
    register: function(username, password, is_professor, callback){
        MongoClient.connect(url, function(err, client) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error: ', err);
                callback(err, null);
            } else {
                var db = client.db("tfg");
                db.collection("users").findOne( { username: username },function(err,result){

                    if(result != null){
                        console.log('amic que fas¿¿¿ja existeix loco (el registerr)');
                        callback(err,result);
                        client.close();
                    }
                    else{
                        var newUser = {
                            username:username,
                            password:password,
                            is_professor: is_professor
                        };
                        db.collection("users").insertOne(newUser, function(err, res) {
                            callback(err, res);
                            console.log("User "+username+" added correctly");
                            client.close();
                        });
                     }
                });            
            }
        });
    },    
    resetdb: function(callback){
        MongoClient.connect(url, function(err, client) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error: ', err);
                callback(err, null);
            } else {
                var db = client.db("tfg");
                db.dropDatabase();
            }
        });
    },
    get_tfg: function(callback){
        MongoClient.connect(url, function(err, client) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error: ', err);
                callback(err, null);
            } else {
                var db = client.db("tfg"); 
                db.collection("tfgs").find({}).toArray(function(err, result) {
                    callback(err, result);
                    client.close();
                });
            }
        });
    },

    get_tfg_user: function(user,callback){
        MongoClient.connect(url, function(err, client) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error: ', err);
                callback(err, null);
            } else {
                var db = client.db("tfg"); 
                db.collection("tfgs").find({ $or : [{alumne:user},{professor:user}]}).toArray(function(err, result) {
                   // console.log(result);
                    callback(err, result);
                    client.close();
                });
            }
        });
    },

    get_tfg_disponibles: function(is_professor,callback){
        MongoClient.connect(url, function(err, client) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error: ', err);
                callback(err, null);
            } else {
                var db = client.db("tfg"); 
                if(is_professor=="true"){
                    db.collection("tfgs").find({professor:null}).toArray(function(err, result) {
                            callback(err, result);
                            client.close();
                        });
                }else{
                    db.collection("tfgs").find({alumne:null}).toArray(function(err, result) {
                     console.log("else");
                     console.log(result);
                        callback(err, result);
                        client.close();
                    });
                }
            }
        });
    },

    get_tfg_by_title: function(title,callback){
        MongoClient.connect(url, function(err, client) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error: ', err);
                callback(err, null);
            } else {
                var db = client.db("tfg");
                console.log('title im looking for is : ' + title);
                var oldtfg = {
                    title:title
                }; 
                db.collection("tfgs").findOne(oldtfg,function(err, result) {
                    console.log(result);
                    callback(err, result);
                    client.close();
                });
            }
        });
    },


    insert_tfg: function(title,is_professor,email,callback){
        //console.log(' hola amigo : ' + title + ' ' + is_professor + ' ' + email);
        MongoClient.connect(url, function(err, client) {
            if(title===''){
                console.log('title null ');
                callback(err, null);             
            }
            else if (err) {
                console.log('Unable to connect to the mongoDB server. Error: ', err);
                callback(err, null);
            } else {
                var db = client.db("tfg");

                db.collection("tfgs").findOne( { title: title },function(err,result){

                    if(result != null){
                        console.log('amic que fas¿¿¿ja existeix loco (el insert de tfg de '+ title + ' )');
                        callback(err,result);
                        client.close();
                    }
                    else{
                        var newTFG;
                        if(is_professor){
                            newTFG = {
                                title:title,
                                professor:email,
                                alumne:null,
                                creador:email,
                                description:null,
                                id:id_tfg,
                                comments:[]
                            }
                        }
                        else {
                            newTFG = {
                                title:title,
                                professor:null,
                                alumne:email,
                                creador:email,
                                description:null,
                                id:id_tfg,
                                comments:[]
                            };
                        }
                        console.log("li he posat la id " + id_tfg);
                        ++id_tfg;
                        db.collection("tfgs").insertOne(newTFG, function(err, res) {
                            callback(err, res);
                            console.log("tfg "+title+ " by " + email + " added correctly");
                            client.close();
                        });
                    }
                });    
            }
        });
    },
    remove_tfg: function(title,callback){
        MongoClient.connect(url, function(err, client) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error: ', err);
                callback(err, null);
            } else {
                var db = client.db("tfg");

                db.collection("tfgs").findOne( { title: title },function(err,result){

                    if(result == null){
                        console.log('amic que fas¿¿¿NO existeix loco');
                        callback(err,result);
                        client.close();
                    }
                    else{
                        db.collection("tfgs").deleteOne({title:title}, function(err, res) {
                            callback(err, res);
                            console.log("tfg "+title  +" removed correctly");
                            client.close();
                        });
                    }
                });    
            }
        });
    },

    add_tfg_description: function(title,description,callback){
        MongoClient.connect(url, function(err, client) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error: ', err);
                callback(err, null);
            } else {
                var db = client.db("tfg");

                db.collection("tfgs").findOne( { title: title },function(err,result){

                    if(result == null){
                        console.log('amic que fas¿¿¿NO existeix loco');
                        callback(err,result);
                        client.close();
                    }
                    else{
                        db.collection("tfgs").updateOne({title:title},{$set:{"description":description} }, function(err, res) {
                            callback(err, res);
                            console.log("tfg "+title  +" description updated correctly");
                            client.close();
                        });
                    }
                });    
            }
        });
    },

    add_comment_to_tfg: function(title,fullcomment,callback){
        MongoClient.connect(url, function(err, client) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error: ', err);
                callback(err, null);
            } else {
                var db = client.db("tfg");

                db.collection("tfgs").findOne( { title: title },function(err,result){

                    if(result == null){
                        console.log('amic que fas¿¿¿NO existeix loco');
                        callback(err,result);
                        client.close();
                    }
                    else{
                        var coments = result.comments;
                        //console.log(typeof fullcomment);
                        if(coments===undefined || coments===null) {
                            console.log("yesssssssssssssssss");
                            comments = [1];
                            comments[0] = fullcomment;
                        }  
                        else coments.push(fullcomment)
                        db.collection("tfgs").updateOne({title:title},{$set:{"comments":coments} }, function(err, res) {
                            callback(err, res);
                            console.log("tfg "+title  +" comment updated correctly");
                            client.close();
                        });
                    }
                });    
            }
        });
    },



    add_user_to_tfg: function(title,user,is_professor,callback){
        MongoClient.connect(url, function(err, client) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error: ', err);
                callback(err, null);
            } else {
                var db = client.db("tfg");

                db.collection("tfgs").findOne( { title: title },function(err,result){

                    if(result == null){
                        console.log('amic que fas¿¿¿NO existeix loco');
                        callback(err,result);
                        client.close();
                    }
                    else{
                        if(is_professor){
                            db.collection("tfgs").updateOne({title:title},{$set:{"professor":user} }, function(err, res) {
                                callback(err, res);
                                console.log("tfg "+title  +" alumne updated correctly");
                                client.close();
                            });
                        }else{
                            db.collection("tfgs").updateOne({title:title},{$set:{"alumne":user} }, function(err, res) {
                                callback(err, res);
                                console.log("tfg "+title  +" professor updated correctly");
                                client.close();
                            });
                        }
                    }
                });    
            }
        });
    },


}