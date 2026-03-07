# Default User Auto-Creation

## Overview
The backend automatically creates a default "Atelier" admin user on first startup if no users exist in the database.

## Default Credentials
- **Email**: atelier@gmail.com
- **Password**: 12345678
- **Role**: Admin
- **Phone**: 9876543210

## How It Works

1. When the server starts, it connects to the database
2. After successful connection, it checks if any users exist
3. If the users table is empty, it automatically creates the default user
4. The password is automatically hashed by the User model's `beforeCreate` hook
5. Success message is displayed in the console

## Testing the Setup

### Step 1: Start Fresh (Optional)
If you want to test the auto-creation, clear the users table:

```sql
TRUNCATE TABLE users;
```

### Step 2: Start the Backend
```bash
cd Backend
npm start
```

### Step 3: Check Console Output
You should see:
```
Database connected successfully
No users found. Creating default "Atelier" user...
✅ Default user "Atelier" created successfully!
📧 Email: atelier@gmail.com
🔑 Password: 12345678
Server is running on port 5000
```

### Step 4: Test Login
Use the frontend login page or API to test:

**API Test:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"atelier@gmail.com\",\"password\":\"12345678\"}"
```

**Frontend Test:**
1. Open http://localhost:5173
2. Login with:
   - Email: atelier@gmail.com
   - Password: 12345678

## Subsequent Startups

On subsequent server starts, you'll see:
```
Database connected successfully
Users table already has 1 user(s).
Server is running on port 5000
```

The default user is only created once, when the database is empty.

## Security Notes

⚠️ **Important**: Change the default password after first login in production!

The default user is created with:
- Full Admin privileges
- Active status
- Simple password for development convenience

## Troubleshooting

### User Not Created
If the user isn't created, check:
1. Database connection is successful
2. Users table exists (run `npm start` to auto-create tables)
3. No errors in console output

### Can't Login
If login fails:
1. Verify user exists: `SELECT * FROM users WHERE email='atelier@gmail.com';`
2. Check password is hashed (should start with `$2a$`)
3. Clear browser localStorage: `localStorage.clear()`
4. Try API login directly to isolate frontend issues

### Multiple Users Exist
If you already have users, the default user won't be created. To add it manually:

```sql
INSERT INTO users (name, email, password, phone, role, status, created_at, updated_at)
VALUES ('Atelier', 'atelier@gmail.com', '$2a$10$...', '9876543210', 'Admin', 1, NOW(), NOW());
```

Note: You'll need to hash the password first or use the User.create() method through the API.
