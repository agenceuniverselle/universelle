import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import { PropertyData } from "./types"; // adapte ce chemin selon ton projet
import * as XLSX from "xlsx";
import { Property } from "@/context/PropertiesContext"; // ou adapte selon ton type

// Étend les données pour correspondre à tous les champs du tableau
export interface PropertyData {
  id: string;
  title: string;
  location: string;
  quartier?: string;
  price: string;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  description?: string;
  is_featured?: boolean;
  available_date?: string;
  is_draft?: boolean;
  construction_year?: string;
  condition?: string;
  exposition?: string;
  cuisine?: string;
  has_parking?: string;
  parking_places?: number;
  climatisation?: string;
  terrasse?: string;
  points_forts?: string[];
  occupation_rate?: string;
  estimated_valuation?: string;
  estimated_charges?: string;
  monthly_rent?: string;
  proximite?: string[];
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  owner_nationality?: string;
  map_link?: string;
  created_at?: string;
  isDraft?: boolean;
}

export type PropertyData = Property;

export const exportToXlsx = (properties: PropertyData[]) => {
  const headers = [
    "ID", "Titre", "Type", "Ville", "Quartier", "Prix", "Surface", "Chambres", "Salles de bain",
    "Description", "Mis en avant", "Disponible le", "Brouillon", "Année de construction", "Condition",
    "Orientation", "Cuisine", "Parking", "Climatisation", "Terrasse", "Points forts", "Taxe d'habitation",
    "Valorisation estimée", "Frais de syndic", "Rendement locatif", "Proximité", "Nom propriétaire",
    "Email propriétaire", "Téléphone propriétaire", "Nationalité", "Lien carte", "Date de création", "Statut"
  ];

  const rows = properties.map(p => [
    p.id,
    p.title,
    p.type,
    p.location,
    p.quartier || '',
    p.price,
    p.area,
    p.bedrooms,
    p.bathrooms,
    p.description || '',
    p.is_featured ? 'Oui' : 'Non',
    p.available_date ? new Date(p.available_date).toLocaleDateString('fr-FR') : '',
    p.is_draft ? 'Oui' : 'Non',
    p.construction_year || '',
    p.condition || '',
    p.exposition || '',
    p.cuisine || '',
    p.has_parking === 'oui' ? `${p.parking_places || 1} place(s)` : 'Non',
    p.climatisation || '',
    p.terrasse || '',
    p.points_forts?.join(', ') || '',
    p.occupation_rate || '',
    p.estimated_valuation || '',
    p.estimated_charges || '',
    p.monthly_rent || '',
    p.proximite?.join(', ') || '',
    p.owner_name || '',
    p.owner_email || '',
    p.owner_phone || '',
    p.owner_nationality || '',
    p.map_link || '',
    p.created_at ? new Date(p.created_at).toLocaleDateString('fr-FR') : '',
    p.isDraft ? 'Brouillon' : p.status
  ]);

  const worksheetData = [headers, ...rows];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Biens");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const today = new Date().toISOString().slice(0, 10);
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `Biens_Immobiliers_${today}.xlsx`);
};


export const exportToPdf = (properties: PropertyData[]) => {
  const doc = new jsPDF("landscape", "pt");
  const today = new Date().toLocaleDateString("fr-FR");

  doc.setFontSize(18);
  doc.text("Liste des Biens Immobiliers", 40, 30);
  doc.setFontSize(11);
  doc.text(`Généré le: ${today}`, 40, 45);

  const headers = [
    "ID", "Titre", "Ville", "Quartier", "Type", "Prix", "Surface", "Chambres",
    "Sdb", "Condition", "Parking", "Propriétaire", "Statut"
  ];

  const rows = properties.map(p => [
    p.id,
    p.title,
    p.location,
    p.quartier || '',
    p.type,
    p.price,
    p.area,
    p.bedrooms,
    p.bathrooms,
    p.condition || '',
    p.has_parking === 'oui' ? `${p.parking_places || 1}` : 'Non',
    p.owner_name || '',
    p.isDraft ? 'Brouillon' : (p.status || '—'),
  ]);

  (doc as any).autoTable({
    startY: 60,
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: { fontSize: 8, cellWidth: 'wrap' },
  });

  doc.save(`Liste_Biens_Immobiliers_${today.replace(/\//g, "-")}.pdf`);
};

export const printProperties = (properties: PropertyData[]) => {
  console.log(properties); // ✅ ici c’est bon

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Veuillez autoriser les popups pour l'impression");
    return;
  }

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
            <th>Ville</th>
            <th>Quartier</th>
            <th>Type</th>
            <th>Prix</th>
            <th>Surface</th>
            <th>Chambres</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          ${properties.map(p => `
            <tr>
              <td>${p.id}</td>
              <td>${p.title}</td>
              <td>${p.location}</td>
              <td>${p.quartier || ''}</td>
              <td>${p.type}</td>
              <td>${p.price}</td>
              <td>${p.area}</td>
              <td>${p.bedrooms}</td>
              <td>${p.isDraft ? 'Brouillon' : p.status}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
