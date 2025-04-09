const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');

async function readPDF(filePath) {
  console.log('Reading PDF:', filePath);
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdf(dataBuffer);
  
  // Print basic PDF info
  console.log('\nPDF Info:');
  console.log('Number of pages:', data.numpages);
  console.log('Version:', data.info.PDFFormatVersion);
  console.log('Is Encrypted:', data.info.IsEncrypted);
  
  // Print the first 1000 characters with line breaks for analysis
  console.log('\nFirst 1000 characters with line breaks:');
  const lines = data.text.split('\n').slice(0, 20);
  lines.forEach((line, i) => {
    if (line.trim()) {
      console.log(`Line ${i + 1}: ${line.trim()}`);
    }
  });
  
  // Save full text to a file for analysis
  const outputPath = path.join(__dirname, 'pdf-output.txt');
  await fs.writeFile(outputPath, data.text);
  console.log('\nFull text saved to:', outputPath);
}

// Read Computer Science syllabus as a test
const filePath = path.join(__dirname, '..', 'resources', 'curriculum', 'computer-science', '697287-2026-2028-syllabus.pdf');
readPDF(filePath).catch(console.error);
