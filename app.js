const express = require('express');
const exphbs = require('express-handlebars');
const userRouter = require('./routes/users');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const User = require('./models/User');

const app = express();
const PORT = 5000;

//MongoDb Connection
mongoose.connect("mongodb://localhost/passportdb",{
  useNewUrlParser : true
});
const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection Error"));
db.once("open",() => {
  console.log("Connected to Database")
});

//Template Engine Middleware
app.engine('handlebars', exphbs({defaultLayout: 'mainLayout'}));
app.set('view engine', 'handlebars');


//Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));

// Router Middleware
app.use(userRouter);

app.get("/",(req,res,next)=>{
  User.find({})
    .then(users => {
      res.render("pages/index",{users});
    }).catch(err => console.log(err));
  res.render("pages/index");
});
app.use((req,res,next) => {
  res.render("static/404");
});

app.listen(PORT,()=>{
  console.log("App Started");
});
