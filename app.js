const puppeteer = require("puppeteer");

async function go() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });

  const page = await browser.newPage();

  // 1. Go to login page
  await page.goto("http://127.0.0.1:5500/index.html");

  // 2. Login
  await page.waitForSelector("#login-email");

  await page.type("#login-email", "dannynguyen995@gmail.com");
  await page.type("#login-password", "password123");

  await page.click("#login-btn");

  // wait for Firebase auth + redirect
  await page.waitForTimeout(2000);

  // 3. Go to chores page
  await page.goto("http://localhost:5500/chores.html");

  // wait for page to load
  await page.waitForSelector("#chore-title");

  // 4. WAIT for dropdown to populate (important)
  await page.waitForFunction(() => {
    const select = document.querySelector("#chore-assigned");
    return select && select.options.length > 0;
  });

  // 5. Fill form
  await page.type("#chore-title", "Take out trash");
  await page.type("#chore-description", "Take trash to dumpster");

  // select first user
  await page.select(
    "#chore-assigned",
    await page.$eval("#chore-assigned option", (el) => el.value),
  );

  // due date
  await page.type("#chore-due", "2026-05-01");

  // recurrence
  await page.select("#chore-recurrence", "weekly");

  // 6. Submit
  await page.click("#save-chore-btn");

  // wait for UI update
  await page.waitForTimeout(2000);

  // 7. Verify
  const success = await page.evaluate(() =>
    document.body.innerText.includes("Take out trash"),
  );

  console.log(success ? "✅ Chore created!" : "❌ Failed");

  await page.waitForTimeout(5000);

  await browser.close();
}

go();
