document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('image-input');
    const previewArea = document.getElementById('preview-area');
    const generatePdfButton = document.getElementById('generate-pdf');
    let imageFiles = [];
  
    imageInput.addEventListener('change', (e) => {
      previewArea.innerHTML = '';
      imageFiles = Array.from(e.target.files);
  
      imageFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Contenedor para cada imagen y su número
          const previewItem = document.createElement('div');
          previewItem.classList.add('preview-item');
  
          // Miniatura de imagen
          const img = document.createElement('img');
          img.src = reader.result;
          img.dataset.index = index;
          img.draggable = true;
  
          // Número de página
          const pageNumber = document.createElement('span');
          pageNumber.classList.add('page-number');
          pageNumber.textContent = `Página ${index + 1}`;
  
          // Añadir eventos drag-and-drop
          img.addEventListener('dragstart', handleDragStart);
          img.addEventListener('dragover', handleDragOver);
          img.addEventListener('drop', handleDrop);
  
          previewItem.appendChild(img);
          previewItem.appendChild(pageNumber);
          previewArea.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
      });
    });
  
    // Generar PDF
    generatePdfButton.addEventListener('click', () => {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF();
      let fileName = '';
  
      imageFiles.forEach((file, index) => {
        const img = previewArea.querySelectorAll('img')[index];
        pdf.addImage(img.src, 'JPEG', 10, 10, 190, 0);
        if (index < imageFiles.length - 1) pdf.addPage();
        fileName = fileName || file.name.split('.')[0];
      });
  
      pdf.save(`${fileName || 'document'}.pdf`);
    });
  
    // Drag-and-drop
    function handleDragStart(e) {
      e.dataTransfer.setData('text/plain', e.target.dataset.index);
    }
  
    function handleDragOver(e) {
      e.preventDefault();
      e.target.style.border = '2px dashed #007bff';
    }
  
    function handleDrop(e) {
      e.preventDefault();
      const draggedIndex = e.dataTransfer.getData('text/plain');
      const targetIndex = e.target.dataset.index;
      [imageFiles[draggedIndex], imageFiles[targetIndex]] = [
        imageFiles[targetIndex],
        imageFiles[draggedIndex],
      ];
  
      previewArea.innerHTML = '';
      imageFiles.forEach((file, index) => {
        const previewItem = document.createElement('div');
        previewItem.classList.add('preview-item');
  
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.dataset.index = index;
        img.draggable = true;
  
        const pageNumber = document.createElement('span');
        pageNumber.classList.add('page-number');
        pageNumber.textContent = `Página ${index + 1}`;
  
        img.addEventListener('dragstart', handleDragStart);
        img.addEventListener('dragover', handleDragOver);
        img.addEventListener('drop', handleDrop);
  
        previewItem.appendChild(img);
        previewItem.appendChild(pageNumber);
        previewArea.appendChild(previewItem);
      });
    }
  });
  