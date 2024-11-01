import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default async function GeneratePdf(selectedItems, setGeneratingPdf) {
    const pdf = new jsPDF();
    const pdfName = "Assessment-cards.pdf";
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const scale = 2.5; // Scale to fit the card size
    const cardWidth = 181 / scale;
    const cardHeight = 252 / scale;

    setGeneratingPdf(true);

    for (let i = 0; i < selectedItems.length; i++) {
        const item = selectedItems[i];
        const cardElement = document.getElementById(item._id);
        if (!cardElement) {
            console.error('Card element not found:', item._id);
            continue;
        }

        
        // Capture the front face of the card
        const canvasFront = await html2canvas( document.getElementById(item._id)); 
        const imgDataFront = canvasFront.toDataURL('image/jpeg');
        
        // Position the front image at the top left of the page
        pdf.addImage(imgDataFront, 'JPEG', 0, 0, cardWidth, cardHeight);  // Align top left

        // Only add a new page if there is another card or for the back face
        if (i < selectedItems.length - 1 || i === selectedItems.length - 1) {
            pdf.addPage();
        }


        // Get the shadow root of the card element
        const cardComponent = cardElement.shadowRoot;

        // Capture the back face of the card
        const canvasBack = await html2canvas(cardComponent.querySelector('.front')); 
        const imgDataBack = canvasBack.toDataURL('image/jpeg');
        
        // Position the back image at the top right of the new page
        pdf.addImage(imgDataBack, 'JPEG', pdfWidth - cardWidth, 0, cardWidth, cardHeight);  // Align top right

        // Add a new page for the next card's front image if there are more cards
        if (i < selectedItems.length - 1) {
            pdf.addPage();
        }
    }
    setGeneratingPdf(false);

    pdf.save(pdfName);
}
