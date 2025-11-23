import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register Handlebars helpers
handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

handlebars.registerHelper('formatDate', function (dateStr) {
  if (!dateStr) return '';
  return dateStr;
});

export const generatePDF = async (resume) => {
  const { template, content } = resume;

  const templatePath = path.join(
    __dirname,
    '..',
    'templates',
    `${template}.html`
  );

  let templateContent;
  try {
    templateContent = await fs.readFile(templatePath, 'utf-8');
  } catch (error) {
    console.error('Template read error:', error);
    throw new Error(`Template ${template} not found`);
  }

  const compiledTemplate = handlebars.compile(templateContent);
  const html = compiledTemplate(content);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export const getTemplatePreview = async (templateName, content) => {
  const templatePath = path.join(
    __dirname,
    '..',
    'templates',
    `${templateName}.html`
  );

  try {
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(templateContent);
    const html = compiledTemplate(content);
    return html;
  } catch (error) {
    console.error('Template preview error:', error);
    throw new Error(`Template ${templateName} not found`);
  }
};

export const getAvailableTemplates = () => {
  return [
    { name: 'classic', label: 'Classic', description: 'Traditional professional resume' },
    { name: 'modern', label: 'Modern', description: 'Contemporary design with clean lines' },
    { name: 'minimal', label: 'Minimal', description: 'Simple and elegant layout' },
  ];
};
