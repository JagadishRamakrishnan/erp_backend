import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import companyController from '../controller/company.controller.js';
import authenticate from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import { createCompanyDto, updateCompanyDto } from '../dto/company.dto.js';

const router = express.Router();

// Logo upload config
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/logos/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `logo-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const logoUpload = multer({
  storage: logoStorage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext) ? cb(null, true) : cb(new Error('Only image files allowed'));
  },
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

router.get('/', authenticate, companyController.getAll);
router.get('/:id', authenticate, companyController.getById);
router.post('/', authenticate, validate(createCompanyDto), companyController.create);
router.put('/:id', authenticate, validate(updateCompanyDto), companyController.update);
router.delete('/:id', authenticate, companyController.delete);
router.post('/upload/logo', authenticate, logoUpload.single('logo'), companyController.uploadLogo);

export default router;
