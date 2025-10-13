// Test script to check Supabase database structure and data
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkDatabase() {
  console.log('🔍 Checking Supabase Database Structure...\n')

  // Check tables and their structure
  const tables = ['users', 'categories', 'projects', 'project_tags']

  for (const tableName of tables) {
    console.log(`📋 Checking table: ${tableName}`)
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1)

      if (error) {
        console.log(`❌ Error accessing ${tableName}:`, error.message)
      } else {
        console.log(`✅ Table ${tableName} exists`)
        if (data && data.length > 0) {
          console.log(`   📄 Sample data structure:`, Object.keys(data[0]))
        }
      }
    } catch (err) {
      console.log(`❌ Failed to access ${tableName}:`, err.message)
    }
    console.log('')
  }

  // Check existing data
  console.log('📊 Checking existing data...\n')

  for (const tableName of tables) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.log(`❌ Error counting ${tableName}:`, error.message)
      } else {
        console.log(`📈 ${tableName}: ${count} records`)
      }
    } catch (err) {
      console.log(`❌ Failed to count ${tableName}:`, err.message)
    }
  }

  // Get sample data from each table
  console.log('\n🔍 Sample Data:\n')

  try {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, display_name, username, role')
      .limit(3)

    if (usersError) {
      console.log('❌ Error fetching users:', usersError.message)
    } else {
      console.log('👥 Sample Users:', users)
    }
  } catch (err) {
    console.log('❌ Failed to fetch users:', err.message)
  }

  try {
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(5)

    if (categoriesError) {
      console.log('❌ Error fetching categories:', categoriesError.message)
    } else {
      console.log('🏷️ Categories:', categories)
    }
  } catch (err) {
    console.log('❌ Failed to fetch categories:', err.message)
  }

  try {
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('title, slug, user_id')
      .limit(5)

    if (projectsError) {
      console.log('❌ Error fetching projects:', projectsError.message)
    } else {
      console.log('🚀 Sample Projects:', projects)
    }
  } catch (err) {
    console.log('❌ Failed to fetch projects:', err.message)
  }
}

checkDatabase().catch(console.error)