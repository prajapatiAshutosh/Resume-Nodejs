import * as pdfService from '../services/pdfService.js';
import * as resumeService from '../services/resumeService.js';

export const exportPDF = async (req, res) => {
  try {
    const resumeId = parseInt(req.params.id);
    const userId = req.user.id;

    const resume = await resumeService.getResumeById(resumeId, userId);

    const pdfBuffer = await pdfService.generatePDF(resume);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${resume.title.replace(/[^a-z0-9]/gi, '_')}.pdf"`
    );

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Export PDF error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to export PDF',
    });
  }
};

export const getTemplates = async (req, res) => {
  try {
    const templates = pdfService.getAvailableTemplates();

    res.status(200).json({
      success: true,
      data: { templates },
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates',
    });
  }
};

export const previewTemplate = async (req, res) => {
  try {
    const { template } = req.params;
    const { content } = req.body;

    const html = await pdfService.getTemplatePreview(template, content);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Preview template error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to preview template',
    });
  }
};
