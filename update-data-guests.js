const fs = require('fs');
const SUPABASE_URL = 'https://rpccqbydibkmkpmrlxgv.supabase.co/rest/v1/wedding_vault?id=eq.matrimonio_mm_vault_master';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwY2NxYnlkaWJrbWtwbXJseGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MDI1OTUsImV4cCI6MjEwODk3ODU5NX0.1Gz2KzPHDCUq4ub_5OY5RuUz3eRQ6G3-p33GXyxojro';

async function updateDataJs() {
  const res = await fetch(SUPABASE_URL, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY
    }
  });
  const data = await res.json();
  const cloudData = data[0].data;
  
  const content = fs.readFileSync('js/data.js', 'utf8');
  const marker = '"guests":';
  const idx = content.indexOf(marker);
  
  const beforeGuests = content.substring(0, idx + marker.length);
  const formattedGuests = ' ' + JSON.stringify(cloudData.guests, null, 2) + '\n};\n';
  
  fs.writeFileSync('js/data.js', beforeGuests + formattedGuests);
  console.log('js/data.js updated with', cloudData.guests.length, 'guests!');
}

updateDataJs();
