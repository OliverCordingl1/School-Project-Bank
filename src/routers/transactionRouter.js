const express = require('express');
const { Op } = require('sequelize');

function TransactionRouter({
	User,
	Transaction,
}) {
	this.User = User;
	this.Transaction = Transaction;

	this.router = express.Router();

	this.router.get('/transactions', (req, res) => {
		this.Transaction.findAndCountAll().then(trans => {
			res.json({
				results: trans.count,
				transactions: trans.rows,
			});
		}).catch(error => {
			res.status(500).send(error);
		});
	});

	this.router.get('/transactions/:id', (req, res) => {
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
	this.router.post('/transactions', (req, res) => {
		// Check the amount sent is more than 0
		if (req.body.amount <= 0)
			return res.status(400).json({
				'error': 'AMOUNT_TOO_LOW',
			});
		// Check the user has enough money

		this.Transaction.create({
			to: req.body.to,
			from: req.body.from,
			amount: req.body.amount,
		});
	});

	// modify transaction
	this.router.put('/transactions/:id');
}

module.exports = (options) => {
	return (new TransactionRouter(options)).router;
};