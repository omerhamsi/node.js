const express = require("express");
const mongodb=require("./utility/database")
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const path=require("path")
const bodyParser=require("body-parser")
var mongo = require('mongodb');
const app = express();

// app.use("/", express.static("public"));
app.use(fileUpload());
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.set("view engine","pug")

mongodb.connectServer(function(err,result){
    if(err){
        console.log(err)
    }
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname+'/main.html'))
    })
    app.get("/deleteUser/:id", (req, res) => {
        var db=mongodb.getDb()
        db.collection("user").deleteOne({
            _id:new mongo.ObjectID(req.params.id)
        }).then((result)=>{
            res.redirect("/allUsers")
        })
    
    })

    app.get("/updateUserInfo/:id", (req, res) => {
        var db=mongodb.getDb()
        db.collection("user").update({_id:new mongo.ObjectID(req.params.id)},
   {$set:{name:req.query.username,password:req.query.password}},{multi:true}).then((result)=>{
       res.redirect("/allUsers")
   })
    })
    app.get("/updateUser/:id", (req, res) => {
        var db=mongodb.getDb()
        db.collection("user").findOne({
            _id:new mongo.ObjectID(req.params.id)
        }).then((result)=>{
            res.render("updateUser.pug",{id:result._id,name:result.name,surname:result.surname})
        })
    })
    app.get("/adminLogin", (req, res) => {
        res.sendFile(path.join(__dirname+'/adminLogin.html'))
    })
    app.get("/userScreen", (req, res) => {
        var db=mongodb.getDb()
        let user={}
        db.collection("user").findOne({
            name:req.query.username,
            password:req.query.password
        }).then((result)=>{
            if(result){
                res.sendFile(path.join(__dirname+'/user.html'))
            }
            else{
            
            res.redirect("/")
            }
            
        }).catch((result)=>{
            
        })
    
    })
    app.get("/adminScreen", (req, res) => {
        if(req.query.adminname === "admin" && req.query.adminpassword==="123"){
            res.sendFile(path.join(__dirname+'/admin1.html'))
        }
        else{
            res.sendFile(path.join(__dirname+'/adminLogin.html'))
        }
    
    })
    app.get("/addUserScreen", (req, res) => {
        res.sendFile(path.join(__dirname+'/addUserScreen.html'))
    })
    app.post("/addUser", (req, res) => {
        var db=mongodb.getDb()
        db.collection("user").insertOne({
            name:req.body.username,
            password:req.body.password
        }).then((result)=>{
            res.sendFile(path.join(__dirname+'/admin1.html'))
        })
    })
    app.get("/fileUpload", (req, res) => {
        res.sendFile(path.join(__dirname+'/public/index.html'))
    
    })
    app.get("/allUsers", (req, res) => {
        var db=mongodb.getDb()
        db.collection("user").find().toArray().then((result)=>{
            res.render("userDetail.pug",{allUser:result})
        })
    
    })
    
    app.post("/extract-text", (req, res) => {
        if (!req.files && !req.files.pdfFile) {
            res.status(400);
            res.end;
        }
    
        pdfParse(req.files.pdfFile).then(result => {
            res.send(result.text);
        })
    
    })
    
    
    
    app.listen(3000);
})