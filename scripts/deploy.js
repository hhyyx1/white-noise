#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const platform = args[0];

if (!platform || !['vercel', 'cloudflare', 'both'].includes(platform)) {
  console.log('使用方法: node scripts/deploy.js [vercel|cloudflare|both]');
  console.log('');
  console.log('示例:');
  console.log('  node scripts/deploy.js vercel     # 部署到 Vercel');
  console.log('  node scripts/deploy.js cloudflare # 部署到 Cloudflare Pages');
  console.log('  node scripts/deploy.js both       # 部署到两个平台');
  process.exit(1);
}

function runCommand(command, description) {
  console.log(`\n🚀 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} 完成`);
  } catch (error) {
    console.error(`❌ ${description} 失败:`, error.message);
    process.exit(1);
  }
}

function checkFile(filePath, description) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ 缺少 ${description}: ${filePath}`);
    console.log('请参考 DEPLOYMENT.md 了解如何配置');
    return false;
  }
  return true;
}

async function deployToVercel() {
  console.log('\n📦 准备部署到 Vercel...');
  
  // 检查 Vercel CLI
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch {
    console.log('📥 安装 Vercel CLI...');
    runCommand('npm install -g vercel', '安装 Vercel CLI');
  }
  
  // 构建项目
  runCommand('npm run build:vercel', '构建 Vercel 版本');
  
  // 部署
  runCommand('vercel --prod', '部署到 Vercel');
}

async function deployToCloudflare() {
  console.log('\n☁️ 准备部署到 Cloudflare Pages...');
  
  // 检查 Wrangler CLI
  try {
    execSync('wrangler --version', { stdio: 'ignore' });
  } catch {
    console.log('📥 安装 Wrangler CLI...');
    runCommand('npm install -g wrangler', '安装 Wrangler CLI');
  }
  
  // 构建项目
  runCommand('npm run build:cloudflare', '构建 Cloudflare Pages 版本');
  
  // 检查输出目录
  if (!fs.existsSync('out')) {
    console.error('❌ 构建输出目录 "out" 不存在');
    process.exit(1);
  }
  
  // 部署
  console.log('\n🚀 部署到 Cloudflare Pages...');
  console.log('请确保已经登录 Cloudflare 账户 (wrangler login)');
  console.log('如果是首次部署，请先在 Cloudflare Dashboard 创建项目');
  
  runCommand('wrangler pages deploy out --project-name=white-noise', '部署到 Cloudflare Pages');
}

async function main() {
  console.log('🎵 泡泡白噪音 - 部署脚本');
  console.log('================================');
  
  // 检查依赖
  if (!fs.existsSync('package.json')) {
    console.error('❌ 请在项目根目录运行此脚本');
    process.exit(1);
  }
  
  // 安装依赖
  runCommand('npm install', '安装项目依赖');
  
  try {
    if (platform === 'vercel' || platform === 'both') {
      await deployToVercel();
    }
    
    if (platform === 'cloudflare' || platform === 'both') {
      await deployToCloudflare();
    }
    
    console.log('\n🎉 部署完成！');
    console.log('📖 更多信息请查看 DEPLOYMENT.md');
    
  } catch (error) {
    console.error('❌ 部署过程中出现错误:', error.message);
    process.exit(1);
  }
}

main();