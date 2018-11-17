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
    register: function(username, password, callback){
        MongoClient.connect(url, function(err, client) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error: ', err);
                callback(err, null);
            } else {
                var db = client.db("tfg");
                var newUser = {
                    username:username,
                    password:password
                };
                db.collection("users").insertOne(newUser, function(err, res) {
                    callback(err, res);
                    console.log("User "+username+" added correctly");
                    client.close();
                });
            }
        });
    }
}