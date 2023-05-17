const express = require('express');

const app = express();

const cors = require('cors');

require('dotenv').config();

// middlware

app.use(express.json());

app.use(cors());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Lego Landia is online');
})


app.listen(port, () => {
    console.log(`lego landia server has been started on port ${port}`);
})