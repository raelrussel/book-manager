const db = require('../db');

function validateBookPayload(payload, requireAll = true) {
  const { title, author, year } = payload;
  if (requireAll) {
    if (!title || !author || typeof year === 'undefined') {
      return 'title, author and year are required';
    }
  }
  if (title !== undefined && String(title).trim().length === 0) {
    return 'title cannot be empty';
  }
  if (author !== undefined && String(author).trim().length === 0) {
    return 'author cannot be empty';
  }
  if (year !== undefined) {
    const y = parseInt(year, 10);
    if (Number.isNaN(y)) return 'year must be a number';
    if (y < 0 || y > 3000) return 'year seems invalid';
  }
  return null;
}

exports.createBook = async (req, res, next) => {
  try {
    const errMsg = validateBookPayload(req.body, true);
    if (errMsg) return res.status(400).json({ error: errMsg });

    const { title, author, year } = req.body;
    const parsedYear = parseInt(year, 10);

    const result = await db.run(
      'INSERT INTO books (title, author, year) VALUES (?, ?, ?)',
      [title.trim(), author.trim(), parsedYear]
    );
    const book = await db.get('SELECT * FROM books WHERE id = ?', [result.id]);
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

exports.getBooks = async (req, res, next) => {
  try {
    const { title, author, year } = req.query;
    let sql = 'SELECT * FROM books';
    const conditions = [];
    const params = [];

    if (title) {
      conditions.push('title LIKE ?');
      params.push(`%${title}%`);
    }
    if (author) {
      conditions.push('author LIKE ?');
      params.push(`%${author}%`);
    }
    if (year) {
      const y = parseInt(year, 10);
      if (Number.isNaN(y)) return res.status(400).json({ error: 'year filter must be a number' });
      conditions.push('year = ?');
      params.push(y);
    }
    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY id DESC';

    const rows = await db.all(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });

    const book = await db.get('SELECT * FROM books WHERE id = ?', [id]);
    if (!book) return res.status(404).json({ error: 'book not found' });
    res.json(book);
  } catch (err) {
    next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'request body is empty' });
    }

    const errMsg = validateBookPayload(req.body, false);
    if (errMsg) return res.status(400).json({ error: errMsg });

    const fields = [];
    const params = [];

    if (req.body.title !== undefined) {
      fields.push('title = ?');
      params.push(req.body.title.trim());
    }
    if (req.body.author !== undefined) {
      fields.push('author = ?');
      params.push(req.body.author.trim());
    }
    if (req.body.year !== undefined) {
      params.push(parseInt(req.body.year, 10));
      fields.push('year = ?');
    }

    if (fields.length === 0) return res.status(400).json({ error: 'no valid fields to update' });

    const sql = `UPDATE books SET ${fields.join(', ')}, updated_at = datetime('now') WHERE id = ?`;
    params.push(id);

    const result = await db.run(sql, params);
    if (result.changes === 0) return res.status(404).json({ error: 'book not found' });

    const book = await db.get('SELECT * FROM books WHERE id = ?', [id]);
    res.json(book);
  } catch (err) {
    next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });

    const result = await db.run('DELETE FROM books WHERE id = ?', [id]);
    if (result.changes === 0) return res.status(404).json({ error: 'book not found' });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
