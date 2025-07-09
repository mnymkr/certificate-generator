const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs');

async function generateCertificate(templatePath, cssPath, data, outputPdfPath) {
    const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    const template = handlebars.compile(htmlTemplate);
    const filledHtml = template(data);

    const htmlWithCss = `<style>${cssContent}</style>${filledHtml}`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlWithCss, { waitUntil: 'networkidle0' });
    await page.pdf({ path: outputPdfPath, format: 'A4', printBackground: true });
    await browser.close();
}

module.exports = generateCertificate;