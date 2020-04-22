const formValidation = require('../validation/formValidation');
const bcrypt = require('bcryptjs');
const User = require("../models/User");
module.exports.getUserLogin = (req,res,next)=> {
  res.render("pages/login");
};

module.exports.getUserRegister =(req,res,next)=>{
  res.render("pages/register");
};

module.exports.postUserLogin = (req,res,next)=>{
  res.send("Login Attempted.")
};

module.exports.postUserRegister = (req,res,next)=>{
  const username = req.body.username;
  const password = req.body.password;
  const errors =  [];
  const validationErrors = formValidation.registerValidation(username,password);

  //Server Side Validation
  if (validationErrors.length>0){
  return  res.render("pages/register",{
    //kullanıcının girdiği username ve password u tekrar doldurmasın diye bu işlemi yapıyorum
      username: username,
      password: password,
      errors: validationErrors
    });
  }

  // username kontrolü
User.findOne({
  username
}).then(user => {
  if (user){
    //Email Validation
    errors.push({message: "Username Already In Use"});
    return res.render("pages/register",{
      username,
      password,
      errors
    });
  }
  bcrypt.genSalt(10,function (err,salt) {
    bcrypt.hash(password,salt,function (err,hash) {
      if (err) throw err;
        const newUser = new User({
    username:username,
    password: hash
   });
    newUser
    .save()
    .then(() => {
      console.log("Successful");
      res.redirect("/");
    })
    .catch(err => console.log(err));
    });
  })
}).catch(err => console.log(err));

};
