// Import Node modules that are needed in this file
const path = require('path');
const express = require('express');
const { Sequelize, Model, DataTypes } = require('sequelize');

// Import express middlewares that are used
const transactionRouter = require('./routers/transactionRouter');
const userRouter = require('./routers/userRouter');

// Configure a default PORT and extract from the environment variables
// object. This is useful for hosting on places like Heroku and Repl.it
const { PORT = 3000 } = process.env;

// Create our new express app
const app = express();

// Create our new database instance.
// It is worth noting that there is no server database going on here,
// but we can create a locally stored database file with SQLITE and Sequelize
// that means I don't have to rent and go through the hassle of setting up
// a database for hosting this school project
const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: path.join(__dirname, '../storage.db'),
});

class User extends Model {}
class Transaction extends Model {}

// Create our user model
User.init({
	firstName: DataTypes.STRING,
	lastName: DataTypes.STRING,
	balance: DataTypes.DECIMAL,
}, {
	sequelize,
	modelName: 'users',
});

// Create our transaction model
Transaction.init({
	from: DataTypes.INTEGER,
	to: DataTypes.INTEGER,
	amount: DataTypes.DECIMAL,
}, {
	sequelize,
	modelName: 'transactions_history',
});

// Sync these models up to the database.
User.sync();
Transaction.sync();

// Configure the view engine, EJS, which allows for HTML to
// be dynamically rendered based on the content we want the user
// to see.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
// These are our express middlewares. Middlewares are **like** functions
// (subroutines for the person from AQA who might be looking at this),
// and they follow a set format to allow the webserver to be made well without
// having to repeat a lot of code.
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Express routers are a type of middleware that make keeping files smaller and nicer
// to maintain easier. It prepends every endpoint inside the middleware with the url provided
// which makes maintenence easier and files smaller. I know I didn't explain that well at all,
// but oh well it is half one in the morning and I can't brain right now.
app.use('/transactions', transactionRouter({ User, Transaction }));
app.use('/users', userRouter({ User, Transaction }));

// Homepage. Render the home.ejs in views.
app.get('/', (req, res) => {
	res.render('home');
});

// Make the HTTP server listen on the port specified in process.env
// and log what port it is currently listening to.
app.listen(PORT, console.log(`Server listening on port ${PORT}`));