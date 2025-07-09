const express = require('express');
const PSD = require('psd');
const fs = require('fs');
const path = require('path');
const generateCertificate = require('./generateCertificate');
const templateRootPath = '../templates';

const app = express();
app.use(express.json());

const pdfDir = path.join(__dirname, 'generated_pdfs');
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir);
}

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

app.get('/templates', (req, res) => {
    const templatesPath = path.join(__dirname, templateRootPath);
    const templates = fs.readdirSync(templatesPath).filter(file => 
        fs.statSync(path.join(templatesPath, file)).isDirectory()
    );
    res.json(templates);
});

app.post('/generate', async (req, res) => {
    const { templateId, name, achievement } = req.body;
    if (!templateId || !name || !achievement) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const templatePath = path.join(__dirname, templateRootPath, templateId, 'template.html');
        const cssPath = path.join(__dirname, templateRootPath, templateId, 'style.css');
        const outputPdfPath = path.join(pdfDir, `${Date.now()}-certificate.pdf`);

        await generateCertificate(templatePath, cssPath, { name, achievement }, outputPdfPath);
        res.download(outputPdfPath, 'certificate.pdf', (err) => {
            if (err) console.error('Download error:', err);
            fs.unlinkSync(outputPdfPath);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate certificate' });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));