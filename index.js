const path = require('path');
const express = require('express');
const { Sequelize, Model, DataTypes } = require('sequelize');

const { PORT = 3000 } = process.env;
process.on('uncaughtException', error => console.log(error));

const app = express();

console.log('Starting database');
const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: path.join(__dirname, 'storage.db'),
});

class User extends Model {}
User.init({
	firstName: DataTypes.STRING,
	lastName: DataTypes.STRING,
}, {
	sequelize,
	modelName: 'user',
});

class Transaction extends Model {}
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

app.use(express.urlencoded( { extended: true } ));
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.render('home')
});

app.post('/users', (req, res) => {
	User.create({
		firstName: req.body.first_name,
		lastName: req.body.last_name,
	}).then(user => {
		res.status(201).json(user);
	}).catch(error => {
		res.status(500).send(error);
	});
});

app.get('/users', (req, res) => {
	User.findAndCountAll().then(users => {
		res.json({
			results: users.count,
			users: users.rows,
		});
	}).catch(error => {
		res.status(500).send(error);
	});
});

app.get('/users/:id', (req, res) => {
	User.findOne({
		where: {
			id: req.params.id,
		},
	}).then(user => {
		res.json(user);
	}).catch(error => {
		res.status(500).send(error);
	});
});

app.get('/users/:id/balance', (req, res) => {
	Transaction.findAndCountAll({
		where: {
			from: req.params.id,
			to: req.params.id,
		},
	}).then(async trans => {
		let total = 0;

		trans.rows.forEach(row => {
			let mult = 1;
			if (row.from === req.params.id) {
				mult = -1;
			}

			total += (mult * row.amount);
		});	

		await User.findOne({
			where: {
				id: req.params.id,
			},
		}).catch(error => {
			res.status(500).send(error)
		})

		res.status(200).json({
			balance: total,
			
		})
	});
});
app.get('/users/:id/transactions');
app.get('/users/:id/transactions/:tid');

// Create user
app.post('/users')

// Create transaction
app.post('/users/:from_id/make_transaction');

// modify transaction
app.put('/users/:uid/transactions/:tid');

app.listen(PORT, console.log(`Server listening on port ${PORT}`));