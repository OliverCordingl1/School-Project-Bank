const path = require('path');
const express = require('express');
const { Sequelize, Model, DataTypes } = require('sequelize');

const transactionRouter = require('./routers/transactionRouter');
const userRouter = require('./routers/userRouter');

const { PORT = 3000 } = process.env;

const app = express();

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: path.join(__dirname, 'storage.db'),
});

class User extends Model {}
class Transaction extends Model {}

User.init({
	firstName: DataTypes.STRING,
	lastName: DataTypes.STRING,
}, {
	sequelize,
	modelName: 'user',
});

Transaction.init({
	from: DataTypes.INTEGER,
	to: DataTypes.INTEGER,
	amount: DataTypes.DECIMAL,
}, {
	sequelize,
	modelName: 'transactions',
});

User.sync();
Transaction.sync();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(transactionRouter({ User, Transaction }));
app.use(userRouter({ User, Transaction }));

app.get('/', (req, res) => {
	res.render('home');
});


app.listen(PORT, console.log(`Server listening on port ${PORT}`));