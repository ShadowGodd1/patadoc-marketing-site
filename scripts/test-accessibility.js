#!/usr/bin/env node

/**
 * Accessibility testing script for PataDoc marketing site
 * Tests color contrast ratios and generates compliance report
 */

const { auditBrandColors, checkWCAGCompliance, BRAND_COLORS } = require('../lib/accessibility.js');

console.log('🔍 PataDoc Accessibility Audit\n');
console.log('=' .repeat(50));

// Test brand color combinations
console.log('\n📊 Brand Color Contrast Analysis\n');

const results = auditBrandColors();

results.forEach(result => {
  const status = result.passes ? '✅ PASS' : '❌ FAIL';
  const ratio = result.ratio.toFixed(2);
  
  console.log(`${status} ${result.context}`);
  console.log(`   Contrast Ratio: ${ratio}:1 (Required: ${result.required}:1 for ${result.level} ${result.size})`);
  console.log('');
});

// Summary
const passing = results.filter(r => r.passes).length;
const total = results.length;
const percentage = Math.round((passing / total) * 100);

console.log('=' .repeat(50));
console.log(`\n📈 Summary: ${passing}/${total} combinations pass WCAG AA (${percentage}%)\n`);

// Recommendations for failing combinations
const failing = results.filter(r => !r.passes);
if (failing.length > 0) {
  console.log('🔧 Recommendations for failing combinations:\n');
  
  failing.forEach(result => {
    console.log(`• ${result.context}:`);
    console.log(`  Current ratio: ${result.ratio.toFixed(2)}:1`);
    console.log(`  Required ratio: ${result.required}:1`);
    console.log(`  Suggestion: Consider using a darker shade or different color combination\n`);
  });
}

// Test specific high-contrast combinations
console.log('\n🎯 High-Contrast Combinations for Critical Elements:\n');

const criticalCombinations = [
  { fg: BRAND_COLORS['white'], bg: BRAND_COLORS['patadoc-teal'], context: 'CTA buttons (white on teal)' },
  { fg: BRAND_COLORS['patadoc-teal'], bg: BRAND_COLORS['white'], context: 'Main headings (teal on white)' },
  { fg: BRAND_COLORS['charcoal'], bg: BRAND_COLORS['white'], context: 'Body text (charcoal on white)' },
  { fg: BRAND_COLORS['charcoal'], bg: BRAND_COLORS['off-white'], context: 'Body text (charcoal on off-white)' }
];

criticalCombinations.forEach(({ fg, bg, context }) => {
  const result = checkWCAGCompliance(fg, bg, 'AA', 'normal');
  const status = result.passes ? '✅' : '❌';
  console.log(`${status} ${context}: ${result.ratio.toFixed(2)}:1`);
});

console.log('\n' + '=' .repeat(50));
console.log('\n✨ Accessibility audit complete!\n');

// Exit with error code if any critical combinations fail
const criticalResults = criticalCombinations.map(({ fg, bg }) => 
  checkWCAGCompliance(fg, bg, 'AA', 'normal')
);

const criticalFailures = criticalResults.filter(r => !r.passes);
if (criticalFailures.length > 0) {
  console.log('⚠️  Critical accessibility issues found. Please address before deployment.\n');
  process.exit(1);
} else {
  console.log('🎉 All critical color combinations pass WCAG AA standards!\n');
  process.exit(0);
}