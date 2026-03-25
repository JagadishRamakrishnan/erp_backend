import db from '../src/db/index.js';

const columns = [
  { name: 'gst_number',     def: 'VARCHAR(20) NULL' },
  { name: 'pan_number',     def: 'VARCHAR(20) NULL' },
  { name: 'logo_url',       def: 'VARCHAR(500) NULL' },
  { name: 'annual_revenue', def: 'DECIMAL(15,2) NULL' },
  { name: 'founded_year',   def: 'INT NULL' },
  { name: 'linkedin_url',   def: 'VARCHAR(255) NULL' },
  { name: 'twitter_url',    def: 'VARCHAR(255) NULL' },
  { name: 'status',         def: "ENUM('Active','Inactive') DEFAULT 'Active'" },
];

for (const col of columns) {
  try {
    await db.sequelize.query(`ALTER TABLE companies ADD COLUMN ${col.name} ${col.def}`);
    console.log(`Added: ${col.name}`);
  } catch (e) {
    if (e.message.includes('Duplicate column')) {
      console.log(`Already exists: ${col.name}`);
    } else {
      console.error(`Failed ${col.name}:`, e.message);
    }
  }
}

console.log('Done');
process.exit(0);
