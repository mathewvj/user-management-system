const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
// const { boolean } = require('webidl-conversions')

const userSChema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    
    },
    age:{
        type:Number,
        required:true
    },
    mobile:{
        type:Number,
        required:true

    },
    email:{
        type:String,
        required:true,
        unique:true

    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})

userSChema.pre('save',async function (next) {
    if(!this.isModified('password'))
        return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})


userSChema.methods.comparePassword = function(password){
   return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User',userSChema)