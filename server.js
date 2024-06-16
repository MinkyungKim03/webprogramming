const mongoclient = require('mongodb').MongoClient;
let mydb;
mongoclient.connect('mongodb+srv://minkyung:1234@cluster0.kdtcxok.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', function(err, client){
    if(err){console.log(err);}
    mydb = client.db('myboard');
    //mydb.collection('post').find().toArray().then(result => {
    //    console.log(result);
    //})

    app.listen(8080, function(){
        console.log("포트 8080으로 서버 대기중 ... ");
    });
});

const express = require('express');
const app = express();

let session = require("express-session");
app.use(session({
    secret : 'dkufe8938493j4e08349u',
    resave : false,
    saveUninitialized : true
}))

// body-parser 라이브러리 추가
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    req.session.destroy();
    res.render('index.ejs', {user : null});
});

app.get('/list', function(req, res){
    mydb.collection('post').find().toArray(function(err, result){
        console.log(result);
    })
    res.render('list.ejs', {data : result});
});

app.get('/enter', function(req, res){
    res.render("enter.ejs");
});

app.get('/login', function(req, res){
    console.log("req.session");
    if(req.session.user){
        console.log('세션 유지');
        res.render('index.ejs', {user : req.session.user});
    }else{
        res.render("login.ejs");
    }
});

app.get("/logout", function(req, res) {
    console.log("로그아웃");
    req.session.destroy();
    res.render('index.ejs', {user : null});
});

app.get('/signup', function(req, res){
    res.render("signup.ejs");
})

app.get('/content', function(req, res){
    res.render('content.ejs');
})

let cookieParser = require('cookie-parser');
app.use(cookieParser('ncvka0e398423kpfd'));
app.get('/cookie', function(req, res){
    let milk = parseInt(req.signedCookies.milk) + 1000;
    if(isNaN(milk))
    {
        milk = 0;
    }
    res.cookie("milk", milk, {signed : true});
    res.send("product : " + milk + "원");
});

// '/save' 요청에 대한 post 방식의 처리 루틴
app.post('/save', function(req, res){
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.body.someDate);
    //몽고DB에 데이터 저장하기
    mydb.collection('post').insertOne(
        {title : req.body.title, content : req.body.content, date : req.body.someDate}
    ).then(result => {
        console.log(result);
        console.log('데이터 추가 성공');
    });
    res.send('데이터 추가 성공');
});

app.post('/login', function(req, res){
    console.log("아이디 : " + req.body.userid);
    console.log("비밀번호 : " + req.body.userpw);
    
    mydb
    .collection("account")
    .findOne({userid : req.body.userid})
    .then((result) => {
        if(result.userpw == req.body.userpw){
            req.session.user = req.body;
            console.log('새로운 로그인');
            res.render('index.ejs', {user : req.session.user});
        }else{
            res.render('login.ejs');
        }
    });
});

app.post("/signup", function (req, res) {
    console.log(req.body.userid);
    console.log(req.body.userpw);
    console.log(req.body.usergroup);
    console.log(req.body.useremail);

    mydb
    .collection("account")
    .insertOne({
        userid : req.body.userid,
        userpw: req.body.userpw,
        usergroup: req.body.usergroup,
        useremail: req.body.useremail
    })
    .then((result) => {
        console.log("회원가입 성공");
    });
    res.redirect("/");
});