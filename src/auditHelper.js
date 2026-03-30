import AuditLog from './models/auditLog.model.js';

export const logAudit = async (req, action, entityType, entityId, details = null) => {
  try {
    await AuditLog.create({
      user_id: req?.user?.id || null,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details: typeof details === 'object' ? JSON.stringify(details) : details,
      ip_address: req?.ip || null
    });
  } catch (error) {
    console.error('Audit Logging Failed:', error.message);
  }
};
