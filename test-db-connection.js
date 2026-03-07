import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

async function testConnection() {
  console.log('🔍 Testing Database Connection...\n');
  
  console.log('📋 Configuration:');
  console.log(`   Host: ${process.env.DB_HOST || 'NOT SET'}`);
  console.log(`   User: ${process.env.DB_USER || 'NOT SET'}`);
  console.log(`   Password: ${process.env.DB_PASSWORD ? '***' : 'EMPTY'}`);
  console.log(`   Database: ${process.env.DB_NAME || 'NOT SET'}`);
  console.log(`   Port: ${process.env.DB_PORT || 'NOT SET'}\n`);

  try {
    // Test connection without database first
    console.log('🔌 Attempting to connect to MySQL server...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });
    
    console.log('✅ Connected to MySQL server successfully!\n');

    // Check if database exists
    console.log('🔍 Checking if database exists...');
    const [databases] = await connection.query('SHOW DATABASES');
    const dbExists = databases.some(db => db.Database === process.env.DB_NAME);
    
    if (dbExists) {
      console.log(`✅ Database '${process.env.DB_NAME}' exists!\n`);
    } else {
      console.log(`❌ Database '${process.env.DB_NAME}' does NOT exist!`);
      console.log(`\n💡 Create it with:`);
      console.log(`   CREATE DATABASE ${process.env.DB_NAME};\n`);
    }

    // Test connection with database
    if (dbExists) {
      console.log('🔌 Testing connection to database...');
      await connection.query(`USE ${process.env.DB_NAME}`);
      console.log('✅ Successfully connected to database!\n');
      
      // Show tables
      const [tables] = await connection.query('SHOW TABLES');
      if (tables.length > 0) {
        console.log(`📊 Found ${tables.length} tables:`);
        tables.forEach(table => {
          console.log(`   - ${Object.values(table)[0]}`);
        });
      } else {
        console.log('📊 No tables found (will be created on first run)');
      }
    }

    await connection.end();
    console.log('\n✅ All checks passed! You can start the server now.');
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error(`   Error: ${error.message}\n`);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Solutions:');
      console.log('   1. Check DB_USER in .env file');
      console.log('   2. Check DB_PASSWORD in .env file');
      console.log('   3. If no password, leave DB_PASSWORD empty');
      console.log('   4. Try: mysql -u root -p (to test credentials)\n');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Solutions:');
      console.log('   1. Start MySQL service');
      console.log('   2. Check if MySQL is installed');
      console.log('   3. Verify MySQL is running on port 3306\n');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Solution:');
      console.log(`   Create database: CREATE DATABASE ${process.env.DB_NAME};\n`);
    }
  }
}

testConnection();
