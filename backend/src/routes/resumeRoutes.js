import express from 'express';
import * as resumeController from '../controllers/resumeController.js';
import * as pdfController from '../controllers/pdfController.js';
import { authenticateUser } from '../middleware/auth.js';
import { validate, resumeSchema } from '../middleware/validate.js';

const router = express.Router();

// All resume routes require authentication
router.use(authenticateUser);

// Resume CRUD routes
router.get('/', resumeController.getAllResumes);
router.post('/', validate(resumeSchema), resumeController.createResume);
router.get('/:id', resumeController.getResumeById);
router.put('/:id', validate(resumeSchema), resumeController.updateResume);
router.delete('/:id', resumeController.deleteResume);

// PDF export route
router.post('/:id/export/pdf', pdfController.exportPDF);

// Template routes
router.get('/templates/list', pdfController.getTemplates);
router.post('/templates/:template/preview', pdfController.previewTemplate);

export default router;
