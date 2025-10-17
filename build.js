#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple Jekyll-like include processor
function processIncludes(content, baseDir) {
  const includeRegex = /\{%\s*include\s+([^%]+)\s*%\}/g;
  
  return content.replace(includeRegex, (match, filename) => {
    const includePath = path.join(baseDir, '_includes', filename.trim());
    try {
      const includeContent = fs.readFileSync(includePath, 'utf8');
      return includeContent;
    } catch (error) {
      console.error(`Error including ${filename}:`, error.message);
      return match; // Return original if file not found
    }
  });
}

// Process Liquid template variables
function processLiquidVariables(content) {
  // Replace {{ '/path' | relative_url }} with just '/path'
  content = content.replace(/\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/g, '$1');
  
  // Replace {{ page.title | default: site.title }} with site title
  content = content.replace(/\{\{\s*page\.title\s*\|\s*default:\s*site\.title\s*\}\}/g, 'Eric Liu — Portfolio');
  content = content.replace(/\{\{\s*page\.description\s*\|\s*default:\s*site\.description\s*\}\}/g, 'Personal website for Eric Liu: About, Experience, Projects, and Contact.');
  
  return content;
}

// Process layout
function processLayout(content, baseDir) {
  const layoutRegex = /layout:\s*([^\n]+)/;
  const match = content.match(layoutRegex);
  
  if (match) {
    const layoutName = match[1].trim();
    const layoutPath = path.join(baseDir, '_layouts', `${layoutName}.html`);
    
    try {
      let layoutContent = fs.readFileSync(layoutPath, 'utf8');
      
      // Replace {{ content }} with the page content
      const pageContent = content.replace(/---[\s\S]*?---\s*/, '');
      layoutContent = layoutContent.replace('{{ content }}', pageContent);
      
      // Process Liquid variables in the layout
      layoutContent = processLiquidVariables(layoutContent);
      
      return layoutContent;
    } catch (error) {
      console.error(`Error loading layout ${layoutName}:`, error.message);
      return content;
    }
  }
  
  return content;
}

// Build the site
function buildSite() {
  const baseDir = __dirname;
  const indexPath = path.join(baseDir, 'index.html');
  
  try {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Process includes first
    content = processIncludes(content, baseDir);
    
    // Process layout
    content = processLayout(content, baseDir);
    
    // Write to _site directory
    const siteDir = path.join(baseDir, '_site');
    if (!fs.existsSync(siteDir)) {
      fs.mkdirSync(siteDir);
    }
    
    fs.writeFileSync(path.join(siteDir, 'index.html'), content);
    
    // Copy static assets
    const assetsToCopy = ['styles', 'scripts', 'assets'];
    assetsToCopy.forEach(asset => {
      const srcPath = path.join(baseDir, asset);
      const destPath = path.join(siteDir, asset);
      
      if (fs.existsSync(srcPath)) {
        if (fs.existsSync(destPath)) {
          fs.rmSync(destPath, { recursive: true });
        }
        fs.cpSync(srcPath, destPath, { recursive: true });
      }
    });
    
    console.log('✅ Site built successfully!');
    console.log('📁 Output: _site/');
    console.log('🌐 Serve with: python3 -m http.server 4000 --directory _site');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

buildSite();
