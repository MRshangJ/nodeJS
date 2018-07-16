const express = require('express');    //导入express模块
const svgCaptcha = require('svg-captcha');
const path=require("path")
 
let app = express();    //调用方法创建服务器
app.use(express.static('static'));    //静态资源托管 光标定位 填写静态资源文件件相对路径
app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,"static/views/login.html"));
})
app.get('/captcha', function (req, res) {
    var captcha = svgCaptcha.create();
    console.log(captcha.text);
    res.type('svg');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
    res.status(200).send(captcha.data);
});
app.listen(80,'127.0.0.1',()=>{console.log('success')});    //监听127.0.0.1:80
//请使用命令 npm i express 将express模块done下来