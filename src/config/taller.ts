// NOU FITXER
// Aquest fitxer centralitza totes les constants relacionades amb la funcionalitat del taller.
// Si demà vols canviar el número de fitxers o el nom d'una taula, només ho has de fer aquí.

// En aquest fitxer centralitzem totes les regles de negoci del taller.
export const APPOINTMENT_CONFIG = {
  /**
   * Nombre mínim de dies d'antelació per poder reservar una cita.
   * Si avui és dilluns i el valor és 7, la primera data disponible serà el dilluns següent.
   */
  MIN_BOOKING_DAYS_AHEAD: 7,

  /**
   * Nombre màxim d'arxius que es poden pujar al formulari de cita.
   */
  MAX_FILES: 3,

  /**
   * Mida màxima permesa per a cada arxiu adjunt (en MB).
   */
  MAX_FILE_SIZE_MB: 5,
};

export const AIRTABLE_TABLES = {
  APPOINTMENTS: 'Cites',
  // Podries afegir altres taules aquí si en tinguessis
};

export const CLOUDINARY_FOLDERS = {
    WORKSHOP_APPOINTMENTS: 'cites_taller',
};