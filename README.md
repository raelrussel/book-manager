# Book Manager (minimal)

Requirements: Node.js (>=14), npm

INSTALL:
--npm install

--POSTMAN Dekstop (optional, for API Testing)

RUN:
--npm start
# or
--npm run dev

FEATURES

[POST] /books → Create a new book

[GET] /books → Get all books (with optional filters)

[GET] /books/:id → Get a book by ID

[PUT] /books/:id → Update a book by ID

[DELETE] /books/:id → Delete a book by ID

Custom middleware for logging requests

Input validation with proper error responses

SQLite database (auto-created on first run)

PROJECT STRUCTURE: 

book-manager/
├─ controllers/
│  └─ bookController.js   # CRUD logic
├─ routes/
│  └─ books.js            # Express routes
├─ middlewares/
│  ├─ logger.js           # Custom logger middleware
│  └─ errorHandler.js     # Centralized error handling
├─ db.js                  # SQLite setup & helpers
├─ index.js               # App entry point
├─ package.json
├─ README.md
└─ books.db               # SQLite DB

INSTALLATION AND SETUP:

1. Clone the repo

2. Install Dependencies (On top of the page)

3. Run the project

4. The API will be available at: http://localhost:3000 or to see the current book(s)http://localhost:3000/books

