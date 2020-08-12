var express = require('express')
var User = require('./models/user')
var md5 = require('blueimp-md5')

var router = express.Router()

router.get('/',function (req, res) {
    console.log(req.session.user)
    res.render('index.html',{
        user:req.session.user
    })
})

router.get('/login',function (req, res) {
    res.render('login.html')
})

router.post('/login',function (req, res) {
    //1.获取表单数据
    //2.查询数据库
    //3.发送响应数据
    var body = req.body
    User.findOne({
        email:body.email,
        password:md5(md5(body.password))
    },function (err, user) {
        if (err) {
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }
        if (!user) {
            return res.status(200).json({
                err_code:1,
                message:'Email or password is invalid.'
            })
        }

        //用户存在，登陆成功，通过session记录登陆状态，
        req.session.user = user

        res.status(200).json({
            err_code:0,
            message:'OK'
        })
    })
})

router.get('/register',function (req, res) {
    res.render('register.html')
})

router.post('/register',function (req, res) {
    //1.获取表单提交的数据
    //    req.body
    //2.操作数据库
    //    判断该用户是否存在，如果已存在不允许注册，如果不存在，注册新建用户
    //3.发送响应
    var body = req.body;
    User.findOne({
        $or:[
            {email:body.email},
            {nickname:body.nickname}
        ]
    },function (err, data) {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message:'Internal error'
            })
        }
        // console.log(data)
        if (data) {
            //邮箱或昵称已存在
            return res.status(200).json({
                err_code:1,
                message: 'Email or nickname aleady exists.'
            })
        }

        //对密码进行 md5 重复加密
        body.password = md5(md5(body.password))
        new User(body).save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    err_code: 500,
                    message:'Internal error'
                })
            }

            req.session.user = user


            // res.status(200).send(JSON.stringify({
            //     success:true,
            //     foo:'bar'
            // }))
            res.status(200).json({
                err_code:0,
                message:'Ok'
            })
        })


    })
})

router.get('/logout',function (req, res) {
    //清除登陆状态
    //重定向到登录页
    req.session.user = null
    res.redirect('/login')
})

module.exports = router;
