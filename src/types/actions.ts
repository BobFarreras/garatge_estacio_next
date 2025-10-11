// NOU FITXER
// Defineix l'estructura de la resposta de les nostres Server Actions.
// Això ens assegura que el client i el servidor "parlen el mateix idioma".

// Tipus per als errors de camp individuals que pot retornar Zod.
export type FieldErrors = {
  [key: string]: string[] | undefined;
};

// L'estat global del formulari que es comparteix entre servidor i client.
export type FormState = {
  success: boolean;
  message?: string | null;
  // Un missatge d'error general per a la part superior del formulari.
  error?: string | null;
  // Un objecte amb els errors específics de cada camp.
  errors?: FieldErrors | null;
};