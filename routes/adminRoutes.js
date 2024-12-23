const express = require('express')
const router = express.Router()
const User = require('../models/userModel')



const adminMiddleware = (req,res,next)=>{
    if(!req.session.isAdmin){
        return res.redirect('/login')
    }
    next()
}

router.get('/', adminMiddleware, async (req, res) => {
    try {
      const users = await User.find({isAdmin:false});
      
      res.render('admin', { users });
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

  router.get('/search', adminMiddleware, async (req, res) => {

    const { query } = req.query;

    try {

      const users = await User.find({

            name: new RegExp(query, 'i'),isAdmin:false
      })
      if(users){

        res.render('admin', { users });
      }else{
        req.session.error = "No User Found"
        const error = req.session.error
        res.render('admin',{error})
      }

      

    } catch (err) {

      res.status(500).send('Server error');
    }
  });

  router.get('/edit-user/:userId', async (req, res) => {
    try {
      if(req.session.userId){
        const userId = req.params.userId;
          const user = await User.findById(userId);

          if (!user) {
              return res.status(404).send('User not found');
          }

          res.render('edit-user', { user }); 
      }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Server error');
    }
});


router.post('/edit-user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { name, age, mobile, email } = req.body;

      
        const user = await User.findByIdAndUpdate(
            userId,
            { name, age, mobile, email }, 
            { new: true, runValidators: true } 
        );

        if (!user) {
            return res.status(404).send('User not found');
        }
        res.redirect('/admin');


    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Server error');
    }
});

router.post('/delete/:id', adminMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
      await User.findByIdAndDelete(id);
      res.redirect('/admin');
    } catch (err) {
      res.status(500).send('Error deleting user');
    }
  });
  
module.exports = router