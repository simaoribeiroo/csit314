const {
  createPage,
  goto,
  launchBrowser,
  uniqueEmail,
  waitForText,
} = require('./helpers/puppeteer-utils')

async function run() {
  const browser = await launchBrowser()
  try {
    const page = await createPage(browser)
    const email = uniqueEmail('candidate')
    const fullName = 'E2E Candidate'

    await goto(page, '/create-candidate')

    await page.type('#first-name', 'E2E')
    await page.type('#last-name', 'Candidate')
    await page.type('#email', email)
    await page.type('#phone-number', '0412345678')
    await page.type('#university', 'E2E University')
    await page.type('#degree-name', 'Software Engineering')
    await page.type('#years-of-experience', '3')

    await page.type('#skill-input', 'Node.js')
    await page.click('button.skill-add-button')

    await page.select('#preferred-working-mode', 'Remote')
    await page.type('#preferred-location', 'Singapore')

    await page.type('#password', 'candidatePass123!')
    await page.type('#confirm-password', 'candidatePass123!')

    await Promise.all([
      page.click('form.login-form button[type="submit"]'),
      page.waitForFunction(
        (path) => window.location.pathname === path,
        {},
        '/search-jobs',
      ),
    ])

    await goto(page, '/profile')
    await waitForText(page, fullName)

    await page.waitForSelector('button.candidate-membership-button')
    await page.click('button.candidate-membership-button')
    await page.waitForFunction(
      () =>
        document.body &&
        (document.body.innerText.includes('Membership active') ||
          document.body.innerText.includes('Premium')),
    )

    console.log('Candidate registration & membership flow: OK')
  } finally {
    await browser.close()
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
