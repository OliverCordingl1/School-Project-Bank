const express = require('express');
const { Op } = require('sequelize');

function UserRouter({
	User,
	Transaction,
}) {
	this.User = User;
	this.Transaction = Transaction;

	this.router = express.Router();

	this.router.post('/users', (req, res) => {
		this.User.create({
			firstName: req.body.first_name,
			lastName: req.body.last_name,
		}).then(user => {
			res.status(201).json(user);
		}).catch(error => {
			res.status(500).send(error);
		});
	});

	this.router.get('/users', (req, res) => {
		this.User.findAndCountAll().then(users => {
			res.json({
				results: users.count,
				users: users.rows,
			});
		}).catch(error => {
			res.status(500).send(error);
		});
	});

	this.router.get('/users/:id', (req, res) => {
		this.User.findOne({
			where: {
				id: req.params.id,
			},
		}).then(user => {
			res.json(user);
		}).catch(error => {
			res.status(500).send(error);
		});
	});

	this.router.get('/users/:id/balance', (req, res) => {
		this.Transaction.findAndCountAll({
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
			let total = 0;

			trans.rows.forEach(row => {
				let mult = 1;
				if (row.from === req.params.id) {
					mult = -1;
				}

				total += (mult * row.amount);
			});	

			await this.User.findOne({
				where: {
					id: req.params.id,
				},
			}).catch(error => {
				res.status(500).send(error)
			})

			res.status(200).json({
				balance: total,
			});
		});
	});
}

module.exports = (options) => {
	return (new UserRouter(options)).router;
};