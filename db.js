var MongoClient = require("mongodb").MongoClient;

var url = "mongodb://localhost:27017/tfg";

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
                        console.log('amic que fas¿¿¿ja existeix loco');
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
                db.collection("tfgs").find(function(err, result) {
                    callback(err, result);
                    client.close();
                });
            }
        });
    },
    insert_tfg: function(title,is_professor,email,callback){
        MongoClient.connect(url, function(err, client) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error: ', err);
                callback(err, null);
            } else {
                var db = client.db("tfg");
                var newTFG;
                if(is_professor){
                    newTFG = {
                        title:title,
                        professor:email,
                        alumne:null
                    }
                }
               else {
                    newTFG = {
                        title:title,
                        professor:null,
                        alumne:email
                    };
                }
                db.collection("tfgs").insertOne(newTFG, function(err, res) {
                    callback(err, res);
                    console.log("tfg "+title+ " by " + email  +" added correctly");
                    client.close();
                });
            }
        });
    },
}