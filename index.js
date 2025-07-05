require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/resetRoutes');

const app = express();

// Permitir cualquier origen (CORS abierto)
app.use(cors());

app.use(bodyParser.json());
app.use('/auth', routes);

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`Reset Password Microservice running on port ${PORT}`);
});
