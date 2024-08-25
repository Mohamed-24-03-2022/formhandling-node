const express = require("express");
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


const usersRouter = require('./routes/usersRouter');



app.set('public', path.join(__dirname, 'public'))
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));


app.use('/users', usersRouter);

app.get('/', (req, res) => res.redirect('/users'));


app.listen(PORT, (err) => console.log('listening on port ' + PORT));

