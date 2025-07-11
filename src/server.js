// Required imports
const express = require('express');
const PSD = require('psd');
const fs = require('fs');
const path = require('path');
const generateCertificate = require('./generateCertificate');
const templateRootPath = '../templates';

// Create an Express application
const app = express();
app.use(express.json());

// Ensure the generated PDFs directory exists
const pngDir = path.join(__dirname, '../generated_pngs');
if (!fs.existsSync(pngDir)) {
    fs.mkdirSync(pngDir);
}

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint to fetch available templates
app.get('/templates', (req, res) => {
    const templatesPath = path.join(__dirname, templateRootPath);
    const templates = fs.readdirSync(templatesPath).filter(file => 
        fs.statSync(path.join(templatesPath, file)).isDirectory()
    );
    res.json(templates);
});

// Endpoint to generate a PNG certificate from a PSD template
app.post('/generate', async (req, res) => {
    const { templateId, name, achievement } = req.body;
    if (!templateId || !name || !achievement) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Build the path to the requested PSD template file
        const templatePsdPath = path.join(__dirname, templateRootPath, templateId, `${templateId}.psd`);
        if (!fs.existsSync(templatePsdPath)) {
            return res.status(404).json({ error: 'Template PSD not found' });
        }

        // Output PNG path
        // const outputPngName = `${Date.now()}-${templateId}-certificate.png`;
        const outputPngName = "certificate.png"; // For simplicity, using a fixed name
        const outputPngPath = path.join(pngDir, outputPngName);

        // Generate PNG from PSD
        await generateCertificate(templatePsdPath, { name, achievement }, outputPngPath);

        // Send the PNG file for download
        res.download(outputPngPath, outputPngName, (err) => {
            if (err) {
                console.error('Download error:', err);
                return res.status(500).json({ error: 'Failed to download certificate' });
            }
            // Optionally clean up the generated file after download
            fs.unlinkSync(outputPngPath);
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to generate certificate' });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));