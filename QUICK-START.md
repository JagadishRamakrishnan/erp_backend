# Quick Start Guide

## 🚀 Get Your CRM Backend Running in 5 Minutes!

### Step 1: Configure Database

Open `Backend/.env` and update with your MySQL credentials:

```env
DB_USER=root
DB_PASSWORD=your_password_here
```

**Common Configurations:**

**XAMPP/WAMP (No Password):**
```env
DB_USER=root
DB_PASSWORD=
```

**MySQL with Password:**
```env
DB_USER=root
DB_PASSWORD=mypassword
```

### Step 2: Create Database

Open MySQL and run:

```sql
CREATE DATABASE crm_database;
```

**Quick Ways:**
- **phpMyAdmin:** http://localhost/phpmyadmin → New → `crm_database`
- **Command Line:** `mysql -u root -p` → `CREATE DATABASE crm_database;`
- **MySQL Workbench:** Create new schema → `crm_database`

### Step 3: Test Connection (Optional)

```bash
cd Backend
node test-db-connection.js
```

This will show you:
- ✅ If MySQL is running
- ✅ If credentials are correct
- ✅ If database exists
- ✅ Connection status

### Step 4: Start Backend

```bash
cd Backend
npm start
```

You should see:
```
Database connected successfully
Server is running on port 5000
```

### Step 5: Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will run on: http://localhost:5173

### Step 6: Create First User

**Option 1: Using API (Postman/Thunder Client)**

POST `http://localhost:5000/api/users`

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "Admin"
}
```

**Option 2: Using MySQL**

```sql
USE crm_database;

INSERT INTO users (name, email, password, role, status, created_at, updated_at)
VALUES (
  'Admin User',
  'admin@example.com',
  '$2a$10$YourHashedPasswordHere',
  'Admin',
  1,
  NOW(),
  NOW()
);
```

### Step 7: Login

Go to http://localhost:5173/login

- Email: `admin@example.com`
- Password: `admin123`

## 🎉 You're Done!

Your CRM is now running with:
- ✅ Backend API on port 5000
- ✅ Frontend on port 5173
- ✅ Database connected
- ✅ All 19 tables created
- ✅ Ready to use!

## 📚 What's Available

### 12 Complete Modules
1. Users & Authentication
2. Leads Management
3. Customers Management
4. Deals/Opportunities
5. Tasks Management
6. Activities Logging
7. Quotations
8. Invoices
9. Payments
10. Support Tickets
11. Notes System
12. Meta Ads Integration

### 19 Database Tables
All tables are created automatically on first run!

### API Endpoints
- 60+ API endpoints ready to use
- Full CRUD operations
- Authentication & Authorization
- Filtering & Sorting

## 🐛 Troubleshooting

### "Access denied for user"
→ Check `DB_PASSWORD` in `.env`

### "Database doesn't exist"
→ Run: `CREATE DATABASE crm_database;`

### "Can't connect to MySQL"
→ Start MySQL service

### "Port 5000 already in use"
→ Change `PORT` in `.env`

## 📖 Documentation

- **DATABASE-SETUP.md** - Detailed database setup
- **API-INTEGRATION-GUIDE.md** - Frontend API usage
- **META-ADS-MODULE.md** - Meta Ads integration
- **README.md** - Complete documentation

## 🔗 Useful Links

- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- API Docs: http://localhost:5000/api
- phpMyAdmin: http://localhost/phpmyadmin

---

**Need Help?** Check DATABASE-SETUP.md for detailed instructions!
