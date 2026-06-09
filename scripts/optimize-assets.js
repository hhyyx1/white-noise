#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎵 音频文件优化脚本');
console.log('================================');

const publicDir = path.join(__dirname, '../public');
const maxSizeBytes = 25 * 1024 * 1024; // 25MB

function getFileSizeInBytes(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

function formatBytes(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function checkFiles() {
  const files = fs.readdirSync(publicDir);
  const largeFiles = [];
  
  files.forEach(file => {
    const filePath = path.join(publicDir, file);
    if (fs.statSync(filePath).isFile()) {
      const size = getFileSizeInBytes(filePath);
      if (size > maxSizeBytes) {
        largeFiles.push({
          name: file,
          path: filePath,
          size: size,
          sizeFormatted: formatBytes(size)
        });
      }
    }
  });
  
  return largeFiles;
}

function main() {
  const largeFiles = checkFiles();
  
  if (largeFiles.length === 0) {
    console.log('✅ 所有文件都符合 Cloudflare Pages 的大小限制 (25MB)');
    return;
  }
  
  console.log('❌ 发现超过 25MB 限制的文件:');
  largeFiles.forEach(file => {
    console.log(`  - ${file.name}: ${file.sizeFormatted}`);
  });
  
  console.log('\n🔧 建议的解决方案:');
  console.log('1. 使用音频压缩工具减小文件大小');
  console.log('2. 转换为更高效的格式 (如 MP3)');
  console.log('3. 降低音频质量/比特率');
  console.log('4. 使用外部 CDN 托管大文件');
  
  // 创建备份目录
  const backupDir = path.join(__dirname, '../backup-large-files');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }
  
  // 移动大文件到备份目录
  largeFiles.forEach(file => {
    const backupPath = path.join(backupDir, file.name);
    console.log(`\n📦 移动大文件到备份目录: ${file.name}`);
    fs.renameSync(file.path, backupPath);
  });
  
  console.log('\n✅ 大文件已移动到 backup-large-files/ 目录');
  console.log('💡 你可以使用在线音频压缩工具处理这些文件后再放回 public/ 目录');
}

main();