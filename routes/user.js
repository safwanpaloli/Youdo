const db=require('../connection/connection')
const data=require('../helpers/userdata')
var express = require('express');
const { response } = require('express');
const userdata = require('../helpers/userdata');
const { render, use } = require('../app');
const { usersignup, loginUser, updateNotes } = require('../helpers/userdata');
var router = express.Router();

/* GET home page. */
// check login status
const loginstatus= ((req,res,next)=>{
     if(req.session.loginstatus){
         res.redirect('/')
        }
})



router.get('/', function(req, res, next) {
  let user= req.session.loggedIn
    const userid=req.session.loginid
    data.getnotes(userid).then((notesdata)=>{
      res.render('index',{notesdata,user})
   })
});

router.post('/',(req,res)=>{
  const {ntitle,notearea }=req.body
  const userid=req.session.loginid 
  console.log(userid)
  data.addnotes(ntitle,notearea,userid).then((getdata)=>{
    res.redirect('/')
  })
  })
 
  router.get('/delete/:id',(req,res)=>{
   const noteid = req.params.id
   data.deletenotes(noteid).then((response)=>{
       res.redirect('/')
   })
 }) 

 router.get('/edit/:id',(req,res)=>{
   noteid= req.params.id
   console.log(noteid)
 
  })

  router.get('/account',((req,res)=>{
    if(req.session.loginstatus){
        res.redirect('/') 
    }else{
       res.render('account',{err:req.session.login})
       req.session.loginErr=false
    }
  }
  ))

 router.post('/account',((req,res)=>{
     const data=req.body
     loginUser(data).then((loginuser)=>{
         if(loginuser.status){
            req.session.loggedIn=loginuser.username
            req.session.loginstatus=true
            req.session.loginid=loginuser.userid
            res.redirect('/')
         }else{
             res.redirect('/account')    
             req.session.loginErrStatus=true 
             req.session.login="wewrwe"
             console.log("user not found")
          }
     })     
  }))

  router.get('/signup',((req,res)=>{
   if(req.session.loginstatus){
      res.render('/')
   }else{
      res.render('signup')
   }
   }))
  
  router.post('/signup',(req,res)=>{
    const {Name,username,password} = req.body
    console.log(req.body)
    usersignup(req.body).then((response)=>{
      console.log(response)
      req.session.loginstatus=true
      res.redirect('/')
    
    })
  })

router.get('/logout',(req,res)=>{
   req.session.destroy()
   res.redirect('/')
})

router.post('/update/:id',(req,res)=>{
   const userid= req.params.id  
   console.log(userid)
   const data= req.body
   console.log(data)
   
   updateNotes(userid,data).then((response)=>{
      console.log(response)
      res.redirect('/')
   })
})

router.get('/settings/:id',(req,res)=>{
    if(req.session.loginstatus){
      let userid=req.params.id
     data.getSpecificUser(userid).then((userdata)=>{
      res.render('settings',{userdata})
   })
    }else{
        res.redirect('/account')
    }
})

module.exports = router;
 