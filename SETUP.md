# CRM Backend Setup Guide

## Prerequisites

1. **Node.js** (v14 or higher) - ES Modules support required
2. **MySQL** (v5.7 or higher)
3. **npm** or **yarn**

## Important Note

This project uses **ES6 Modules** (import/export) instead of CommonJS (require/module.exports). Make sure your Node.js version supports ES modules.

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd Backend
npm install
```

### 2. Configure MySQL Database

Create a new MySQL database:

```sql
CREATE DATABASE crm_database;
```

Or use MySQL Workbench or phpMyAdmin to create the database.

### 3. Configure Environment Variables

Edit the `.env` file in the Backend folder with your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=crm_database
DB_PORT=3306
JWT_SECRET=your_secret_key_change_this_in_production
NODE_ENV=development
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL password.

### 4. Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### 5. Verify Server is Running

Open your browser or Postman and visit:

```
http://localhost:5000
```

You should see:

```json
{
  "message": "CRM Backend API is running"
}
```

## Database Tables

The following tables will be automatically created when you start the server:

- users
- leads
- customers
- deals
- tasks
- activities
- quotations
- quotation_items
- invoices
- payments
- tickets
- notes

## First Steps After Setup

### 1. Create Admin User

Use Postman or any API client to create the first admin user:

**POST** `http://localhost:5000/api/users`

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "Admin",
  "phone": "1234567890"
}
```

**Note:** For the first user creation, you may need to temporarily disable authentication in the user routes or create the user directly in the database.

### 2. Login

**POST** `http://localhost:5000/api/users/login`

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

You'll receive a JWT token in the response. Use this token for all subsequent API calls.

### 3. Test Other Endpoints

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Troubleshooting

### Database Connection Error

If you see "Access denied for user 'root'@'localhost'":
- Check your MySQL username and password in `.env`
- Ensure MySQL server is running
- Verify the database exists

### Port Already in Use

If port 5000 is already in use:
- Change the PORT in `.env` to another port (e.g., 5001)
- Or stop the process using port 5000

### Module Not Found Errors

Run:
```bash
npm install
```

## Project Structure

```
Backend/
├── src/
│   ├── activity/          # Activity management
│   ├── customer/          # Customer management
│   ├── deal/              # Deal/Sales pipeline
│   ├── invoice/           # Invoice generation
│   ├── lead/              # Lead management
│   ├── note/              # Notes system
│   ├── payment/           # Payment tracking
│   ├── quotation/         # Quotation management
│   ├── task/              # Task management
│   ├── ticket/            # Support tickets
│   ├── user/              # User & authentication
│   ├── middleware/        # Auth & validation
│   ├── models/            # Model associations
│   └── db/                # Database config
├── .env                   # Environment variables
├── index.js               # Server entry point
├── package.json           # Dependencies
└── README.md              # Documentation
```

## Next Steps

1. Configure your MySQL credentials in `.env`
2. Start the server
3. Create your first admin user
4. Start building your CRM!

## Support

For issues or questions, refer to the README.md file for API documentation.
