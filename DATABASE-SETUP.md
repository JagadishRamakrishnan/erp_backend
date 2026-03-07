# Database Setup Guide

## Quick Setup Steps

### 1. Install MySQL

If you don't have MySQL installed:
- Download from: https://dev.mysql.com/downloads/mysql/
- Or use XAMPP/WAMP which includes MySQL

### 2. Start MySQL Server

**Using XAMPP:**
- Open XAMPP Control Panel
- Click "Start" next to MySQL

**Using MySQL Service:**
```bash
# Windows
net start MySQL80

# Or check if it's running
services.msc
```

### 3. Create Database

Open MySQL command line or phpMyAdmin and run:

```sql
CREATE DATABASE crm_database;
```

**Using MySQL Command Line:**
```bash
mysql -u root -p
# Enter your password (or press Enter if no password)

CREATE DATABASE crm_database;
exit;
```

**Using phpMyAdmin:**
1. Open http://localhost/phpmyadmin
2. Click "New" in the left sidebar
3. Enter database name: `crm_database`
4. Click "Create"

### 4. Configure .env File

Update `Backend/.env` with your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=crm_database
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

**Important Notes:**
- If you have no MySQL password, leave `DB_PASSWORD=` empty
- If you have a password, enter it: `DB_PASSWORD=yourpassword`
- Default MySQL user is usually `root`
- Default MySQL port is `3306`

### 5. Test Connection

Try starting the server:

```bash
cd Backend
npm start
```

You should see:
```
Database connected successfully
Server is running on port 5000
```

## Common Issues & Solutions

### Issue 1: "Access denied for user 'root'@'localhost'"

**Solution:** Wrong password in .env file

1. Check your MySQL password
2. Update `DB_PASSWORD` in `.env`
3. If no password, leave it empty: `DB_PASSWORD=`

### Issue 2: "Database 'crm_database' doesn't exist"

**Solution:** Create the database

```sql
CREATE DATABASE crm_database;
```

### Issue 3: "Can't connect to MySQL server"

**Solution:** MySQL is not running

- Start MySQL service
- Check if MySQL is installed
- Verify MySQL is running on port 3306

### Issue 4: Environment variables not loading

**Solution:** Already fixed in index.js

The `dotenv.config()` is now called before importing db module.

## Verify MySQL Installation

### Check if MySQL is running:

**Windows:**
```bash
# Check service status
sc query MySQL80

# Or
netstat -an | findstr 3306
```

**Command Line:**
```bash
mysql --version
```

### Test MySQL Connection:

```bash
mysql -u root -p
# Enter your password

# If successful, you'll see:
# mysql>

# Test commands:
SHOW DATABASES;
exit;
```

## MySQL Default Credentials

**XAMPP:**
- User: `root`
- Password: (empty)
- Port: `3306`

**WAMP:**
- User: `root`
- Password: (empty)
- Port: `3306`

**MySQL Installer:**
- User: `root`
- Password: (what you set during installation)
- Port: `3306`

## Update .env Based on Your Setup

### No Password (XAMPP/WAMP default):
```env
DB_USER=root
DB_PASSWORD=
```

### With Password:
```env
DB_USER=root
DB_PASSWORD=mypassword123
```

### Custom User:
```env
DB_USER=crm_user
DB_PASSWORD=crm_password
```

## Create MySQL User (Optional)

For better security, create a dedicated user:

```sql
-- Login as root
mysql -u root -p

-- Create user
CREATE USER 'crm_user'@'localhost' IDENTIFIED BY 'crm_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON crm_database.* TO 'crm_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

exit;
```

Then update .env:
```env
DB_USER=crm_user
DB_PASSWORD=crm_password
```

## Database Tables

Once connected, Sequelize will automatically create these tables:

1. users
2. leads
3. customers
4. deals
5. tasks
6. activities
7. quotations
8. quotation_items
9. invoices
10. payments
11. tickets
12. notes
13. meta_accounts
14. ad_accounts
15. campaigns
16. ad_sets
17. ads
18. ad_insights
19. meta_leads

## Verify Tables Created

After starting the server successfully:

```sql
mysql -u root -p
USE crm_database;
SHOW TABLES;
```

You should see all 19 tables listed.

## Reset Database (If Needed)

To start fresh:

```sql
DROP DATABASE crm_database;
CREATE DATABASE crm_database;
```

Then restart the server to recreate tables.

## Next Steps

1. ✅ MySQL installed and running
2. ✅ Database created
3. ✅ .env configured
4. ✅ Server started successfully
5. ✅ Tables created automatically
6. 🚀 Ready to use!

---

**Need Help?**
- Check MySQL error logs
- Verify MySQL service is running
- Test connection with MySQL Workbench
- Check firewall settings for port 3306
