// utils/date.ts
export const formatDateFr = (dateInput: string | number | Date) => {
    return new Date(dateInput).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };
  