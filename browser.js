const puppeteer = require('puppeteer');
const fs = require('fs');
const firebase = require('./firebaseconfig');

const startBrowser = async () => {
  const browser = await puppeteer.launch();
  const catsURL = 'https://www.aspca.org/pet-care/animal-poison-control/cats-plant-list';
  const dogsURL = 'https://www.aspca.org/pet-care/animal-poison-control/dogs-plant-list'

  const sectionDiv = '.view-all-plants-list'
  
  const scraper = async(url, fileName) => {
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

      dataObj.name = await newPage.evaluate(() => {
        const name = document.querySelector('.pane-1 > h1')?.textContent
        return name ? name : ''
      })

      dataObj.popularNames = await newPage.evaluate(commonNames => {
        const names = document.querySelector('.field-name-field-additional-common-names > .field-items')?.textContent
        if (names) {
          const splitNames = names.split(": ")
          return splitNames[1].split(', ')
        }
        return [];
      }, commonNames)

      dataObj.scientificName = await newPage.evaluate(() => {
        const name = document.querySelector('.field-name-field-scientific-name > .field-items')?.textContent
        if (name) {
          const splitName = name.split(": ")
          return splitName[1]
        }
        return '';
      })

      dataObj.family = await newPage.evaluate(() => {
        const familyName = document.querySelector('.field-name-field-family > .field-items')?.textContent
        if (familyName) {
          const splitName = familyName.split(": ")
          return splitName[1]
        }
        return '';
      })

      dataObj.signs = await newPage.evaluate(() => {
        const signs = document.querySelector('.field-name-field-clinical-signs > .field-items')?.textContent
        if (signs) {
          const splitName = signs.split(": ")
          return splitName[1]
        }
        return '';
      })

      dataObj.description = await newPage.evaluate(() => {
        const description = document.querySelector('.field-name-field-toxic-principles > .field-items')?.textContent
        if (description) {
          const splitName = description.split(": ")
          return splitName[1]
        }
        return '';
      })

      dataObj.toxicCats = await newPage.evaluate(() => {
        const toxicity = document.querySelector('.field-name-field-toxicity > .field-items')?.textContent
        if (toxicity) {
          const splitName = toxicity.split(": ")
          return !splitName[1].includes['Non-Toxic to Cats'] && splitName[1].includes('Toxic to Cats')
        }
        return false;
      })

      dataObj.toxicDogs = await newPage.evaluate(() => {
        const toxicity = document.querySelector('.field-name-field-toxicity > .field-items')?.textContent
        if (toxicity) {
          const splitName = toxicity.split(": ")
          return !splitName[1].includes['Non-Toxic to Dogs'] && splitName[1].includes('Toxic to Dogs')
        }
        return false;
      })
      
      resolve(dataObj)
      console.log('obj', dataObj);
      await newPage.close();
    });

    for(link in urls) {
      const currentPageData = await pagePromise(urls[link]);
      scrappedData.push(currentPageData)
    }
    
    // await browser.close()
    const slicedData = scrappedData.slice(0, 3);
    slicedData.forEach(datum => firebase.savePlant(datum));
    console.log('sliced', slicedData)
    // fs.writeFile(`${fileName}.json`, JSON.stringify(scrappedData), 'utf-8', function(err) {
    //   if (err) return console.log('error: ', err);
    //   console.log('Data has been scraped and saved')
    // })
  };

  // const data = {}
  try {
    await scraper(catsURL, 'cats')
    await scraper(dogsURL, 'dogs');
    // console.log('data', data);
    // fs.writeFile('data.json', JSON.stringify(data), 'utf-8', function(err) {
    //   if (err) return console.log('error: ', err);
    //   console.log('Data has been scraped and saved')
    // })
  } catch (e) {
    console.error('issue getting data', e)
  }
};

module.exports = { startBrowser }
