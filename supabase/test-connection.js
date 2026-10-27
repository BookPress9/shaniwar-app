// Supabase connectivity test script
// Run: node supabase/test-connection.js

const SB_URL = 'https://katleeaentaugfszpmus.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthdGxlZWFlbnRhdWdmc3pwbXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjI1OTE3NywiZXhwIjoyMTA3ODM1MTc3fQ.wNY3yeb-Gp7_Ydr_gGcF0YwJXP8W23qzcwHMHKdbqwc';

async function testConnection() {
  try {
    const res = await fetch(`${SB_URL}/rest/v1/`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
      }
    });
    console.log('✅ Supabase HTTP status:', res.status);
    const text = await res.text();
    console.log('Response preview:', text.slice(0, 200));
    return res.status;
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    return null;
  }
}

testConnection().then(status => {
  if (status >= 200 && status < 300) {
    console.log('✅ Live Supabase project is REACHABLE');
  } else {
    console.log('⚠️  Response code:', status);
  }
});
