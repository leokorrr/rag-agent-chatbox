import { renameSync, existsSync, mkdirSync } from 'fs'

const distDir = './dist'
const publicDir = './public'

if (!existsSync(publicDir)) {
  mkdirSync(publicDir)
}

const filesToMove = [
  'sheldon-chat-widget.css',
  'sheldon-chat-widget.iife.js',
  'sheldon-chat-widget.js'
]

filesToMove.forEach((file) => {
  const src = `${distDir}/${file}`
  const dest = `${publicDir}/${file}`
  try {
    renameSync(src, dest)
    console.log(`✅ Moved ${file} to public/`)
  } catch (err) {
    console.error(`❌ Failed to move ${file}:`, err.message)
  }
})