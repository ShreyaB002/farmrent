const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = 3000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'farmrent',
    password: '123456',
    database: 'machine_rental_db'
});

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PAGES
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.get('/signup', (req, res) => res.sendFile(__dirname + '/public/signup.html'));
app.get('/login', (req, res) => res.sendFile(__dirname + '/public/login.html'));
app.get('/owner', (req, res) => res.sendFile(__dirname + '/public/owner.html'));
app.get('/admin', (req, res) => res.sendFile(__dirname + '/public/admin.html'));

// SIGNUP API
app.post('/api/signup', async (req, res) => {
    console.log('Signup:', req.body);
    try {
        const { fullName, phone, email, password, role } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (full_name, phone, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [fullName, phone, email, hash, role]
        );
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        res.json({ error: error.message });
    }
});

// LOGIN API
app.post('/api/login', async (req, res) => {
    try {
        const { loginId, password, role } = req.body;
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE (phone = ? OR email = ?) AND role = ?',
            [loginId, loginId, role]
        );
        if (rows.length > 0 && await bcrypt.compare(password, rows[0].password_hash)) {
            res.json({ success: true, user: rows[0] });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        res.json({ error: error.message });
    }
});

// TEST
app.get('/api/test', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users LIMIT 5');
        res.json({ success: true, users: rows });
    } catch (error) {
        res.json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚜 LIVE: http://localhost:${PORT}`);
    console.log(`📝 Signup: http://localhost:${PORT}/signup`);
    console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
});
