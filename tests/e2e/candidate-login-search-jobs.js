const {
  createPage,
  launchBrowser,
  loginAsCandidate,
  waitForText,
} = require('./helpers/puppeteer-utils')

async function run() {
  const browser = await launchBrowser()
  try {
    const page = await createPage(browser)
    await loginAsCandidate(page)
    await waitForText(page, 'Search jobs')
    await waitForText(page, 'Junior Backend Developer')

    await page.waitForSelector('input[name="search"]')
    await page.click('input[name="search"]', { clickCount: 3 })
    await page.type('input[name="search"]', 'Frontend Engineer')

    await Promise.all([
      page.keyboard.press('Enter'),
      waitForText(page, 'Frontend Engineer'),
    ])

    console.log('Candidate login & job search flow: OK')
  } finally {
    await browser.close()
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
