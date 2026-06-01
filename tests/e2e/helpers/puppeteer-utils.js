const puppeteer = require('puppeteer')

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:80'
const DEFAULT_TIMEOUT = Number(process.env.E2E_TIMEOUT || 30000)

function uniqueId(prefix = 'e2e') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function uniqueEmail(prefix = 'user') {
  return `${prefix}-${uniqueId(prefix)}@example.com`
}

async function launchBrowser() {
  return puppeteer.launch({
    headless: process.env.E2E_HEADLESS !== 'false',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
}

async function createPage(browser) {
  const page = await browser.newPage()
  page.setDefaultTimeout(DEFAULT_TIMEOUT)
  page.setDefaultNavigationTimeout(DEFAULT_TIMEOUT)
  await page.setViewport({ width: 1280, height: 800 })
  return page
}

async function goto(page, path) {
  await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle2' })
}

async function waitForText(page, text) {
  await page.waitForFunction(
    (value) => document.body && document.body.innerText.includes(value),
    {},
    text,
  )
}

async function expectText(page, text) {
  const content = await page.evaluate(() => (document.body ? document.body.innerText : ''))
  if (!content.includes(text)) {
    throw new Error(`Expected text "${text}" not found`)
  }
}

async function login(page, { email, password, expectedPath }) {
  await goto(page, '/login')
  await page.waitForSelector('#email')
  await page.type('#email', email)
  await page.type('#password', password)
  await Promise.all([
    page.click('form.login-form button[type="submit"]'),
    page.waitForFunction(
      (path) => window.location.pathname === path,
      {},
      expectedPath,
    ),
  ])
}

async function loginAsCandidate(
  page,
  email = 'candidate1@example.com',
  password = 'candidatepass123',
) {
  await login(page, { email, password, expectedPath: '/search-jobs' })
}

async function loginAsCompany(
  page,
  email = 'company1@example.com',
  password = 'companypass123',
) {
  await login(page, { email, password, expectedPath: '/search-candidates' })
}

module.exports = {
  BASE_URL,
  createPage,
  expectText,
  goto,
  launchBrowser,
  loginAsCandidate,
  loginAsCompany,
  uniqueEmail,
  uniqueId,
  waitForText,
}
