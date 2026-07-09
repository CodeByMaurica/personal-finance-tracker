CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) DEFAULT 'expense'
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id),
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type VARCHAR(20) NOT NULL,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id),
    monthly_limit DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);