export const formatDateTime = datetime => {
  if (!datetime) return '';

  if (datetime.includes('T') || datetime.includes('Z')) {
    datetime = datetime.replace('T', ' ').slice(0, 19);
  }

  return new Date(datetime).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const PLACEHOLDER_IMAGE = '../../../../assets/images/placeholder.webp';

export const BUTTON_TYPES = {
  PRINT_TICKET: 'PRINT_TICKET',
  PRINT_RECEIPT: 'PRINT_RECEIPT',
};
