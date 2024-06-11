require('dotenv').config()

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors')

const indexRouter = require('./routes/index');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB)
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB')
})

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json( { error: err.message })
})


const port = process.env.PORT || 3000
app.listen(port, (err)=>{
  if (err) console.log("Error in server Setup")
  console.log(`Server listening on Port ${port}`)
})
