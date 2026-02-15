/**
 * Backend احراز هویت - هوشیکس
 * ورود و ثبت‌نام با JWT
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'hooshix-secret-key-change-in-production';
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(cors({ origin: true }));
app.use(express.json());

// بارگذاری یا ایجاد آرایه کاربران
function loadUsers() {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'نام، ایمیل و رمز عبور الزامی است.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'رمز عبور حداقل ۶ کاراکتر باشد.' });
    }
    const users = loadUsers();
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
        return res.status(400).json({ message: 'این ایمیل قبلاً ثبت شده است.' });
    }
    const hashedPassword = bcrypt.hashSync(password.trim(), 10);
    const user = {
        id: Date.now().toString(),
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
    res.status(201).json({
        token,
        user: { id: user.id, name: user.name, email: user.email }
    });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
        return res.status(400).json({ message: 'ایمیل و رمز عبور الزامی است.' });
    }
    const users = loadUsers();
    const normalizedEmail = (email + '').trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'ایمیل یا رمز عبور اشتباه است.' });
    }
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
    res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email }
    });
});

// اختیاری: بررسی توکن
app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'توکن یافت نشد.' });
    }
    const token = authHeader.slice(7);
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const users = loadUsers();
        const user = users.find(u => u.id === decoded.userId);
        if (!user) return res.status(401).json({ message: 'کاربر یافت نشد.' });
        res.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (e) {
        return res.status(401).json({ message: 'توکن نامعتبر یا منقضی است.' });
    }
});

app.listen(PORT, () => {
    console.log(`سرور احراز هویت روی پورت ${PORT} در حال اجرا است.`);
});
