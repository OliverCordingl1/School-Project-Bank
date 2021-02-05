// Import 3rd party modules from Node Package Manager (NPM)
const express = require('express');
const { Op } = require('sequelize');

// TransactionRouter (function, object, whatever you want to call it. EIAO.)
// Takes one object parameter in which only two parts are used,
// User & Transaction. These are the Sequelize models that communicate
// with our database.
function TransactionRouter({
	User,
	Transaction,
}) {
	this.User = User;
	this.Transaction = Transaction;

	// Instanciate our new router middleware
	this.router = express.Router();

	// /transactions GET endpoint. This gets all transactions that are
	// listed in the DB
	this.router.get('/', (_req, res) => {
		this.Transaction.findAndCountAll().then(trans => {
			// return successful status code + JSON
			res.status(200).json({
				results: trans.count,
				transactions: trans.rows,
			});
		}).catch(error => {
			// Return a status 500 (Server error) and the error that occurred.
			res.status(500).send(error);
		});
	});

	// /transactions/<ID> GET endpoint. This allows the details of and transaction
	// involving a user with <ID> to be retrieved from the database.
	this.router.get('/:id', (req, res) => {
		this.Transactions.findAndCountAll({
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
		}).then(trans => {
			res.status(200).json({
				results: trans.count,
				transactions: trans.rows,
			});
		}).catch(error => {
			res.status(500).send(error);
		});
	});

	// Create transaction
	this.router.post('/', async (req, res) => {
		let user;

		// Check the amount sent is more than 0
		if (req.body.amount <= 0)
			return res.status(400).json({
				'error': 'AMOUNT_TOO_LOW',
			});

		// Check the user has enough money
		if (req.body.from != 0) {
			try {
				user = await User.findOne({
					where: {
						id: req.body.from,
					},
				})
			} catch (error) {
				return res.status(500).send(error);
			}
		}

		// Check that the sender exists and has enough money,
		// or alternatively is in in god mode.
		if ((user && user.balance >= req.body.amount)
			|| req.body.from == 0) {
			// Create a new record in the transaction history
			this.Transaction.create({
				to: req.body.to,
				from: req.body.from,
				amount: req.body.amount,
			}).then(async (data) => {
				// try catch block so I can return res.send-s
				// this avoids getting "headers cannot be sent twice"
				try {
					// Update the balances
					await this.User.increment({
						balance: parseFloat(req.body.amount),
					}, {
						where: {
							id: req.body.to,
						},
					});

					await this.User.decrement({
						balance: parseFloat(req.body.amount),
					}, {
						where: {
							id: req.body.from,
						},
					});

					res.status(201).json(data);
				} catch (error) {
					// HTTP Server error and send the error
					res.status(500).send(error);
				}
			}).catch(error => {
				// HTTP Server error and send the error
				res.status(500).send(error);
			});
		} else {
			// HTTP user error and send error code 'INSUFFICIENT_FUNDS'
			res.status(417).json({
				error: 'INSUFFICIENT_FUNDS',
			});
		}
	});
}

module.exports = (options) => {
	return (new TransactionRouter(options)).router;
};