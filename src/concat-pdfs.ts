import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

async function concatenatePDFs(pdfPaths: string[], outputPath: string): Promise<void> {
    const mergedPdf = await PDFDocument.create();

    for (const pdfPath of pdfPaths) {
        const pdfBytes = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    fs.writeFileSync(outputPath, mergedPdfBytes);
    console.log(`Merged PDF saved to ${outputPath}`);
}

function getPDFFilesFromFolder(folderPath: string): string[] {
    return fs.readdirSync(folderPath)
        .filter(file => file.endsWith('.pdf')) // Filter for PDF files
        .map(file => path.join(folderPath, file)) // Get full path
        .sort(); // Sort alphabetically
}

// Example usage
const args = process.argv.slice(2); // Get command-line arguments, excluding the first two


let folderPath: string = args.length > 0 ? args[0]: './pdfs';
const outputFile: string = 'combined.pdf';

const pdfFiles: string[] = getPDFFilesFromFolder(folderPath);
if (pdfFiles.length === 0) {
    console.log('No PDF files found in the specified folder.');
} else {
    concatenatePDFs(pdfFiles, outputFile).catch(err => console.error(err));
}