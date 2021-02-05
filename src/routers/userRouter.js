// Import 3rd party modules from Node Package Manager (NPM)
const express = require('express');
const { Op } = require('sequelize');

// UserRouter (function, object, whatever you want to call it. EIAO.)
// Takes one object parameter in which only two parts are used,
// User & Transaction. These are the Sequelize models that communicate
// with our database.
function UserRouter({
	User,
	Transaction,
}) {
	this.User = User;
	this.Transaction = Transaction;

	// Instanciate our new router middleware
	this.router = express.Router();

	// /users POST endpoint. This is in order to create a new row in the database
	// with the information of a new user. TLDR; a really crappy signup.
	this.router.post('/', (req, res) => {
		this.User.create({
			firstName: req.body.first_name,
			lastName: req.body.last_name,
			balance: 0,
		}).then(user => {
			// Return status 201 (Created) and the new user's information
			res.status(201).json(user);
		}).catch(error => {
			// Return a status 500 (Server error) and the error that occurred.
			// In a real-world scenario you wouldn't want this information
			// being displayed to an end-user as it could reveal sensitive
			// information about the backend of the web server and the database
			// being used.
			res.status(500).send(error);
		});
	});

	// /users GET endpoint. A very basic endpoint that literally
	// returns every user in the database.
	this.router.get('/', (_req, res) => {
		this.User.findAndCountAll().then(users => {
			// Return a custom response based on the information we already have
			// only really for asthetics.
			res.status(200).json({
				results: users.count,
				users: users.rows,
			});
		}).catch(error => {
			// Return HTTP status 500 (Server error) and send the error
			res.status(500).send(error);
		});
	});

	// /users/<ID> Gets a user by their unique ID by using Sequelize to query
	// essentially the SQL command; SELECT * WHERE id = `req.params.id` LIMIT = 1
	// on our database.
	this.router.get('/:id', (req, res) => {
		this.User.findOne({
			where: {
				id: req.params.id,
			},
		}).then(user => {
			// Send off a successful status code and the User object received by the
			// SQL query.
			res.status(200).json(user);
		}).catch(error => {
			// Return HTTP status 500 (Server error) and send the error
			res.status(500).send(error);
		});
	});

	// /users/<ID>/balance GET - gets the balance for a user, which is a running total
	// of all transactions in a ledger.
	this.router.get('/:id/balance', (req, res) => {
		/*this.Transaction.findAndCountAll({
			where: {
				[Op.or]: [
					{
						from: req.params.id,
					},
					{
						to: req.params.id,
					},
				],
			},
		}).then(async trans => {
			// This is a very inefficient implementation of working out the balance.
			// A cuter way to do it would be to have a running total,
			// not as an airtight system, but rather almost as a cache,
			// with the balance being confirmed against the full 
			// transaction ledger when speed isn't expected and power isn't required.
			//
			// This goes beyond the scope of this school project, (to which I have
			// already massively exceeded), but if I ever get bored and
			// want to fiddle with it I might.

			let total = 0;

			trans.rows.forEach(row => {
				let mult = 1;
				if (row.from === req.params.id) {
					mult = -1;
				}

				total += (mult * row.amount);
			});

			// return successful status code and send JSON response
			res.status(200).json({
				balance: total,
			});
		});*/
		User.findOne({
			where: {
				id: req.params.id,
			},
		}).then(user => {
			res.status(200).json({
				balance: user.balance,
			});
		}).catch(error => {
			res.status(500).send(error);
		});
	});
}

// Allow other files in the program to access the router
// middleware in this very file.
//
// This function takes an object as options, which contain
// the Sequelize instances (models?) of each table
// in the database.
module.exports = (options) => {
	// As UserRouter is an object, we can instanciate it with the
	// same options parameter as was given from the parent file.
	// Importing this file creates a new instance of the class,
	// and allows access only to the router.
	return (new UserRouter(options)).router;
};