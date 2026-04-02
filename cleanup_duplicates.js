
import db from './src/db/index.js';
import Lead from './src/lead/models/lead.model.js';
import { Sequelize } from 'sequelize';

async function cleanupDuplicates() {
  try {
    const duplicates = await Lead.findAll({
      attributes: [
        'name', 
        'phone', 
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['name', 'phone'],
      having: Sequelize.literal('count > 1')
    });

    console.log(`--- Starting duplicate cleanup ---`);
    console.log(`Found ${duplicates.length} duplicate sets.`);
    
    let totalDeleted = 0;

    for (const dup of duplicates) {
      const relatedLeads = await Lead.findAll({
        where: { name: dup.name, phone: dup.phone },
        order: [['id', 'ASC']] // Keep the one with the lowest ID
      });

      console.log(`Cleaning up: ${dup.name} (${dup.phone}) - Total: ${relatedLeads.length}`);
      
      const toKeep = relatedLeads[0];
      const toDelete = relatedLeads.slice(1);

      for (const lead of toDelete) {
        await lead.destroy();
        totalDeleted++;
      }
      console.log(`Kept ID: ${toKeep.id}, Deleted IDs: ${toDelete.map(l => l.id).join(', ')}`);
    }
    
    console.log(`--- Cleanup complete. Total records deleted: ${totalDeleted} ---`);
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupDuplicates();
