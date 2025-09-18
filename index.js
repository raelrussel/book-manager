const express = require('express');
const booksRouter = require('./routes/books');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
require('./db');

const app = express();
app.use(express.json());
app.use(logger);

app.use('/books', booksRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Book Manager API listening on http://localhost:${PORT}`);
});