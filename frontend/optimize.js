/**
 * optimize.js — aIDEAS website image optimizer
 * 
 * USAGE: node optimize.js   (run from the frontend/ directory)
 *
 * What this does:
 *  1. Deletes junk/unused files from public/
 *  2. Deletes unused asset images
 *  3. Compresses /members/ PNGs  → WebP (800px max, 82% quality, keeps transparency)
 *  4. Compresses /assets/img/hero/ PNGs → WebP (1200px max, 85% quality)
 *  5. Compresses testimonials, achievements, faculty, misc JPEGs (85% quality, 900px max)
 *  6. ⛔ Skips scroll-story frames entirely (already ~132KB/frame at 1920×1080)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, 'public');

// ─── 1. FILES TO DELETE (junk / unused) ─────────────────────────────────────

const JUNK_FILES = [
  // Root-level scratch/test images — never referenced in source
  '.JPG',
  'army.png',
  'food.JPG',
  'Goo.JPG',
  'image copy.png',
  'image.jpeg',
  'image.png',
  'mystry.png',
  'Room.png',
  'vlog.JPG',
  'war.png',
  'network_bg.jpg',           // exact duplicate of network_bg.jpeg

  // Unused old asset images
  'assets/img/logo-full.jpg',
  'assets/img/logo-full-original.jpg',
  'assets/img/events/avinya-1.jpg',
  'assets/img/events/avinya-2.jpg',
  'assets/img/events/avinya-3.jpg',
  'assets/img/events/avinya-4.jpg',
  'assets/img/events/avinya-5.jpg',
  'assets/img/events/avinya-6.jpg',
  'assets/img/events/avinya-cover.jpg',
  'assets/img/events/genai-night-1.jpg',
  'assets/img/events/genai-night-2.jpg',
  'assets/img/events/genai-night-3.jpg',
  'assets/img/events/genai-night-4.jpg',
  'assets/img/events/genai-night-5.jpg',
  'assets/img/events/genai-night-6.jpg',
  'assets/img/events/genai-night-cover.jpg',
  'assets/img/events/hackday-1.jpg',
  'assets/img/events/hackday-2.jpg',
  'assets/img/events/hackday-3.jpg',
  'assets/img/events/hackday-4.jpg',
  'assets/img/events/hackday-5.jpg',
  'assets/img/events/hackday-6.jpg',
  'assets/img/events/hackday-cover.jpg',
  'assets/img/resources/ai.jpg',
  'assets/img/resources/git.jpg',
  'assets/img/resources/ml.jpg',
  'assets/img/resources/webdev.jpg',
  'assets/img/members/member1.jpg',
  'assets/img/members/member2.jpg',
  'assets/img/members/member3.jpg',
  'assets/img/members/member4.jpg',
  'assets/img/members/member5.jpg',
  'assets/img/members/member6.jpg',
  'assets/img/members/member7.jpg',
  'assets/img/members/member8.jpg',
  'assets/img/members/member9.jpg',
  'assets/img/faculty/faculty1.jpg',
  'assets/img/faculty/faculty2.jpg',
  'assets/videos/home/loader/loader.mp4',
  'assets/videos/home/loader/loader-poster.jpg',
  'faculty/mrunal_buchade.png',       // duplicate of faculty_coordinator_photo.png
  'faculty/kritika_goswami.jpeg',     // duplicate of kritika_goswami.png
];

// ─── 2. MEMBER PNGs → WebP ──────────────────────────────────────────────────
// These are 3000x3700+ px raw photo exports (4-7 MB each).
// Members are displayed as small cards — 800px max is plenty.

const MEMBERS_DIR = path.join(PUBLIC, 'members');

// ─── 3. HERO PNGs → WebP ────────────────────────────────────────────────────

const HERO_PNGS = [
  'assets/img/hero/build-projects.png',
  'assets/img/hero/hackathons-and-competitions.png',
  'assets/img/hero/tech-community.png',
  'assets/img/hero/workshops-and-session.png',
  'assets/img/logo-mark.png',
];

// ─── 4. JPEG/PNG IMAGES TO COMPRESS ─────────────────────────────────────────

const JPEG_IMAGES = [
  // Testimonials
  'assets/testimonials/ganesh-rokade.jpg',
  'assets/testimonials/omkar-mulage.jpg',
  'assets/testimonials/pranav-pardeshi.jpg',
  'assets/testimonials/saanidhi-gade.jpg',
  'assets/testimonials/saumya-raut.jpeg',
  'assets/testimonials/soham-muley.jpeg',
  'assets/testimonials/srajal-kumar-mishra.jpg',
  // Achievements
  'achievements/impetus-ceremony.jpg',
  'achievements/impetus-group.jpg',
  'achievements/impetus-certificates.jpg',
  'achievements/bhagirath-karandak.jpg',
  'achievements/vois-award-ceremony.jpg',
  'achievements/vois-cheque.jpg',
  'achievements/ibm-hacknexus.jpg',
  'achievements/hardhack-pccoe.jpg',
  'achievements/hardhack-certificate.jpg',
  // Faculty (PNG but compress as PNG)
  'faculty/hod_photo.png',
  'faculty/faculty_coordinator_photo.png',
  'faculty/kritika_goswami.png',
  // Misc used
  'network_bg.jpeg',
  'Avinya.png',               // used in events page
  'logo.png',
  'assets/img/logo-icon.png',
  'assets/img/favicon.png',
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatKB(bytes) { return (bytes / 1024).toFixed(1) + ' KB'; }
function formatMB(bytes) { return (bytes / (1024 * 1024)).toFixed(2) + ' MB'; }

let totalSavedBytes = 0;
let deletedBytes = 0;

function getTotalPublicSize() {
  let total = 0;
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else total += fs.statSync(full).size;
    }
  }
  walk(PUBLIC);
  return total;
}

// ─── STEP 1: DELETE JUNK ─────────────────────────────────────────────────────

function deleteJunk() {
  console.log('\n' + '='.repeat(60));
  console.log('  STEP 1: Deleting unused / junk files');
  console.log('='.repeat(60));

  for (const rel of JUNK_FILES) {
    const full = path.join(PUBLIC, rel.replace(/\//g, path.sep));
    if (fs.existsSync(full)) {
      const size = fs.statSync(full).size;
      fs.unlinkSync(full);
      deletedBytes += size;
      console.log(`  Deleted  ${rel.padEnd(55)} (${formatKB(size)})`);
    } else {
      console.log(`  Missing  ${rel}  (skipping)`);
    }
  }

  console.log(`\n  Freed by deletion: ${formatMB(deletedBytes)}`);
}

// ─── STEP 2: COMPRESS MEMBER PNGs → WebP ─────────────────────────────────────

async function compressMembers() {
  console.log('\n' + '='.repeat(60));
  console.log('  STEP 2: Compressing /members/ PNGs -> WebP');
  console.log('='.repeat(60));

  if (!fs.existsSync(MEMBERS_DIR)) {
    console.log('  Members directory not found, skipping.');
    return;
  }

  const files = fs.readdirSync(MEMBERS_DIR).filter(f =>
    /\.(png|jpg|jpeg)$/i.test(f)
  );

  for (const file of files) {
    const srcPath = path.join(MEMBERS_DIR, file);
    const baseName = path.basename(file, path.extname(file));
    const destPath = path.join(MEMBERS_DIR, baseName + '.webp');
    const tempPath = path.join(MEMBERS_DIR, '_tmp_' + baseName + '.webp');

    const origSize = fs.statSync(srcPath).size;

    try {
      await sharp(srcPath)
        .resize({
          width: 800,
          height: 800,
          fit: 'inside',            // preserves aspect ratio, no cropping
          withoutEnlargement: true,
        })
        .webp({ quality: 82, effort: 4 })
        .toFile(tempPath);

      const newSize = fs.statSync(tempPath).size;
      const saved = origSize - newSize;
      totalSavedBytes += saved;

      fs.renameSync(tempPath, destPath);
      // Delete the original png/jpg if we created a new .webp
      if (srcPath !== destPath) fs.unlinkSync(srcPath);

      const pct = ((saved / origSize) * 100).toFixed(0);
      console.log(`  ${file.padEnd(40)} ${formatMB(origSize)} -> ${formatKB(newSize)}  (-${pct}%)`);
    } catch (err) {
      console.error(`  ERROR: ${file}:`, err.message);
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }
}

// ─── STEP 3: COMPRESS HERO PNGs → WebP ───────────────────────────────────────

async function compressHero() {
  console.log('\n' + '='.repeat(60));
  console.log('  STEP 3: Compressing hero PNGs -> WebP');
  console.log('='.repeat(60));

  for (const rel of HERO_PNGS) {
    const srcPath = path.join(PUBLIC, rel.replace(/\//g, path.sep));
    if (!fs.existsSync(srcPath)) {
      console.log(`  Missing: ${rel}  (skipping)`);
      continue;
    }

    const baseName = path.basename(rel, path.extname(rel));
    const destPath = path.join(path.dirname(srcPath), baseName + '.webp');
    const tempPath = path.join(path.dirname(srcPath), '_tmp_' + baseName + '.webp');

    const origSize = fs.statSync(srcPath).size;

    try {
      await sharp(srcPath)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 85, effort: 4 })
        .toFile(tempPath);

      const newSize = fs.statSync(tempPath).size;
      const saved = origSize - newSize;
      totalSavedBytes += saved;

      fs.renameSync(tempPath, destPath);
      if (srcPath !== destPath) fs.unlinkSync(srcPath);

      const pct = ((saved / origSize) * 100).toFixed(0);
      console.log(`  ${path.basename(rel).padEnd(48)} ${formatMB(origSize)} -> ${formatKB(newSize)}  (-${pct}%)`);
    } catch (err) {
      console.error(`  ERROR: ${rel}:`, err.message);
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }
}

// ─── STEP 4: COMPRESS JPEG / PNG IMAGES ──────────────────────────────────────

async function compressJpegs() {
  console.log('\n' + '='.repeat(60));
  console.log('  STEP 4: Compressing testimonials / achievements / faculty / misc');
  console.log('='.repeat(60));

  for (const rel of JPEG_IMAGES) {
    const srcPath = path.join(PUBLIC, rel.replace(/\//g, path.sep));
    if (!fs.existsSync(srcPath)) continue;

    const ext = path.extname(srcPath).toLowerCase();
    const tempPath = srcPath + '.tmp';
    const origSize = fs.statSync(srcPath).size;

    // Skip if already small enough (under 50 KB — not worth touching)
    if (origSize < 50 * 1024) {
      console.log(`  Skipping (already small): ${rel}`);
      continue;
    }

    try {
      let pipeline = sharp(srcPath).resize({ width: 900, withoutEnlargement: true });

      if (ext === '.png') {
        pipeline = pipeline.png({ quality: 85, compressionLevel: 8 });
      } else {
        // .jpg / .jpeg
        pipeline = pipeline.jpeg({ quality: 85, progressive: true });
      }

      await pipeline.toFile(tempPath);

      const newSize = fs.statSync(tempPath).size;

      // Only replace if actually smaller
      if (newSize < origSize) {
        const saved = origSize - newSize;
        totalSavedBytes += saved;
        fs.renameSync(tempPath, srcPath);
        const pct = ((saved / origSize) * 100).toFixed(0);
        console.log(`  ${path.basename(rel).padEnd(48)} ${formatKB(origSize)} -> ${formatKB(newSize)}  (-${pct}%)`);
      } else {
        fs.unlinkSync(tempPath);
        console.log(`  Already optimal: ${path.basename(rel)}`);
      }
    } catch (err) {
      console.error(`  ERROR: ${rel}:`, err.message);
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n=== aIDEAS Image Optimizer ===');
  console.log('SKIPPING scroll-story frames (001-180.jpg) — already ~132KB at 1920x1080, compressing would cause blur\n');

  const startTotal = getTotalPublicSize();
  console.log(`Public folder before: ${formatMB(startTotal)}`);

  deleteJunk();
  await compressMembers();
  await compressHero();
  await compressJpegs();

  const endTotal = getTotalPublicSize();
  const totalSaved = startTotal - endTotal;

  console.log('\n' + '='.repeat(60));
  console.log('  DONE');
  console.log('='.repeat(60));
  console.log(`  Freed by deletion:    ${formatMB(deletedBytes)}`);
  console.log(`  Saved by compression: ${formatMB(totalSavedBytes)}`);
  console.log(`  Total saved:          ${formatMB(totalSaved)}`);
  console.log(`  Before: ${formatMB(startTotal)}  ->  After: ${formatMB(endTotal)}`);
  console.log('');
}

main().catch(console.error);
