import db from '../src/db/index.js';
import { 
    Lead, Deal, Quotation, QuotationItem, 
    Task, Activity, Note, Invoice, InvoiceItem, Payment 
} from '../src/models/associations.js';

async function cleanup() {
    console.log('--- STARTING DATABASE CLEANUP ---');
    const transaction = await db.sequelize.transaction();

    try {
        // Disable foreign key checks for the session
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { transaction });
        console.log('✔ Foreign key checks disabled.');

        const modelsToDelete = [
            { name: 'Payment', model: Payment },
            { name: 'InvoiceItem', model: InvoiceItem },
            { name: 'Invoice', model: Invoice },
            { name: 'QuotationItem', model: QuotationItem },
            { name: 'Quotation', model: Quotation },
            { name: 'Task', model: Task },
            { name: 'Activity', model: Activity },
            { name: 'Note', model: Note },
            { name: 'Deal', model: Deal },
            { name: 'Lead', model: Lead }
        ];

        for (const { name, model } of modelsToDelete) {
            if (model) {
                const count = await model.destroy({ where: {}, truncate: false, transaction });
                console.log(`✔ Deleted records from ${name}`);
            } else {
                console.warn(`✖ Model ${name} not found, skipping.`);
            }
        }

        // Re-enable foreign key checks
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { transaction });
        await transaction.commit();
        
        console.log('--- CLEANUP COMPLETED SUCCESSFULLY ---');
        process.exit(0);
    } catch (error) {
        await transaction.rollback();
        console.error('--- CLEANUP FAILED ---');
        console.error(error);
        process.exit(1);
    }
}

cleanup();
