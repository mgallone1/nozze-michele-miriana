const SUPABASE_URL = 'https://rpccqbydibkmkpmrlxgv.supabase.co/rest/v1/wedding_vault?id=eq.matrimonio_mm_vault_master';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwY2NxYnlkaWJrbWtwbXJseGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MDI1OTUsImV4cCI6MjEwODk3ODU5NX0.1Gz2KzPHDCUq4ub_5OY5RuUz3eRQ6G3-p33GXyxojro';

async function check() {
  const res = await fetch(SUPABASE_URL, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY
    }
  });
  const data = await res.json();
  const d = data[0].data;
  console.log('Supabase vault updated_at:', data[0].updated_at);
  console.log('Guests count:', d.guests.length);
  console.log('All guest names:');
  d.guests.forEach((g, idx) => {
    console.log(`${idx + 1}. [${g.guestType}] ${g.name} (${g.party}) - Tot: ${g.count}, Adulti: ${g.adultsCount}, Bambini: ${g.childrenCount}`);
  });
}
check();
