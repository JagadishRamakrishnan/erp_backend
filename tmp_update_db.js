import { Sequelize } from 'sequelize';
const sequelize = new Sequelize('mysql://dutch:DutchDB123@167.71.229.209:3306/crm');

async function updateDB() {
  try {
    console.log('Starting DB update...');
    await sequelize.query("ALTER TABLE lead_assignment_rules MODIFY priority VARCHAR(100)");
    await sequelize.query("ALTER TABLE lead_assignment_rules MODIFY criteria_value VARCHAR(255)");
    console.log('Database updated successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error updating database:', err);
    process.exit(1);
  }
}

updateDB();
