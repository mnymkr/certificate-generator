# Certificate Generator

This project is a certificate generator that allows users to create personalized certificates based on selected templates. It uses Node.js with Express for the backend and Puppeteer for generating PDF certificates.

## Project Structure

```
certificate-generator
├── src
│   ├── generateCertificate.js  # Function to generate PDF certificates using Puppeteer
│   ├── server.js                # Express server handling requests for templates and certificate generation
├── public
│   ├── index.html               # Main HTML file for the frontend
│   ├── style.css                # Styles for the frontend
│   └── script.js                # JavaScript for handling user interactions
├── templates
│   └── [templateId]
│       ├── template.html        # HTML template for the certificate
│       └── style.css            # Styles specific to the certificate template
├── generated_pdfs               # Directory for storing generated PDF certificates
├── package.json                 # npm configuration file
└── README.md                    # Project documentation
```

## Features

- **Template Selection**: Users can select from available certificate templates.
- **Personalization**: Users can enter their name and achievement to be included in the certificate.
- **PDF Generation**: The application generates a PDF certificate that can be downloaded.

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd certificate-generator
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the server**:
   ```
   node src/server.js
   ```

4. **Access the application**: Open your browser and go to `http://localhost:3000`.

## Usage

- Select a certificate template from the dropdown list.
- Enter your name in the provided textbox.
- Input your achievement in the second textbox.
- Click the "Generate Certificate" button to create and download your certificate.

## License

This project is licensed under the MIT License.