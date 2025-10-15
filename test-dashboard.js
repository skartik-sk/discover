// Test Dashboard API
// Run this in browser console when logged in

async function testDashboardAPI() {
  try {
    // Get session token
    const { data: { session } } = await window.supabase?.auth.getSession() || {};
    
    if (!session) {
      console.error('❌ No session found. Please sign in first.');
      return;
    }

    console.log('✅ Session found:', {
      user_id: session.user.id,
      email: session.user.email,
      expires_at: new Date(session.expires_at * 1000).toLocaleString()
    });

    // Test dashboard API
    console.log('📡 Calling dashboard API...');
    const response = await fetch('/api/dashboard', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Dashboard API failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return;
    }

    const data = await response.json();
    console.log('✅ Dashboard API success:', data);
    
    // Validate data structure
    if (!data.profile) {
      console.warn('⚠️ No profile in response');
    } else {
      console.log('👤 Profile:', {
        id: data.profile.id,
        auth_id: data.profile.auth_id,
        username: data.profile.username,
        email: data.profile.email
      });
    }

    if (data.projects) {
      console.log(`📁 Found ${data.projects.length} projects`);
    }

    if (data.stats) {
      console.log('📊 Stats:', data.stats);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
console.log('🧪 Starting dashboard API test...');
testDashboardAPI();
