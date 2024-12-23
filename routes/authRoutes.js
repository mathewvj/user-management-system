const express = require('express')
const router = express.Router()
const User =  require('../models/userModel')
require('dotenv').config


router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
router.get('/signup',(req,res)=>{

  if(req.session.user){

    res.redirect('/home')
    
  }else{

    res.render('signup')
  }
    
})

router.post('/signup',async(req,res)=>{
    try {

      const email = req.body.email

      const existingUser = await User.findOne({email})
      if(existingUser){
        return res.render('signup',{message:"Email already exists"})
      }

        const user = new User({
            name:req.body.name,
            age: req.body.age,
            mobile:req.body.mobile,
            email:req.body.email,
            password:req.body.password
        })
       await user.save()
       res.redirect('/login')
       
    } catch (error) {
     res.status(400).send(error.message);
        
    }
}
)

router.get('/login',(req,res)=>{

  if(req.session.user){

    res.redirect('/home')

  }else if(req.session.admin){
    
    res.redirect('/admin')
  }
  else{
    const error =  req.session.error;
      res.render('login',{error})

  }
})

router.post('/login',async(req,res)=>{

    const {email, password} = req.body

    try {

        const user = await User.findOne({email})
        if(!user || !( await user.comparePassword(password))){
          req.session.error='Invalid User and password ';
            return res.redirect('login')
        }
        req.session.userId = user._id
        req.session.isAdmin = user.isAdmin
       
          if(req.session.isAdmin){
            req.session.admin=true;
            return res.redirect('/admin')
          }else{
            req.session.user=true
           return res.redirect('/home')
          }
        
    } catch (error) {
      res.status(500).send('Server error');
        
    }
})

router.get('/home',async(req,res)=>{
  const userId = req.session.userId
  const user = await User.findById(userId).lean()
  if(req.session.userId){
    res.render('home',{userName:user.name})
  }else{
    res.redirect('/login')
  }
   
})

router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
})

module.exports = router