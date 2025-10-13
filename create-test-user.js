const { createClient } = require('@supabase/supabase-js');

// Load environment variables
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2];
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUser() {
  try {
    // Create a user record in our users table for testing
    const { data, error } = await supabase
      .from('users')
      .upsert({
        email: 'testuser@gmail.com',
        display_name: 'Test User',
        username: 'testuser',
        role: 'submitter'
      }, {
        onConflict: 'email'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
    } else {
      console.log('✅ Test user created:', data);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

createTestUser();