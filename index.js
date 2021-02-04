const express = require('express');

const { PORT } = process.env;
const app = express();

app.get('/users')
app.get('/users/:id')
app.get('/users/:id/balance')
app.get('/users/:id/transactions')
app.post('/users/:id/make_transaction')
app.put('/users/:uid/transactions/:tid')

app.listen(PORT, console.log(`Server listening on port ${PORT}`));