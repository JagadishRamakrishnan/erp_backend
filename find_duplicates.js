
import db from './src/db/index.js';
import Lead from './src/lead/models/lead.model.js';
import { Sequelize } from 'sequelize';

async function checkDuplicates() {
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

    console.log(`Found ${duplicates.length} duplicate sets.`);
    
    for (const dup of duplicates) {
      console.log(`Duplicate: ${dup.name} (${dup.phone}) - Count: ${dup.get('count')}`);
      
      const relatedLeads = await Lead.findAll({
        where: { name: dup.name, phone: dup.phone },
        order: [['created_at', 'ASC']]
      });

      console.log(`Lead IDs: ${relatedLeads.map(l => l.id).join(', ')}`);
      
      // I'll keep the first one (oldest) and delete the rest
      // (Just printing for now to be safe)
      /*
      for (let i = 1; i < relatedLeads.length; i++) {
        await relatedLeads[i].destroy();
        console.log(`Deleted duplicate ID: ${relatedLeads[i].id}`);
      }
      */
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDuplicates();
