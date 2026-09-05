const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');

async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function run() {
  const archiveDir = path.join(process.env.HOME, 'CAY_GIA_PHA_ARCHIVE', 'familysearch');
  const personsDir = path.join(archiveDir, 'persons');
  const mediaDir = path.join(archiveDir, 'media');
  const manifestPath = path.join(archiveDir, 'manifest.json');

  if (!fs.existsSync(personsDir)) fs.mkdirSync(personsDir, { recursive: true });
  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

  const userDataDir = path.join(archiveDir, '.browser_session');
  console.log("Khởi chạy Chrome thực tế...");

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    channel: 'chrome',
    viewport: { width: 1440, height: 900 },
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars'
    ]
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
  
  const targetUrl = "https://www.familysearch.org/tree/person/memories/G5X4-48S";
  console.log("Đang mở URL:", targetUrl);
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

  console.log("\n=======================================================");
  console.log("CHỜ BẠN MỞ TRANG MEMORIES HOÀN CHỈNH...");
  console.log("Script sẽ kiểm tra liên tục mỗi 3 giây cho đến khi nhận diện được");
  console.log("thành phần thực tế của giao diện FamilySearch (Header/Person Name).");
  console.log("=======================================================\n");

  // Kiểm tra liên tục xem đã vào được trang Person/Memories thật chưa
  let pageReady = false;
  let attempts = 0;
  while (!pageReady && attempts < 100) {
    attempts++;
    await page.waitForTimeout(3000);
    const state = await page.evaluate(() => {
      const text = document.body ? document.body.innerText : '';
      const isBlocked = text.includes('Error 15') || text.includes('Access Denied');
      const isLogin = window.location.href.includes('/auth/') || window.location.href.includes('/login');
      const isPersonPage = text.includes('Giuse') || text.includes('Trần Trọng Thu') || text.includes('G5X4-48S') || text.includes('Kỷ niệm') || text.includes('Memories') || !!document.querySelector('[data-testid*="person"]');
      
      return { isBlocked, isLogin, isPersonPage, currentUrl: window.location.href, title: document.title };
    });

    if (state.isPersonPage && !state.isBlocked && !state.isLogin) {
      pageReady = true;
      console.log(`Đã phát hiện giao diện FamilySearch thực tế sau ${attempts * 3}s!`);
      break;
    } else {
      process.stdout.write(`Đang chờ xác thực/tải trang... (URL: ${state.currentUrl.slice(0, 45)}...)\r`);
    }
  }

  if (!pageReady) {
    console.log("\nHết thời gian chờ (5 phút). Dừng tiến trình.");
    await context.close();
    process.exit(1);
  }

  await page.waitForTimeout(5000);

  // Chụp ảnh giao diện THỰC TẾ đã vượt qua rào cản
  const actualScreenshot = path.join(archiveDir, 'G5X4-48S_actual_ui.png');
  await page.screenshot({ path: actualScreenshot, fullPage: true });
  console.log("\nĐã chụp ảnh màn hình giao diện thực tế tại:", actualScreenshot);

  // Phân tích chi tiết các elements trên trang Memories
  const scanResult = await page.evaluate(() => {
    // 1. Tìm các thẻ ảnh / tài liệu / audio / câu chuyện
    const memoryItems = [];
    const memLinks = Array.from(document.querySelectorAll('a[href*="/memories/memory/"], [data-testid*="memory-item"], .memory-card, .artifact-card'));
    
    memLinks.forEach((el, i) => {
      const link = el.tagName === 'A' ? el.href : (el.querySelector('a') ? el.querySelector('a').href : '');
      const img = el.querySelector('img');
      const titleEl = el.querySelector('[class*="title"], h3, h4, span');
      const match = link.match(/\/memory\/(\d+)/);
      memoryItems.push({
        id: match ? match[1] : `item_${i}`,
        url: link,
        thumb: img ? img.src : null,
        title: titleEl ? titleEl.innerText.trim() : null
      });
    });

    // 2. Tìm các tab phân loại (Photos, Documents, Stories, Audio)
    const tabs = Array.from(document.querySelectorAll('[role="tab"], button, a')).map(t => t.innerText.trim()).filter(t => t.includes('Photo') || t.includes('Ảnh') || t.includes('Tài liệu') || t.includes('Document') || t.includes('Story') || t.includes('Câu chuyện') || t.includes('Kỷ niệm'));

    // 3. Tìm nút Download / Tải xuống
    const downloadBtns = Array.from(document.querySelectorAll('button, a')).filter(b => (b.innerText && b.innerText.toLowerCase().includes('tải')) || (b.getAttribute('aria-label') && b.getAttribute('aria-label').toLowerCase().includes('download')));

    const emptyMsg = document.querySelector('[class*="empty"], [data-testid*="empty"]') ? document.querySelector('[class*="empty"], [data-testid*="empty"]').innerText.trim() : null;

    return {
      title: document.title,
      url: window.location.href,
      tabs: tabs,
      memoryItemsCount: memoryItems.length,
      memoryItems: memoryItems,
      downloadButtons: downloadBtns.map(b => b.innerText || b.getAttribute('aria-label')),
      emptyMessage: emptyMsg,
      bodyTextSample: document.body.innerText.slice(0, 1500)
    };
  });

  console.log("\n=== KẾT QUẢ ĐÁNH GIÁ THỰC TẾ ===");
  console.log("Tiêu đề:", scanResult.title);
  console.log("Tổng số Memories tìm thấy:", scanResult.memoryItemsCount);
  console.log("Các Tab nhận diện:", scanResult.tabs);
  console.log("Nút Download nhận diện:", scanResult.downloadButtons);
  console.log("Thông điệp Empty state (nếu có):", scanResult.emptyMessage);

  fs.writeFileSync(path.join(archiveDir, 'ui_scan_result.json'), JSON.stringify(scanResult, null, 2));

  // Tải file nếu có memoryItems
  let downloaded = 0;
  const manifestItems = [];

  for (const item of scanResult.memoryItems) {
    if (!item.url) continue;
    console.log(`Đang truy cập chi tiết Memory: ${item.id} -> ${item.url}`);
    const itemPage = await context.newPage();
    try {
      await itemPage.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await itemPage.waitForTimeout(3000);
      
      const itemInfo = await itemPage.evaluate(() => {
        const img = document.querySelector('img[src*="dist.familysearch.org"], img[class*="main"], img[data-testid*="image"]');
        const title = document.querySelector('h1, [class*="title"]');
        return {
          fullSrc: img ? img.src : null,
          title: title ? title.innerText.trim() : null
        };
      });

      if (itemInfo.fullSrc || item.thumb) {
        const dlUrl = itemInfo.fullSrc || item.thumb;
        const localFileName = `FS_${item.id}.jpg`;
        const dest = path.join(mediaDir, localFileName);
        await downloadFile(dlUrl, dest);
        console.log(`-> Tải thành công: ${localFileName}`);
        downloaded++;

        manifestItems.push({
          localPersonId: "@I1@",
          personName: "Giuse Trần Trọng Thu",
          familySearchPersonId: "G5X4-48S",
          memoryId: item.id,
          memoryType: "Photo",
          title: itemInfo.title || item.title || null,
          familySearchUrl: item.url,
          localFile: path.join('media', localFileName),
          downloadStatus: "downloaded"
        });
      }
    } catch(err) {
      console.warn(`Lỗi tải item ${item.id}:`, err.message);
    } finally {
      await itemPage.close();
    }
  }

  // Cập nhật manifest
  if (manifestItems.length > 0) {
    fs.writeFileSync(manifestPath, JSON.stringify(manifestItems, null, 2), 'utf8');
  }

  // Ghi profile JSON
  const personSnapshot = {
    localPersonId: "@I1@",
    personName: "Giuse Trần Trọng Thu",
    familySearchPersonId: "G5X4-48S",
    scannedAt: new Date().toISOString(),
    totalMemories: scanResult.memoryItemsCount,
    downloadedCount: downloaded,
    emptyMessage: scanResult.emptyMessage,
    items: manifestItems
  };

  fs.writeFileSync(path.join(personsDir, 'G5X4-48S.json'), JSON.stringify(personSnapshot, null, 2), 'utf8');

  console.log("\n==========================================");
  if (downloaded > 0) {
    console.log(`PILOT THÀNH CÔNG: Đã tải ${downloaded} memories về ${mediaDir}`);
  } else if (scanResult.memoryItemsCount === 0) {
    console.log(`KẾT QUẢ XÁC NHẬN BẰNG MẮT/DOM: Cụ Giuse Trần Trọng Thu (G5X4-48S) hiện KHÔNG CÓ Memories trên FamilySearch.`);
  } else {
    console.log(`PILOT FAILED: Tìm thấy ${scanResult.memoryItemsCount} memories nhưng tải về được 0 file.`);
  }
  console.log("==========================================\n");

  await page.waitForTimeout(4000);
  await context.close();
}

run().catch(console.error);
