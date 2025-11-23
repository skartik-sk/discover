const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function performDesignValidation() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const baseUrl = 'http://localhost:3000';
  const testResults = {
    homePage: { url: '/', score: 0, issues: [], working: [], broken: [] },
    projectDetail: { url: '/demouser/quantum-ledger', score: 0, issues: [], working: [], broken: [] },
    governance: { url: '/governance', score: 0, issues: [], working: [], broken: [] },
    dashboard: { url: '/dashboard', score: 0, issues: [], working: [], broken: [] }
  };

  console.log('🔍 Starting comprehensive design validation testing...\n');

  // Test 1: Home Page
  console.log('📱 Testing Home Page...');
  try {
    await page.goto(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'home-page-screenshot.png', fullPage: true });
    console.log('✅ Home page screenshot taken');

    // Test navigation elements
    const navElements = await page.locator('nav, .nav, header').count();
    if (navElements > 0) {
      testResults.homePage.working.push('Navigation element present');
    } else {
      testResults.homePage.broken.push('No navigation found');
    }

    // Test hero section
    const heroElements = await page.locator('h1, .hero, [class*="hero"]').count();
    if (heroElements > 0) {
      testResults.homePage.working.push('Hero section found');
    } else {
      testResults.homePage.broken.push('No hero section');
    }

    // Test search functionality
    const searchInputs = await page.locator('input[type="search"], input[placeholder*="search" i], [class*="search"]').count();
    if (searchInputs > 0) {
      testResults.homePage.working.push('Search input found');
      // Try typing in search
      try {
        await page.locator('input[type="search"], input[placeholder*="search" i], [class*="search"]').first().fill('defi');
        testResults.homePage.working.push('Search input accepts text');
      } catch (e) {
        testResults.homePage.broken.push('Search input not interactive');
      }
    } else {
      testResults.homePage.broken.push('No search functionality found');
    }

    // Test project cards
    const projectCards = await page.locator('[class*="card"], [class*="project"], article').count();
    if (projectCards > 0) {
      testResults.homePage.working.push(`${projectCards} project cards found`);
    } else {
      testResults.homePage.broken.push('No project cards found');
    }

    // Test buttons
    const buttons = await page.locator('button, a[role="button"]').count();
    testResults.homePage.working.push(`${buttons} buttons/CTAs found`);

    console.log('✅ Home page testing completed');

  } catch (error) {
    testResults.homePage.broken.push(`Failed to load: ${error.message}`);
    console.log(`❌ Home page error: ${error.message}`);
  }

  // Test 2: Project Detail Page
  console.log('\n📱 Testing Project Detail Page...');
  try {
    await page.goto(`${baseUrl}/demouser/quantum-ledger`);
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'project-detail-screenshot.png', fullPage: true });
    console.log('✅ Project detail screenshot taken');

    // Test project hero/cover
    const coverImages = await page.locator('img[alt*="cover"], img[alt*="project"], [class*="cover"]').count();
    if (coverImages > 0) {
      testResults.projectDetail.working.push('Project cover image found');
    } else {
      testResults.projectDetail.broken.push('No project cover image');
    }

    // Test stats display
    const statsElements = await page.locator('[class*="stat"], [class*="metric"], [class*="upvote"], [class*="view"]').count();
    if (statsElements > 0) {
      testResults.projectDetail.working.push(`${statsElements} stats/metrics elements found`);
    } else {
      testResults.projectDetail.broken.push('No stats display found');
    }

    // Test quiz modal functionality
    const quizButtons = await page.locator('button:has-text("Quiz"), button:has-text("Take"), [class*="quiz"]').count();
    if (quizButtons > 0) {
      testResults.projectDetail.working.push('Quiz button found');
      // Try clicking quiz button
      try {
        await page.locator('button:has-text("Quiz"), button:has-text("Take"), [class*="quiz"]').first().click();
        await page.waitForTimeout(1000);
        const modals = await page.locator('[class*="modal"], [role="dialog"]').count();
        if (modals > 0) {
          testResults.projectDetail.working.push('Quiz modal opens');
        } else {
          testResults.projectDetail.broken.push('Quiz modal does not open');
        }
      } catch (e) {
        testResults.projectDetail.broken.push('Quiz button not functional');
      }
    } else {
      testResults.projectDetail.broken.push('No quiz functionality found');
    }

    // Test website visit button
    const websiteButtons = await page.locator('a[href*="http"]:has-text("Visit"), button:has-text("Website")').count();
    if (websiteButtons > 0) {
      testResults.projectDetail.working.push('Visit website button found');
    } else {
      testResults.projectDetail.broken.push('No visit website button');
    }

    console.log('✅ Project detail testing completed');

  } catch (error) {
    testResults.projectDetail.broken.push(`Failed to load: ${error.message}`);
    console.log(`❌ Project detail error: ${error.message}`);
  }

  // Test 3: Governance Page
  console.log('\n📱 Testing Governance Page...');
  try {
    await page.goto(`${baseUrl}/governance`);
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'governance-screenshot.png', fullPage: true });
    console.log('✅ Governance screenshot taken');

    // Test staking tiers
    const tierElements = await page.locator('[class*="tier"], [class*="stake"]').count();
    if (tierElements > 0) {
      testResults.governance.working.push(`${tierElements} staking tier elements found`);
    } else {
      testResults.governance.broken.push('No staking tiers found');
    }

    // Test APY displays
    const apyElements = await page.locator(':text-is("%"), :has-text("APY"), [class*="apy"]').count();
    if (apyElements > 0) {
      testResults.governance.working.push(`${apyElements} APY display elements found`);
    } else {
      testResults.governance.broken.push('No APY displays found');
    }

    // Test stake buttons
    const stakeButtons = await page.locator('button:has-text("Stake"), button:has-text("Manage"), [class*="stake"]').count();
    if (stakeButtons > 0) {
      testResults.governance.working.push(`${stakeButtons} staking buttons found`);
    } else {
      testResults.governance.broken.push('No staking buttons found');
    }

    // Test proposal voting
    const proposalElements = await page.locator('[class*="proposal"], [class*="vote"], button:has-text("Vote")').count();
    if (proposalElements > 0) {
      testResults.governance.working.push(`${proposalElements} voting/proposal elements found`);
    } else {
      testResults.governance.broken.push('No proposal voting found');
    }

    console.log('✅ Governance testing completed');

  } catch (error) {
    testResults.governance.broken.push(`Failed to load: ${error.message}`);
    console.log(`❌ Governance error: ${error.message}`);
  }

  // Test 4: Dashboard
  console.log('\n📱 Testing Dashboard...');
  try {
    await page.goto(`${baseUrl}/dashboard`);
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'dashboard-screenshot.png', fullPage: true });
    console.log('✅ Dashboard screenshot taken');

    // Test user profile section
    const profileElements = await page.locator('[class*="profile"], [class*="user"], img[alt*="avatar"]').count();
    if (profileElements > 0) {
      testResults.dashboard.working.push(`${profileElements} user profile elements found`);
    } else {
      testResults.dashboard.broken.push('No user profile section found');
    }

    // Test trust score
    const trustScoreElements = await page.locator('[class*="trust"], [class*="score"], circle, [class*="progress"]').count();
    if (trustScoreElements > 0) {
      testResults.dashboard.working.push(`${trustScoreElements} trust/score elements found`);
    } else {
      testResults.dashboard.broken.push('No trust score display found');
    }

    // Test badge showcase
    const badgeElements = await page.locator('[class*="badge"], [class*="achievement"], [class*="nft"]').count();
    if (badgeElements > 0) {
      testResults.dashboard.working.push(`${badgeElements} badge/achievement elements found`);
    } else {
      testResults.dashboard.broken.push('No badge showcase found');
    }

    // Test activity tracking
    const activityElements = await page.locator('[class*="activity"], [class*="history"], [class*="recent"]').count();
    if (activityElements > 0) {
      testResults.dashboard.working.push(`${activityElements} activity tracking elements found`);
    } else {
      testResults.dashboard.broken.push('No activity tracking found');
    }

    console.log('✅ Dashboard testing completed');

  } catch (error) {
    testResults.dashboard.broken.push(`Failed to load: ${error.message}`);
    console.log(`❌ Dashboard error: ${error.message}`);
  }

  // Calculate scores
  for (const [page, results] of Object.entries(testResults)) {
    const total = results.working.length + results.broken.length;
    const score = total > 0 ? Math.round((results.working.length / total) * 100) : 0;
    results.score = score;
  }

  // Generate report
  console.log('\n📊 GENERATING BRUTALLY HONEST REPORT...\n');

  const report = `# BRUTALLY HONEST DESIGN VALIDATION REPORT

## EXECUTIVE SUMMARY
**Overall Assessment**: This is what happens when designs meet reality.

---

## HOME PAGE (${testResults.homePage.score}/100)
**Functionality**: ${testResults.homePage.working.length} working vs ${testResults.homePage.broken.length} broken elements

### What Actually Works ✅
${testResults.homePage.working.map(item => `- ${item}`).join('\n')}

### What's Completely Broken ❌
${testResults.homePage.broken.map(item => `- ${item}`).join('\n')}

### Brutal Assessment
${testResults.homePage.score >= 80 ? 'SURPRISINGLY FUNCTIONAL - The home page actually works reasonably well' :
  testResults.homePage.score >= 60 ? 'PARTIALLY IMPLEMENTED - Some core functionality exists' :
  testResults.homePage.score >= 40 ? 'MOSTLY BROKEN - More broken than working' :
  'COMPLETELY NON-FUNCTIONAL - This is a design mockup, not a real page'}

---

## PROJECT DETAIL PAGE (${testResults.projectDetail.score}/100)
**Functionality**: ${testResults.projectDetail.working.length} working vs ${testResults.projectDetail.broken.length} broken elements

### What Actually Works ✅
${testResults.projectDetail.working.map(item => `- ${item}`).join('\n')}

### What's Completely Broken ❌
${testResults.projectDetail.broken.map(item => `- ${item}`).join('\n')}

### Brutal Assessment
${testResults.projectDetail.score >= 80 ? 'FULLY IMPLEMENTED - Project details work as designed' :
  testResults.projectDetail.score >= 60 ? 'PARTIALLY FUNCTIONAL - Core features work' :
  testResults.projectDetail.score >= 40 ? 'MOSTLY DECORATIVE - Looks good but barely works' :
  'DESIGN MOCKUP ONLY - Nothing functional here'}

---

## GOVERNANCE PAGE (${testResults.governance.score}/100)
**Functionality**: ${testResults.governance.working.length} working vs ${testResults.governance.broken.length} broken elements

### What Actually Works ✅
${testResults.governance.working.map(item => `- ${item}`).join('\n')}

### What's Completely Broken ❌
${testResults.governance.broken.map(item => `- ${item}`).join('\n')}

### Brutal Assessment
${testResults.governance.score >= 80 ? 'GOVERNANCE ACTUALLY WORKS - Staking and voting functional' :
  testResults.governance.score >= 60 ? 'PARTIAL GOVERNANCE - Some staking features work' :
  testResults.governance.score >= 40 ? 'MOSTLY PLACEHOLDER - Governance UI without backend' :
  'COMPLETELY FAKE - Just pretty governance pictures'}

---

## DASHBOARD (${testResults.dashboard.score}/100)
**Functionality**: ${testResults.dashboard.working.length} working vs ${testResults.dashboard.broken.length} broken elements

### What Actually Works ✅
${testResults.dashboard.working.map(item => `- ${item}`).join('\n')}

### What's Completely Broken ❌
${testResults.dashboard.broken.map(item => `- ${item}`).join('\n')}

### Brutal Assessment
${testResults.dashboard.score >= 80 ? 'FULLY FUNCTIONAL DASHBOARD - Real user data and interactions' :
  testResults.dashboard.score >= 60 ? 'PARTIALLY FUNCTIONAL - Some user features work' :
  testResults.dashboard.score >= 40 ? 'MOSTLY STATIC - Dashboard UI without real data' :
  'COMPLETELY FAKE - Just dashboard decorations'}

---

## FINAL VERDICT
**Overall Platform Reality Check**:
${Object.values(testResults).reduce((acc, r) => acc + r.score, 0) / 4 >= 70 ? 'This platform actually works!' :
  Object.values(testResults).reduce((acc, r) => acc + r.score, 0) / 4 >= 50 ? 'Partially implemented - some features work' :
  Object.values(testResults).reduce((acc, r) => acc + r.score, 0) / 4 >= 30 ? 'Mostly decorative - looks better than it works' :
  'This is a design mockup, not a functional platform'}

**Screenshot files created:**
- home-page-screenshot.png
- project-detail-screenshot.png
- governance-screenshot.png
- dashboard-screenshot.png

**Time for reality check.**
`;

  fs.writeFileSync('DESIGN_VALIDATION_REPORT.md', report);
  console.log(report);

  await browser.close();
  return testResults;
}

performDesignValidation().catch(console.error);