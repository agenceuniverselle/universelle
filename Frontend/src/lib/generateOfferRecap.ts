import jsPDF from 'jspdf';

export async function generateOfferRecap({
  firstName,
  lastName,
  email,
  phone,
  offer,
  financing,
  message,
  bienTitle,
  bienPrice
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  offer: string;
  financing: string;
  message?: string;
  bienTitle: string;
  bienPrice: string;
}) {
  const doc = new jsPDF();

  const logoUrl = '/logo.png';
  const qrUrl = '/scan.png';
  const tapIconUrl = '/tap.png';
  const whatsappUrl = 'https://wa.me/212665944626';

  const getBase64FromUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const logoBase64 = await getBase64FromUrl(logoUrl);
  const qrBase64 = await getBase64FromUrl(qrUrl);
  const tapIconBase64 = await getBase64FromUrl(tapIconUrl);

  doc.addImage(logoBase64, 'PNG', 55, 10, 100, 25);

  let y = 45;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Merci ${firstName} ${lastName} !`, 105, y, { align: 'center' });

  y += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Nous avons bien reçu votre offre concernant le bien "${bienTitle}" affiché à ${bienPrice}.
Notre équipe vous recontactera dans les plus brefs délais pour vous accompagner dans la suite des démarches.Merci pour votre confiance en Agence Universelle.`,
    105,
    y,
    { align: 'center', maxWidth: 180 }
  );

  y += 30;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Détails de votre offre', 14, y);
  y += 10;

  const addField = (label: string, value: string | undefined) => {
    if (!value) return;
    doc.setFont('helvetica', 'bold');
    doc.text(`${label} :`, 14, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${value}`, 60, y);
    y += 8;
  };

  addField('Offre', `${offer} MAD`);
  addField('Nom complet', `${firstName} ${lastName}`);
  addField('Email', email);
  addField('Téléphone', phone);
  addField('Financement', financing === 'cash' ? 'Comptant' : financing === 'mortgage' ? 'Crédit bancaire' : 'Autre');
  addField('Message', message || '—');

  // ➕ Lien WhatsApp juste après les infos
  const contactY = y + 5;
  doc.setTextColor(40, 40, 40);
  doc.setFont('helvetica', 'bold');
  doc.text("Pour nous contacter sur WhatsApp :", 14, contactY);

  const linkText = "cliquez ici";
  const linkX = doc.getTextWidth("Pour nous contacter sur WhatsApp :") + 16;

  doc.setTextColor(212, 159, 28);
  doc.textWithLink(linkText, linkX, contactY, { url: whatsappUrl });
  doc.addImage(tapIconBase64, "PNG", linkX + doc.getTextWidth(linkText) + 2, contactY - 4.5, 5, 5);

  // ➕ QR Code en bas à droite
  const qrY = contactY + 10;
  doc.addImage(qrBase64, 'PNG', 160, qrY, 30, 30);

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text("© Agence Universelle - ICE : 003368237000048 - contact@universelle.ma - +212 808604195", 105, 286, { align: "center" });
  doc.text("Adresse : IMM17 N°9 Touzine, Complexe Bayt Laatik, Tanger 90000", 105, 289, { align: "center" });

  doc.save(`Offre_${firstName}_${lastName}.pdf`);
}
