const {
  createPage,
  goto,
  launchBrowser,
  uniqueEmail,
  uniqueId,
  waitForText,
} = require('./helpers/puppeteer-utils')

async function run() {
  const browser = await launchBrowser()
  try {
    const page = await createPage(browser)
    const email = uniqueEmail('company')
    const companyName = `E2E Company ${uniqueId('corp')}`
    const jobTitle = `E2E QA Engineer ${uniqueId('job')}`

    await goto(page, '/create-employer')

    await page.type('#company-name', companyName)
    await page.type('#email', email)
    await page.type('#company-information', 'E2E automation focused company.')
    await page.type('#password', 'companyPass123!')
    await page.type('#confirm-password', 'companyPass123!')

    await Promise.all([
      page.click('form.login-form button[type="submit"]'),
      page.waitForFunction(
        (path) => window.location.pathname === path,
        {},
        '/search-candidates',
      ),
    ])

    await goto(page, '/profile')
    await waitForText(page, companyName)

    await page.waitForSelector('button.company-add-posting-button')
    await page.click('button.company-add-posting-button')
    await page.waitForSelector('.profile-modal-card')

    await page.type('.profile-modal-card input[placeholder="Job title"]', jobTitle)
    await page.type('.profile-modal-card textarea[placeholder="Description"]', 'Build reliable E2E automation.')
    await page.select('.profile-modal-card select', 'Remote')
    await page.type('.profile-modal-card input[placeholder="YOE"]', '3')
    await page.type('.profile-modal-card input[placeholder="Skill"]', 'Puppeteer')
    await page.click('.profile-modal-card button.profile-skill-add-button')
    await page.type('.profile-modal-card input[placeholder="Degree name"]', 'Computer Science')
    await page.type('.profile-modal-card input[placeholder="Location"]', 'Singapore')

    await Promise.all([
      page.click('.profile-modal-actions button[type="submit"]'),
      page.waitForFunction(
        (title) =>
          Array.from(
            document.querySelectorAll('.company-posting-card h3'),
          ).some((el) => el.textContent && el.textContent.includes(title)),
        {},
        jobTitle,
      ),
    ])

    console.log('Company registration & job posting flow: OK')
  } finally {
    await browser.close()
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
