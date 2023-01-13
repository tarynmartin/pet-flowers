const puppeteer = require('puppeteer');

const startBrowser = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log('navigating to page');
  await page.goto('https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants')
  let scrapedData = [];

  const sectionDiv = '.view-all-plants-list'
  const viewHeader = '.view-header';
  const viewContent = '.view-content';
  const viewRow = '.views-row'

  const linkForPlant = '.field-content'
  const nextButton = '.pager-next'

  const scrapeCurrentPage = async () => {
    try {
      await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 0})
      await page.waitForSelector('.view-content', { timeout: 0 })
    } catch (e) {
      console.error('error', e);
    }
    let urls = await page.$$eval('.field-content', links => {
      links = links.map(link => link.querySelector('a').href)
      return links;
    })
    console.log('links', urls)
  }
  scrapeCurrentPage()

  // const results = await page.evaluate(sectionDiv => {
    // want to find each section;
    // return array of items in each section
    // const sectionHeaders = [...document.querySelectorAll('.view-header')].map(header => header.textContent.trim());
    // const plants = [...document.querySelectorAll('.view-content > .views-row')].map(row => row.textContent.trim())
    // return { headers: sectionHeaders, plants };
  // }, sectionDiv)

  // console.log('results', results);
  await browser.close()
};

module.exports = { startBrowser }