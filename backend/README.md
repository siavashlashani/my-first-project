# بک‌اند احراز هویت هوشیکس

سرور ساده ورود و ثبت‌نام با Node.js و JWT.

## نصب و اجرا

```bash
cd backend
npm install
npm start
```

سرور روی `http://localhost:3000` اجرا می‌شود.

## API

- **POST** `/api/auth/register` — ثبت‌نام  
  بدنه: `{ "name", "email", "password" }`

- **POST** `/api/auth/login` — ورود  
  بدنه: `{ "email", "password" }`

- **GET** `/api/auth/me` — اطلاعات کاربر (هدر: `Authorization: Bearer <token>`)

## نکته

برای تست از طریق فایل HTML، صفحه را از طریق یک سرور (مثلاً Live Server) باز کنید تا درخواست به `localhost:3000` بدون مشکل ارسال شود.
