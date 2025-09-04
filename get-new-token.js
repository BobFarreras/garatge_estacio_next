const { google } = require('googleapis');
const readline = require('readline');
const path = require('path');
// Carreguem les variables del fitxer .env.local
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Assegura't que les variables d'entorn existeixen
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error("Error: Les variables GOOGLE_CLIENT_ID i GOOGLE_CLIENT_SECRET no estan definides al teu fitxer .env.local.");
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000" // L'URI que acabem d'afegir
);

const scopes = ['https://www.googleapis.com/auth/calendar.events'];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline', // Molt important per obtenir el refresh_token
  scope: scopes,
  prompt: 'consent', // Força que sempre demani consentiment i doni un nou refresh_token
});

console.log('--- GENERADOR DE REFRESH TOKEN DE GOOGLE ---');
console.log('\nPas A: Visita aquesta URL al teu navegador:');
console.log(url);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('\nPas B: Després d\'autoritzar, la pàgina donarà error. Copia el "code" de la URL (el text que va després de "code=") i enganxa\'l aquí: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n----------------------------------------------------');
    if (tokens.refresh_token) {
        console.log('✅ Token generat amb èxit!');
        console.log('El teu nou Refresh Token és:');
        console.log('\x1b[32m%s\x1b[0m', tokens.refresh_token); // Imprimeix en color verd
        console.log('\nPas C: Copia aquest nou token i enganxa\'l al teu fitxer .env.local, a la variable GOOGLE_REFRESH_TOKEN.');
    } else {
        console.log('❌ No s\'ha rebut un nou Refresh Token. Això sol passar si no has revocat l\'accés previ al teu compte de Google (Pas 1 de les instruccions).');
    }
    console.log('----------------------------------------------------');
  } catch (e) {
    console.error('\n❌ Error en obtenir el token:', e.message);
  } finally {
    rl.close();
  }
});