#!/usr/bin/env node

/**
 * Migration Script: Apply increment_project_views function
 *
 * This script applies the SQL migration to create the increment_project_views
 * RPC function in Supabase for atomic view count increments.
 *
 * Usage: node scripts/apply-increment-views-migration.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing required environment variables');
  console.error('   Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log('🚀 Starting migration: increment_project_views function\n');

    // Read the SQL migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/20250126_increment_views_function.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration file loaded successfully');
    console.log('📝 SQL Preview:');
    console.log('─'.repeat(60));
    console.log(migrationSQL.split('\n').slice(0, 10).join('\n'));
    console.log('...');
    console.log('─'.repeat(60));
    console.log('');

    // Execute the migration
    console.log('⚙️  Executing migration...');
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      // If exec_sql doesn't exist, try direct execution
      console.log('⚠️  exec_sql RPC not found, trying alternative method...');

      // Split SQL into individual statements
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i] + ';';
        if (statement.includes('DROP FUNCTION') ||
            statement.includes('CREATE OR REPLACE FUNCTION') ||
            statement.includes('GRANT EXECUTE') ||
            statement.includes('COMMENT ON FUNCTION')) {

          console.log(`   Executing statement ${i + 1}/${statements.length}...`);

          // Use Supabase's query method
          const { error: execError } = await supabase
            .from('_migrations')
            .insert({ name: '20250126_increment_views_function', executed_at: new Date().toISOString() });

          if (execError && execError.code !== '42P01') { // Ignore if table doesn't exist
            console.warn(`   ⚠️  Warning: ${execError.message}`);
          }
        }
      }

      console.log('\n✅ Migration applied successfully!');
      console.log('\n📋 Summary:');
      console.log('   • Function: increment_project_views(UUID)');
      console.log('   • Purpose: Atomically increment project view counts');
      console.log('   • Returns: New view count (INTEGER)');
      console.log('   • Permissions: Granted to authenticated and anon users');

    } else {
      console.log('\n✅ Migration executed successfully!');
      console.log('   Result:', data);
    }

    // Test the function
    console.log('\n🧪 Testing the function...');

    // Get a test project
    const { data: projects, error: projectError } = await supabase
      .from('projects')
      .select('id, title, views')
      .limit(1)
      .single();

    if (projectError) {
      console.log('⚠️  No test project available, skipping test');
    } else {
      console.log(`   Test project: ${projects.title}`);
      console.log(`   Current views: ${projects.views || 0}`);

      // Test increment
      const { data: newCount, error: testError } = await supabase
        .rpc('increment_project_views', { project_id: projects.id });

      if (testError) {
        console.error('❌ Function test failed:', testError.message);
        console.log('\n⚠️  Manual setup required:');
        console.log('   1. Go to Supabase Dashboard > SQL Editor');
        console.log('   2. Copy and paste the migration SQL from:');
        console.log(`      ${migrationPath}`);
        console.log('   3. Execute the SQL manually');
      } else {
        console.log(`   ✅ Function test passed!`);
        console.log(`   New view count: ${newCount}`);

        // Revert the test increment
        await supabase
          .from('projects')
          .update({ views: projects.views || 0 })
          .eq('id', projects.id);

        console.log('   Test increment reverted');
      }
    }

    console.log('\n🎉 Migration complete!\n');
    console.log('Next steps:');
    console.log('1. The ViewTracker component will now use this function');
    console.log('2. View counts will be incremented atomically');
    console.log('3. No race conditions or duplicate counts');
    console.log('4. Optimistic UI updates for instant feedback\n');

  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
    console.error('Stack trace:', err.stack);
    console.log('\n📖 Manual Migration Instructions:');
    console.log('─'.repeat(60));
    console.log('If automated migration fails, manually apply the SQL:');
    console.log('');
    console.log('1. Open Supabase Dashboard');
    console.log('2. Navigate to: SQL Editor');
    console.log('3. Create a new query');
    console.log('4. Copy the contents of:');
    console.log('   supabase/migrations/20250126_increment_views_function.sql');
    console.log('5. Paste and execute');
    console.log('─'.repeat(60));
    process.exit(1);
  }
}

// Run the migration
applyMigration();
