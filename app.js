const express = require("express");
const app = express();
const mysql = require('mysql');
var bodyParser = require('body-parser')
var bcrypt = require('bcrypt')


const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'notes'
});

connection.connect((err) => {
    if(err) throw err;
    console.log('Connected to MySQL Server!');
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



app.post('/app/user', async function(req,res){
    var password = req.body.password;
    const encryptedPassword =await bcrypt.hash(password,5);
    var users={
        "id":req.body.id,
       "username":req.body.username,
       "password":encryptedPassword
     }
    
     
    connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
      if (error) {
          console.log(error)
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      } else {
        res.send({
          "code":200,
          "success":"account created"
            });
        }
    });
  });



app.post('/app/login',async function(req,res){
    var username= req.body.username;
    var password = req.body.password;
    connection.query('SELECT * FROM users WHERE username = ?',[username], async function (error, results, fields) {
      if (error) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        if(results.length >0){
          const comparision = await bcrypt.compare(password, results[0].password)
          if(comparision){
              res.send({
                "code":200,
                "status":"success",
                "user":results[0].username
              })
          }
          else{
            res.send({
                 "code":204,
                 "failed":"Email and password does not match"
            })
          }
        }
        else{
          res.send({
            "code":206,
            "failed":"Email does not exits"
              });
        }
      }
      });
  });

app.get('/app/sites/list/:userId',(req,res)=>{
    var userId=req.params.userId;
    connection.query('SELECT * FROM notes WHERE userID = ?',[userId], function (error, results, fields) {
        if (error) {
          res.send({
            "code":400,
            "failed":"error ocurred"
          })
        }else{
          if(results.length>0){
              res.send({
                  "notes":results
              })
          }
        }
        });
})


app.post('/app/sites/list/:userId',async (req,res)=>{
    var id = req.body.notesID;
    var title =req.body.title;
    var notes= await bcrypt.hash(req.body.textNote,5) ;
    var userId=req.params.userId;
    var data={
        "notesId":id,
        "title":title,
        "textNote":notes,
        "userID" :userId
    }
    connection.query('INSERT INTO notes SET ?',data,function (error, results, fields) {
        if (error) {
          res.send({
            "code":400,
            "failed":"error ocurred"
          })
        }else{
          res.send({
              "status":"success"
          })
        }
        });
})

app.listen(3000, () => {
    console.log('Server is running at port 3000');
});