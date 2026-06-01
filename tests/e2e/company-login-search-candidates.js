const {
  createPage,
  launchBrowser,
  loginAsCompany,
  waitForText,
} = require('./helpers/puppeteer-utils')

async function run() {
  const browser = await launchBrowser()
  try {
    const page = await createPage(browser)
    await loginAsCompany(page)
    await waitForText(page, 'Search candidates')

    await page.waitForSelector('input[name="search"]')
    await page.click('input[name="search"]', { clickCount: 3 })
    await page.type('input[name="search"]', 'Ava')

    await Promise.all([
      page.keyboard.press('Enter'),
      waitForText(page, 'Ava Tan'),
    ])

    console.log('Company login & candidate search flow: OK')
  } finally {
    await browser.close()
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
