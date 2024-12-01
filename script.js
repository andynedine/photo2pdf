document.getElementById('convertButton').addEventListener('click', async () => {
    const imageInput = document.getElementById('imageInput');
    const files = imageInput.files;

    if (files.length === 0) {
        alert('Por favor, sube al menos una imagen.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageData = await fileToDataURL(file);
        const img = new Image();
        img.src = imageData;

        await new Promise((resolve) => {
            img.onload = () => {
                const imgWidth = pdf.internal.pageSize.getWidth();
                const imgHeight = (img.height / img.width) * imgWidth;

                if (i > 0) pdf.addPage();
                pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);
                resolve();
            };
        });
    }

    pdf.save('documento.pdf');
});

document.getElementById('imageInput').addEventListener('change', () => {
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';

    Array.from(document.getElementById('imageInput').files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            previewContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
});

function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}
