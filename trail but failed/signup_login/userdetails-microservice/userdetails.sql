CREATE TABLE userdetails (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  address TEXT,
  phone_number TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
