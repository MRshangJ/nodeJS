const express = require('express');    //导入express模块
const svgCaptcha = require('svg-captcha');
const path=require("path");
const session=require("express-session");
const bodyParser=require("body-parser");
const MongoClient = require('mongodb').MongoClient;


 
let app = express();    //调用方法创建服务器
const url = 'mongodb://localhost:27017';

//....................................中间件区

app.use(express.static('static'));    //静态资源托管 光标定位 填写静态资源文件件相对路径
app.use(session({
  secret: 'keyboard cat',
}))
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//.......................................路由区

app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,"static/views/login.html"));
})
app.get('/captcha', function (req, res) {
    var captcha = svgCaptcha.create();
    // console.log(captcha.text);
    res.type('svg');
    req.session.svg=captcha.text.toLocaleLowerCase();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
    res.status(200).send(captcha.data);
});
app.post("/login",(req,res)=>{
    let username=req.body.username;
    let userpass=req.body.userpass;
    if(req.body.code==req.session.svg){
        
        MongoClient.connect(url, function (err, client) {
            // Database Name
            // test-使用库的名字
            const db = client.db('test');
            // 链接到集合 hero-使用集合的名字
            const collection = db.collection('accountInfo');
            // 精确查找 find({key:val,key1:val1,...}) 不给对象就是找全部
            collection.find({username,userpass}).toArray((err, docs) => {
               if(docs.length!=0){
                req.session.userinfo={
                    username,
                    userpass
                }
                client.close();
                res.redirect("/index");
               }else{
                res.send("<script>alert('账号或密码错误');window.location='/login'</script>");
               }
            });
        });


       
    }else{
        res.send("<script>alert('验证码错误');window.location='/login'</script>");
    }
})
app.get("/index",(req,res)=>{
   if(req.session.userinfo){
    res.sendFile(path.join(__dirname,"static/views/index.html"));
   }else{
    res.redirect("/login");  
   }
})
app.get("/register",(req,res)=>{
    res.sendFile(path.join(__dirname,"static/views/register.html"));
})
app.post("/register",(req,res)=>{
    let username=req.body.username;
    let userpass=req.body.userpass;
MongoClient.connect(url, function (err, client) {
    // Database Name
    // test-使用库的名字
    const db = client.db('test');
    // 链接到集合 hero-使用集合的名字
    const collection = db.collection('accountInfo');
    // 精确查找 find({key:val,key1:val1,...}) 不给对象就是找全部
    collection.find({username}).toArray((err, docs) => {
        console.log(docs);
       if(docs.length==0){
            collection.insertOne({
                username,userpass
            }, (err, result) => {
                res.send("<script>alert('注册成功！！！');window.location='/login'</script>");
            });
            // 关闭链接
            client.close();
       }else{
        res.send("<script>alert('账号已存在');window.location='/register'</script>"); 
       }
    });
   
});
})
app.get("/logout",(req,res)=>{
    delete req.session.userinfo;
    res.redirect("/login");
})
app.get("/userinfo",(req,res)=>{
    res.send(req.session.userinfo.username);
})
app.listen(80,'127.0.0.1',()=>{console.log('success')});    //监听127.0.0.1:80
//请使用命令 npm i express 将express模块done下来；
