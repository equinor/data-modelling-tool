const puppeteer = require('puppeteer')
import UtilPuppeteer from './utilPuppeteer'
const utilPuppeteer = new UtilPuppeteer()

describe('ContextMenu', () => {
  let browser: any, page: any

  beforeAll(async () => {
    browser = await puppeteer.launch({
      // Debug mode !
      // headless: false,
      slowMo: 80,
    })
    page = await browser.newPage()
    await page.setViewport({ width: 1366, height: 768 })
    await page.goto('http://localhost:80', { waitUntil: 'domcontentloaded' })
    await page.waitForResponse((response: any) => response.ok())
    await page.waitForSelector('.react-contextmenu-wrapper')
    await page.screenshot({ path: './integration/screenshot.png' })
  }, 60000)

  afterAll(async () => {
    browser.close()
  })

  afterEach(async () => {
    //cleanup
    await page.screenshot({ path: './integration/cleanup.png' })
  })

  test('should open CarPackage', async () => {
    await utilPuppeteer.openNode({
      page,
      text: 'SSR-DataSource',
      element: 'div',
      childText: 'CarPackage',
    })
    await utilPuppeteer.openNode({
      page,
      text: 'CarPackage',
      element: 'div',
      childText: 'Car',
    })
    await page.screenshot({ path: './integration/click.png' })
    const visible: boolean = await utilPuppeteer.isVisible(page, 'Car', 'div')
    expect(visible).toBeTruthy()

    await utilPuppeteer.closeNode({
      page,
      text: 'CarPackage',
      childText: 'Car',
      element: 'div',
    })
    await utilPuppeteer.closeNode({
      page,
      text: 'SSR-DataSource',
      childText: 'CarPackage',
      element: 'div',
    })
  }, 30000)

  test('should add root package', async () => {
    await utilPuppeteer.clickDiv({
      page,
      text: 'SSR-DataSource',
      element: 'div',
      rightClick: true,
    })
    await utilPuppeteer.clickDiv({ page, text: 'New', element: 'span' })
    await utilPuppeteer.clickDiv({ page, text: 'Root Package', element: 'div' })
    await utilPuppeteer.waitFor(page, 'name')
    await utilPuppeteer.waitFor(page, 'submit', 'button')
    await page.type('input[label=name]', 'testRootPackage')
    await utilPuppeteer.clickButton({ page, text: 'Submit' })
    await utilPuppeteer.openNode({
      page,
      childText: 'CarPackage',
      text: 'SSR-DataSource',
      element: 'div',
    })
    const visible: boolean = await utilPuppeteer.isVisible(
      page,
      'testRootPackage',
      'div'
    )
    expect(visible).toBeTruthy()

    await removePackage(page, 'SSR-DataSource', 'testRootPackage')
  }, 30000)
})

async function removePackage(page: any, text: string, childText: string) {
  await utilPuppeteer.openNode({ page, text, childText, element: 'div' })
  await utilPuppeteer.clickDiv({
    page,
    text: childText,
    element: 'div',
    rightClick: true,
  })
  await utilPuppeteer.clickDiv({
    page,
    text: 'Remove',
    element: 'div',
    index: 5,
  })
  await utilPuppeteer.clickButton({ page, text: 'Delete' })
}
