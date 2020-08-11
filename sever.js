const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const exSession = require('express-session');
const collection = require('./db.js');
const cookie = require('cookie-parser');
const flash = require('connect-flash');
const Users = require('./user');

app.set("views",'./views');
app.set('view engine','ejs');

app.use(flash());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookie());
app.use(exSession({
    secret : "mySecret",
    resave : false,
    saveUninitialized : false,
    cookie : {
        maxAge : 1000*60
    }
}));

app.use(passport.initialize());
app.use(passport.session());

//Trang chu
app.get('/',(req,res)=>{
    res.render('home');
});

app.route('/login')
//Trang login
    .get((req,res)=>{
            res.render('login', {message : req.flash('message')});
        })
    .post(passport.authenticate('local-login', { successRedirect: '/loginOk',
                                            failureRedirect: '/login',
                                            failureFlash : true})
);

var isLogin = function (req, res, next) {
       //if (req.user.authenticated)
       if (req.isAuthenticated()) {
           return next();
       }
       res.redirect('/login');
};
console.log();
app.get('/profile',isLogin,(req,res) =>{
    res.render('profile');
});

app.get('/loginOk',(req,res) =>{res.send("Ban da dang nhap thanh cong")});
//SignUp
passport.use('local-signup',new localStrategy( {passReqToCallback : true},
    function (req, username, password, done) {
        signup();
        async function signup() {
            await collection.findOne({username : username}, (err,result) => {
                if(err) throw err;
                if(result) {
                    done(null,false,req.flash('message' , 'Tài khoản đã tồn tại !'));
                }
                else {
                    var newUser = new Users();
                    newUser.username = username;
                    newUser.pwd = newUser.generateHash(password);
                    newUser.save((err) => {
                        if(err) throw err;
                        return done(null,newUser);
                    });
                }
            })
        }
    }
));
//Login
passport.use('local-login', new localStrategy({passReqToCallback : true},
    function (req,username, password, done) {
        login();
        async function login() {
            await collection.findOne({username : username},(err,res) =>{
                var user = new Users(res);
                if(err) throw err;
                if (!user) {
                    return done(null,false,req.flash('message' , 'Tài khoản này không tồn tại, vui lòng kiểm tra lại.'));
                }
                else if(!user.validPassword(password)) {
                    return done(null,false, req.flash('message' , 'Sai mật khẩu'));
                }
                else {
                    return done(null,user);
                }
            });
        }//8724 23159
    }
));


passport.serializeUser((user,done) => {
    done(null,user.username);
});

passport.deserializeUser((username ,done) => {
    check();
    async function check() {
        await collection.findOne({username : username},(err,res) => {
            if(res) return done(null,res);
            else return done(null, false);
        });
    };
});


app.route('/signup')
    .post(passport.authenticate('local-signup', {successRedirect : '/profile',
                                                failureRedirect : '/signup',
                                                failureFlash : true}))
    .get((req,res) => {
        res.render('signup', {message : req.flash('message')});
    });


app.listen(process.env.PORT || 3000,()=> {
    console.log(`Sever is running ---> http://localhost:3000`);
});

