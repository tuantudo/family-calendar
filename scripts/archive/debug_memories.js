const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function debug() {
  const archiveDir = path.join(process.env.HOME, 'CAY_GIA_PHA_ARCHIVE', 'familysearch');
  const userDataDir = path.join(archiveDir, '.browser_session');
  
  console.log("Khởi chạy Chromium UI để debug...");
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    viewport: { width: 1440, height: 900 }
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
  const targetUrl = "https://www.familysearch.org/tree/person/memories/G5X4-48S";
  
  console.log("Navigating to:", targetUrl);
  await page.goto(targetUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(6000);

  // Chụp ảnh màn hình thực tế làm bằng chứng kiểm toán
  const screenshotPath = path.join(archiveDir, 'debug_G5X4-48S_memories.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log("Đã chụp màn hình thực tế tại:", screenshotPath);

  // Kiểm tra cấu trúc DOM chi tiết
  const domInspection = await page.evaluate(() => {
    const memTab = document.querySelector('a[href*="/memories"], button[id*="memories"]');
    const allLinks = Array.from(document.querySelectorAll('a')).map(a => a.href).filter(h => h.includes('memory') || h.includes('artifact') || h.includes('photo'));
    const allImages = Array.from(document.querySelectorAll('img')).map(img => ({ src: img.src, alt: img.alt, class: img.className }));
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, [role="heading"]')).map(h => h.innerText.trim());
    const bodyTextSnippet = document.body.innerText.slice(0, 1500);

    return {
      currentUrl: window.location.href,
      memTabFound: !!memTab,
      memTabInfo: memTab ? { text: memTab.innerText, href: memTab.href } : null,
      memoryRelatedLinksCount: allLinks.length,
      memoryRelatedLinks: allLinks.slice(0, 15),
      imagesCount: allImages.length,
      images: allImages.filter(img => !img.src.includes('svg') && !img.src.includes('avatar')).slice(0, 10),
      headings: headings,
      bodySnippet: bodyTextSnippet
    };
  });

  console.log("\n=== DOM INSPECTION RESULTS ===");
  console.log("Current URL:", domInspection.currentUrl);
  console.log("Headings:", domInspection.headings);
  console.log("Memory Links Count:", domInspection.memoryRelatedLinksCount);
  console.log("Images Count (Non-SVG):", domInspection.images.length);
  console.log("Body Snippet:\n", domInspection.bodySnippet.slice(0, 500));

  fs.writeFileSync(path.join(archiveDir, 'debug_dom.json'), JSON.stringify(domInspection, null, 2));

  await page.waitForTimeout(4000);
  await context.close();
}

debug().catch(console.error);
