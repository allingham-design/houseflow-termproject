const puppeteer = require("puppeteer");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function go() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 40,
  });

  const page = await browser.newPage();

  // 1. Go to login page
  await page.goto("http://127.0.0.1:5501/index.html", {
    waitUntil: "networkidle2",
  });

  // 2. LOGIN AS ROOMMATE USER (NOT ADMIN)
  await page.waitForSelector("#login-email");

  await page.type("#login-email", "roommate1@test.com");
  await page.type("#login-password", "password123");

  await page.click("#login-btn");

  // wait for Firebase auth + redirect
  await delay(3000);

  // OPTIONAL: ensure we are logged in as roommate
  const role = await page.evaluate(() => {
    const user = JSON.parse(sessionStorage.getItem("houseflow_user") || "{}");
    return user.role;
  });

  console.log("Logged in role:", role);

  // 3. GO TO CHORES PAGE
  await page.goto("http://127.0.0.1:5501/chores.html", {
    waitUntil: "networkidle2",
  });

  await page.waitForSelector("#chore-title");

  // 4. WAIT FOR USERS DROPDOWN (important for Firebase load)
  await page.waitForFunction(() => {
    const select = document.querySelector("#chore-assigned");
    return select && select.options.length > 0;
  });

  // 5. FILL OUT FORM
  await page.type("#chore-title", "Take out trash");
  await page.type("#chore-description", "Take trash to dumpster");

  // select first roommate in dropdown
  const firstUser = await page.$eval(
    "#chore-assigned option",
    (el) => el.value,
  );

  await page.select("#chore-assigned", firstUser);

  // due date
  await page.type("#chore-due", "2026-05-01");

  // recurrence
  await page.select("#chore-recurrence", "weekly");

  // 6. SUBMIT CHORE
  await page.click("#save-chore-btn");

  await delay(3000);

  // 7. VERIFY CHORE EXISTS
  const success = await page.evaluate(() => {
    return document.body.innerText.includes("Take out trash");
  });

  console.log(success ? "✅ Chore created!" : "❌ Failed");

  await delay(5000);

  await browser.close();
}

go();
