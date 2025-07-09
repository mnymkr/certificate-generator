const form = document.getElementById('certificateForm');
const templateSelect = document.getElementById('templateSelect');
const nameInput = document.getElementById('nameInput');
const achievementInput = document.getElementById('achievementInput');
const templateRootPath = '../templates';

async function fetchTemplates() {
    console.log('Fetching templates...');
    const response = await fetch(templateRootPath);
    const templates = await response.json();
    templates.forEach(template => {
        const option = document.createElement('option');
        option.value = template;
        option.textContent = template;
        templateSelect.appendChild(option);
    });
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const templateId = templateSelect.value;
    const name = nameInput.value;
    const achievement = achievementInput.value;

    const response = await fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateId, name, achievement }),
    });

    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'certificate.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
    }
});

fetchTemplates();