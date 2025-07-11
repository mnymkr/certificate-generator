const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs');
const PSD = require('psd');

async function generateCertificate(templatePath, data, outputPngPath) {
    console.log('generateCert - Template path: ', templatePath); // DEBUG
    var psd = PSD.fromFile(templatePath);
    psd.parse();

    console.log('PSD file loaded:', psd); // DEBUG
    // png = psd.image.toPng();
    await psd.image.saveAsPng(outputPngPath);
    console.log('Certificate generated at:', outputPngPath);
}

// async function generateCertificate(templatePath, cssPath, data, outputPdfPath) {
//     const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
//     const cssContent = fs.readFileSync(cssPath, 'utf8');

//     const template = handlebars.compile(htmlTemplate);
//     const filledHtml = template(data);

//     const htmlWithCss = `<style>${cssContent}</style>${filledHtml}`;

//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.setContent(htmlWithCss, { waitUntil: 'networkidle0' });
//     await page.pdf({ path: outputPdfPath, format: 'A4', printBackground: true });
//     await browser.close();
// }

module.exports = generateCertificate;