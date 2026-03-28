import express from 'express';
import serviceCatalogController from '../controller/service_catalog.controller.js';
import authenticate from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import { createServiceDto, updateServiceDto } from '../dto/service_catalog.dto.js';

const router = express.Router();

router.get('/categories', authenticate, serviceCatalogController.getCategories);
router.get('/', authenticate, serviceCatalogController.getAll);
router.get('/:id', authenticate, serviceCatalogController.getById);
router.post('/', authenticate, validate(createServiceDto), serviceCatalogController.create);
router.put('/:id', authenticate, validate(updateServiceDto), serviceCatalogController.update);
router.delete('/:id', authenticate, serviceCatalogController.delete);

export default router;
