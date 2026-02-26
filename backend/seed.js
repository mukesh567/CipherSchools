const mongoose = require('mongoose');
const { pool } = require('./config/db');
const Assignment = require('./models/Assignment');
require('dotenv').config();

const assignments = [
    {
        title: 'Customer Orders',
        description: 'Basic selection and filtering of orders.',
        difficulty: 'Easy',
        question: 'Find all distinct names of customers who have placed an order in the month of February 2024.',
        expectedQuery: "SELECT DISTINCT name FROM customers JOIN orders ON customers.id = orders.customer_id WHERE order_date BETWEEN '2024-02-01' AND '2024-02-29';",
        tables: ['customers', 'orders']
    },
    {
        title: 'High-Value Employees',
        description: 'Find top earners in each department.',
        difficulty: 'Medium',
        question: 'Retrieve the names and salaries of employees who earn more than the average salary of their respective departments.',
        expectedQuery: 'SELECT name, salary FROM employees e1 WHERE salary > (SELECT AVG(salary) FROM employees e2 WHERE e1.department_id = e2.department_id);',
        tables: ['employees', 'departments']
    }
];

const seedDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected!');

        await Assignment.deleteMany();
        await Assignment.insertMany(assignments);
        console.log('Assignments Seeded!');

        console.log('Connecting to PostgreSQL...');
        await pool.query(`
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS customers;
      DROP TABLE IF EXISTS employees;
      DROP TABLE IF EXISTS departments;

      CREATE TABLE customers (id SERIAL PRIMARY KEY, name TEXT, email TEXT);
      CREATE TABLE orders (id SERIAL PRIMARY KEY, customer_id INTEGER REFERENCES customers(id), order_date DATE, amount DECIMAL);
      
      INSERT INTO customers (name, email) VALUES ('Alice Smith', 'alice@example.com'), ('Bob Jones', 'bob@example.com'), ('Charlie Brown', 'charlie@example.com');
      INSERT INTO orders (customer_id, order_date, amount) VALUES (1, '2024-02-15', 150.00), (2, '2024-02-20', 200.00), (1, '2024-03-01', 50.00);

      CREATE TABLE departments (id SERIAL PRIMARY KEY, name TEXT);
      CREATE TABLE employees (id SERIAL PRIMARY KEY, name TEXT, salary DECIMAL, department_id INTEGER REFERENCES departments(id));

      INSERT INTO departments (name) VALUES ('Engineering'), ('Marketing'), ('Sales');
      INSERT INTO employees (name, salary, department_id) VALUES ('John Doe', 80000, 1), ('Jane Smith', 90000, 1), ('Mike Ross', 70000, 2), ('Rachel Zane', 75000, 2), ('Harvey Specter', 120000, 3);
    `);
        console.log('PostgreSQL Sandbox Seeded!');

        process.exit();
    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
};

seedDB();
