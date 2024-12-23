const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/User-Admin-System")




const express = require('express')
const app = express()

const session  =  require('express-session')
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  })
app.use(session({
    secret: 'user_admin_system',
    resave:false,
    saveUninitialized:false
}))

 
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


app.set('view engine','ejs')






const authRoute = require('./routes/authRoutes')
app.use('/',authRoute)

const adminAuth = require('./routes/adminRoutes')
app.use('/admin',adminAuth)

app.get('/',(req,res)=>{
    res.render('index')
})

app.listen(2500,()=>{
    console.log("server started....");
    
})
