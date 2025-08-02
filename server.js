const express = require('express');
const fs = require('fs');
const path = require('path');
const { registerFont, createCanvas, loadImage } = require('canvas');

const app = express();
const PORT = process.env.PORT || 3000;

// Vercel-compatible paths
const TEMPLATES_DIR = path.join(process.cwd(), 'public/templates');

// Middleware
app.use(express.json());

// Register fonts before creating canvas
registerFont(path.join(process.cwd(), 'node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff'), {
  family: 'Roboto',
  weight: 'normal',
  style: 'normal'
});


// API Endpoints
app.get('/templates', async (req, res) => {
  try {
    const files = await fs.promises.readdir(TEMPLATES_DIR);
    const templates = files
      .filter(file => file.endsWith('.png'))
      .map(file => file.replace('.png', ''));
    res.json(templates);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to load templates' });
  }
});

// Static files (must come AFTER API routes)
app.use('public/templates', express.static(TEMPLATES_DIR));
app.use(express.static(path.join(process.cwd(), 'public')));

// Start server (different for Vercel)
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Generate preview with enhanced positioning rules
app.post('/preview', async (req, res) => {
  const { template, name, achievement } = req.body;
  
  try {
    // Load template image
    const imgPath = path.join(TEMPLATES_DIR, `${template}.png`);
    const image = await loadImage(imgPath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    // Load coordinates and font sizes
    const coordPath = path.join(TEMPLATES_DIR, `${template}.txt`);
    const coords = fs.readFileSync(coordPath, 'utf8').split('\n');
    
    // Parse configuration with special rules
    let [nameX, nameY, nameFontSize] = coords[0].split(',').map(Number);
    let [achievementX, achievementY, achievementFontSize] = coords[1].split(',').map(Number);
    const maxWidth = coords[2] ? Number(coords[2]) : 0;
    
    // Use registered font
    ctx.font = `bold ${nameFontSize}px Roboto`;  // Changed from Arial to Roboto
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText(name, nameX, nameY);
    
    ctx.drawImage(image, 0, 0);

    if (nameX == 0) {
      nameX = canvas.width / 2;
    }

    if (achievementX == 0) {
      achievementX = canvas.width / 2;
    }
    
    // Calculate positions with center alignment for 0 values
    const getNameX = (x) => x === 0 ? canvas.width / 2 : x;
    const getAchievementX = (x) => x === 0 ? canvas.width / 2 : x;

    // Draw name
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.font = `bold ${nameFontSize}px Arial`;
    // ctx.fillText(name, getNameX(nameX), nameY);
    ctx.fillText(name, nameX, nameY);

    // Draw achievement with conditional wrapping
    ctx.font = `${achievementFontSize}px Arial`;
    
    if (maxWidth === 0) {
      // No wrapping - single line
      // ctx.fillText(achievement, getAchievementX(achievementX), achievementY);
      ctx.fillText(achievement, achievementX, achievementY);
    } else {
      // With wrapping
      const lineHeight = achievementFontSize * 1.2;
      const words = achievement.split(' ');
      let line = '';
      let y = achievementY;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && i > 0) {
          // ctx.fillText(line, getAchievementX(achievementX), y);
          ctx.fillText(line, achievementX, y);
          line = words[i] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      // ctx.fillText(line, getAchievementX(achievementX), y);
      ctx.fillText(line, achievementX, y);
    }

    // Send PNG
    res.setHeader('Content-Type', 'image/png');
    canvas.createPNGStream().pipe(res);
    
  } catch (err) {
    console.error('Error generating preview:', err);
    res.status(500).send('Error generating preview');
  }
});

// ... rest of your server code (templates list endpoint, etc.)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));