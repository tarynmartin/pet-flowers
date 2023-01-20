const puppeteer = require('puppeteer');

const startBrowser = async () => {
  const browser = await puppeteer.launch();
  const catsURL = 'https://www.aspca.org/pet-care/animal-poison-control/cats-plant-list';
  const dogsURL = 'https://www.aspca.org/pet-care/animal-poison-control/dogs-plant-list'

  const sectionDiv = '.view-all-plants-list'
  const scraper = async(url) => {
    const scrappedData = []
    let page = await browser.newPage();
    console.log('navigating to page');
    await page.goto(url);
    await page.waitForSelector('.view-all-plants-list');
    let urls = await page.evaluate(sectionDiv => {
      const links = [...document.querySelectorAll('.view-content > .views-row')].map(el => el.querySelector('a').href)
      return links;
    }, sectionDiv);

    let pagePromise = (link) => new Promise(async(resolve, reject) => {
      let dataObj = {};
      let newPage = await browser.newPage();
      await newPage.goto(link);
      const commonNames = '.pane-node-field-additional-common-names'

      dataObj.popularNames = await newPage.evaluate(commonNames => {
        // removing textContent iterates; keeping text content will print the obj but won't iterate...
        const names = document.querySelector('.field-name-field-additional-common-names > .field-items').textContent
        return names;
      }, commonNames)
      resolve(dataObj)
      console.log('obj', dataObj);
      await newPage.close();
    });

    for(link in urls) {
      const currentPageData = await pagePromise(urls[link]);
      scrappedData.push(currentPageData)
    }
    
    return scrappedData;
  };

  let data = scraper(catsURL)
  // data += scraper(dogsURL);
  console.log('data', data);
  // await browser.close()
};

module.exports = { startBrowser }

      // dataObj.scientificName = await newPage.$eval('.field-name-field-scientific-name > .values', text => text.textContent)
      // dataObj.family = await newPage.$eval('.field-name-field-family > .values', text => text.textContent)
      // dataObj.toxicCats = await newPage.$eval('.field-name-field-toxicity > .values', text => text.textContent.includes('Toxic to Cats'))
      // dataObj.toxicDogs = await newPage.$eval('.field-name-field-toxicity > .values', text => text.textContent.includes('Toxic to Dogs'))
      // dataObj.description = await newPage.$eval('.field-name-field-toxic-principles > .values', text => text.textContent)
      // dataObj.signs = await newPage.$eval('.field-name-field-clinical-signs > .values', text => text.textContent)