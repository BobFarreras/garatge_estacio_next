// NOU FITXER
// Aquest fitxer centralitza totes les constants relacionades amb la funcionalitat del taller.
// Si demà vols canviar el número de fitxers o el nom d'una taula, només ho has de fer aquí.

export const APPOINTMENT_CONFIG = {
  MAX_FILES: 3,
  MAX_FILE_SIZE_MB: 5,
  MIN_BOOKING_DAYS_AHEAD: 7, // Nombre mínim de dies d'antelació per a una cita
};

export const AIRTABLE_TABLES = {
  APPOINTMENTS: 'Cites',
  // Podries afegir altres taules aquí si en tinguessis
};

export const CLOUDINARY_FOLDERS = {
    WORKSHOP_APPOINTMENTS: 'cites_taller',
};