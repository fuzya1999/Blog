var mongoose = require('mongoose')

var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/test',{ useNewUrlParser: true ,useUnifiedTopology: true})

var userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    nickname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true

    },
    created_time:{
        type:Date,
        default:Date.now
    },
    last_modified_time:{
        type:Date,
        default: Date.now
    },
    avatar:{
        type:String,
        default:'/public/img/avatar-max-img.png'
    },
    bio:{
        type:String,
        default:''
    },
    gender:{
        type:Number,
        enum:[-1,0,1],
        default:-1
    },
    birthday:{
        type:Date,
    },
    status:{
        type: Number,
        enum:[0,1,2],
        default:0
    }
})

module.exports = mongoose.model('User',userSchema)
