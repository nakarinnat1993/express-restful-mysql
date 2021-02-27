const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const basicAuth = require('express-basic-auth');
const helmet = require("helmet");
const cors = require('cors');
const config_env = require('./config/index');
const app_username = process.env.APP_USERNAME;
const app_password = process.env.APP_PASSWORD;
const users = {};
users[app_username] = app_password;


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const blogsRouter = require('./routes/blogs');

const app = express();


app.use(helmet());

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/blogs', basicAuth({
    users
}), blogsRouter);

module.exports = app;
