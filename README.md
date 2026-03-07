n# Advanced CRM Backend System

Enterprise-level CRM backend built with Node.js, Express, MySQL, and Sequelize using ES6 Modules.

## Features

- Complete Lead Management Workflow
- Customer Lifecycle Management
- Deal & Sales Pipeline Tracking
- Task Management System
- Activity Logging (Calls, Emails, Meetings, WhatsApp)
- Quotation & Invoice Generation
- Payment Tracking
- Support Ticket System
- Notes System
- Meta Ads Integration (Facebook & Instagram Ads)
- Marketing Dashboard & Analytics
- Lead Source Tracking
- ROI & Performance Metrics
- Role-Based Access Control
- JWT Authentication
- ES6 Modules (import/export syntax)

## Tech Stack

- Node.js (ES Modules)
- Express.js
- MySQL
- Sequelize ORM
- JWT Authentication
- Joi Validation
- Bcrypt for Password Hashing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=crm_database
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

3. Create MySQL database:
```sql
CREATE DATABASE crm_database;
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/users/login` - User login

### Users
- POST `/api/users` - Create user (Admin only)
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/:id` - Update user (Admin only)
- DELETE `/api/users/:id` - Delete user (Admin only)

### Leads
- POST `/api/leads` - Create lead
- GET `/api/leads` - Get all leads
- GET `/api/leads/:id` - Get lead by ID
- PUT `/api/leads/:id` - Update lead
- DELETE `/api/leads/:id` - Delete lead
- POST `/api/leads/:id/convert` - Convert lead to customer

### Customers
- POST `/api/customers` - Create customer
- GET `/api/customers` - Get all customers
- GET `/api/customers/:id` - Get customer by ID
- PUT `/api/customers/:id` - Update customer
- DELETE `/api/customers/:id` - Delete customer

### Deals
- POST `/api/deals` - Create deal
- GET `/api/deals` - Get all deals
- GET `/api/deals/:id` - Get deal by ID
- PUT `/api/deals/:id` - Update deal
- DELETE `/api/deals/:id` - Delete deal

### Tasks
- POST `/api/tasks` - Create task
- GET `/api/tasks` - Get all tasks
- GET `/api/tasks/:id` - Get task by ID
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task

### Activities
- POST `/api/activities` - Log activity
- GET `/api/activities` - Get all activities
- GET `/api/activities/:id` - Get activity by ID
- PUT `/api/activities/:id` - Update activity
- DELETE `/api/activities/:id` - Delete activity

### Quotations
- POST `/api/quotations` - Create quotation
- GET `/api/quotations` - Get all quotations
- GET `/api/quotations/:id` - Get quotation by ID
- PUT `/api/quotations/:id` - Update quotation
- DELETE `/api/quotations/:id` - Delete quotation

### Invoices
- POST `/api/invoices` - Create invoice
- GET `/api/invoices` - Get all invoices
- GET `/api/invoices/:id` - Get invoice by ID
- PUT `/api/invoices/:id` - Update invoice
- DELETE `/api/invoices/:id` - Delete invoice

### Payments
- POST `/api/payments` - Record payment
- GET `/api/payments` - Get all payments
- GET `/api/payments/:id` - Get payment by ID
- PUT `/api/payments/:id` - Update payment
- DELETE `/api/payments/:id` - Delete payment

### Tickets
- POST `/api/tickets` - Create support ticket
- GET `/api/tickets` - Get all tickets
- GET `/api/tickets/:id` - Get ticket by ID
- PUT `/api/tickets/:id` - Update ticket
- DELETE `/api/tickets/:id` - Delete ticket

### Notes
- POST `/api/notes` - Create note
- GET `/api/notes` - Get all notes
- GET `/api/notes/:id` - Get note by ID
- PUT `/api/notes/:id` - Update note
- DELETE `/api/notes/:id` - Delete note

### Meta Ads (Marketing)
- POST `/api/meta/connect` - Connect Meta account
- GET `/api/meta/account` - Get Meta account
- POST `/api/meta/ad-accounts/sync` - Sync ad accounts
- POST `/api/meta/campaigns/sync` - Sync campaigns
- POST `/api/meta/adsets/sync` - Sync ad sets
- POST `/api/meta/ads/sync` - Sync ads
- POST `/api/meta/insights/sync` - Sync performance insights
- GET `/api/meta/dashboard` - Get marketing dashboard
- GET `/api/meta/campaigns` - Get all campaigns
- POST `/api/meta/webhook/lead` - Webhook for Meta leads

## Project Structure

```
Backend/
├── src/
│   ├── activity/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── models/
│   │   ├── routes/
│   │   └── service/
│   ├── customer/
│   ├── deal/
│   ├── invoice/
│   ├── lead/
│   ├── note/
│   ├── payment/
│   ├── quotation/
│   ├── task/
│   ├── ticket/
│   ├── user/
│   ├── middleware/
│   ├── models/
│   ├── db/
│   └── index.js
├── .env
├── .gitignore
├── index.js
├── package.json
├── responseHelper.js
└── README.md
```

## Database Tables

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
- meta_accounts
- ad_accounts
- campaigns
- ad_sets
- ads
- ad_insights
- meta_leads

## Authentication

All endpoints (except login) require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## User Roles

- Admin - Full access
- Manager - Management access
- Executive - Sales operations
- Support - Support operations

## License

ISC
