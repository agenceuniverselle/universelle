
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";

// Type for property data
export interface PropertyData {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  date: string;
}

/**
 * Converts property data to CSV and initiates download
 */
export const exportToCsv = (properties: PropertyData[]) => {
  // Define headers
  const headers = [
    "ID", 
    "Titre", 
    "Localisation", 
    "Prix", 
    "Type", 
    "Statut", 
    "Chambres", 
    "Salles de bain", 
    "Surface", 
    "Date"
  ];
  
  // Convert properties to CSV rows
  const rows = properties.map((property) => [
    property.id,
    property.title,
    property.location,
    property.price,
    property.type,
    property.status,
    property.bedrooms.toString(),
    property.bathrooms.toString(),
    property.area,
    property.date,
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const today = new Date().toISOString().slice(0, 10);
  saveAs(blob, `Biens_Immobiliers_${today}.csv`);
};

/**
 * Converts property data to PDF and initiates download
 */
export const exportToPdf = (properties: PropertyData[]) => {
  // Create new jsPDF instance
  const doc = new jsPDF();
  
  // Add title
  const title = "Liste des Biens Immobiliers";
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Add date
  const today = new Date().toLocaleDateString("fr-FR");
  doc.setFontSize(11);
  doc.text(`Généré le: ${today}`, 14, 30);
  
  // Define table columns
  const columns = [
    { header: "ID", dataKey: "id" },
    { header: "Titre", dataKey: "title" },
    { header: "Localisation", dataKey: "location" },
    { header: "Prix", dataKey: "price" },
    { header: "Type", dataKey: "type" },
    { header: "Statut", dataKey: "status" },
    { header: "Surface", dataKey: "area" },
  ];
  
  // Convert properties to table data format
  const data = properties.map((property) => ({
    id: property.id,
    title: property.title,
    location: property.location,
    price: property.price,
    type: property.type,
    status: property.status,
    area: property.area,
  }));
  
  // Add table to document
  (doc as any).autoTable({
    startY: 40,
    head: [columns.map(col => col.header)],
    body: data.map(item => columns.map(col => item[col.dataKey as keyof typeof item])),
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: { overflow: "linebreak", cellWidth: "auto" },
    columnStyles: { 
      0: { cellWidth: 15 }, // ID column
      1: { cellWidth: 50 }, // Title column
    },
  });
  
  // Save document
  doc.save(`Liste_Biens_Immobiliers_${today.replace(/\//g, "-")}.pdf`);
};

/**
 * Opens a print-optimized view of property data
 */
export const printProperties = (properties: PropertyData[]) => {
  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Veuillez autoriser les popups pour l'impression");
    return;
  }
  
  // Generate HTML content
  const today = new Date().toLocaleDateString("fr-FR");
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Liste des Biens Immobiliers - ${today}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        h1 {
          color: #2980b9;
          margin-bottom: 10px;
        }
        .date {
          margin-bottom: 20px;
          font-style: italic;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #2980b9;
          color: white;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        @media print {
          .no-print {
            display: none;
          }
          body {
            margin: 0;
            padding: 15px;
          }
          button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="text-align: right; margin-bottom: 20px;">
        <button onclick="window.print()" style="padding: 8px 16px; background: #2980b9; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Imprimer
        </button>
      </div>
      
      <h1>Liste des Biens Immobiliers</h1>
      <div class="date">Généré le: ${today}</div>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Localisation</th>
            <th>Prix</th>
            <th>Type</th>
            <th>Statut</th>
            <th>Chambres</th>
            <th>Surface</th>
          </tr>
        </thead>
        <tbody>
          ${properties.map(property => `
            <tr>
              <td>${property.id}</td>
              <td>${property.title}</td>
              <td>${property.location}</td>
              <td>${property.price}</td>
              <td>${property.type}</td>
              <td>${property.status}</td>
              <td>${property.bedrooms}</td>
              <td>${property.area}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <script>
        // Auto-print when loaded
        window.onload = function() {
          setTimeout(function() {
            // window.print();
          }, 500);
        };
      </script>
    </body>
    </html>
  `;
  
  // Write content to new window
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
