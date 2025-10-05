#!/usr/bin/env node

/**
 * Bundle analysis script for PataDoc marketing site
 * Run with: node scripts/analyze-bundle.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing bundle size...\n');

try {
  // Build the project
  console.log('Building project...');
  execSync('npm run build', { stdio: 'inherit' });

  // Check if .next directory exists
  const nextDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(nextDir)) {
    throw new Error('.next directory not found. Build may have failed.');
  }

  // Analyze static directory
  const staticDir = path.join(nextDir, 'static');
  if (fs.existsSync(staticDir)) {
    console.log('\n📊 Bundle Analysis Results:\n');
    
    // Get chunk files
    const chunksDir = path.join(staticDir, 'chunks');
    if (fs.existsSync(chunksDir)) {
      const chunks = fs.readdirSync(chunksDir)
        .filter(file => file.endsWith('.js'))
        .map(file => {
          const filePath = path.join(chunksDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            size: stats.size,
            sizeKB: Math.round(stats.size / 1024 * 100) / 100
          };
        })
        .sort((a, b) => b.size - a.size);

      console.log('JavaScript Chunks:');
      chunks.forEach(chunk => {
        const sizeColor = chunk.sizeKB > 100 ? '🔴' : chunk.sizeKB > 50 ? '🟡' : '🟢';
        console.log(`  ${sizeColor} ${chunk.name}: ${chunk.sizeKB} KB`);
      });

      const totalJS = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
      console.log(`\nTotal JavaScript: ${Math.round(totalJS / 1024 * 100) / 100} KB`);
    }

    // Get CSS files
    const cssDir = path.join(staticDir, 'css');
    if (fs.existsSync(cssDir)) {
      const cssFiles = fs.readdirSync(cssDir)
        .filter(file => file.endsWith('.css'))
        .map(file => {
          const filePath = path.join(cssDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            size: stats.size,
            sizeKB: Math.round(stats.size / 1024 * 100) / 100
          };
        });

      if (cssFiles.length > 0) {
        console.log('\nCSS Files:');
        cssFiles.forEach(file => {
          console.log(`  📄 ${file.name}: ${file.sizeKB} KB`);
        });

        const totalCSS = cssFiles.reduce((sum, file) => sum + file.size, 0);
        console.log(`\nTotal CSS: ${Math.round(totalCSS / 1024 * 100) / 100} KB`);
      }
    }
  }

  // Performance recommendations
  console.log('\n💡 Performance Recommendations:');
  console.log('  • Keep main bundle under 200KB for optimal performance');
  console.log('  • Use dynamic imports for components below the fold');
  console.log('  • Optimize images with WebP format and proper sizing');
  console.log('  • Enable compression on your hosting platform');
  console.log('  • Consider code splitting for large dependencies');

  console.log('\n✅ Bundle analysis complete!');

} catch (error) {
  console.error('❌ Error analyzing bundle:', error.message);
  process.exit(1);
}