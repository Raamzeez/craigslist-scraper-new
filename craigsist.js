const puppeteer = require('puppeteer')
const dotenv = require('dotenv')

dotenv.config()
 
const scrapeData = async () => {
  try {
    console.log('\nInitiation: Starting Craigslist Server Environment...\n')
    process.setMaxListeners(0)
    const headless = (process.env.CRAIGSLIST_HEADLESS == 'true')
    const browser = await puppeteer.launch({headless})
    const page = await browser.newPage()
    const url = process.env.CRAIGSLIST_URL || ''
    const paragraphQuery = '.result-info'
    await page.goto(url, {waitUntil: 'networkidle2', timeout: 0})
    console.log('Process 1: Landed on the correct page on Craigslist...\n')
    const listOfProducts = await page.$$eval(paragraphQuery, async (elementsArray) => {
      let items = []
      const priceArray = document.getElementsByClassName('result-price')
      const productNamesArray = document.getElementsByClassName('hdrlnk')
      for (let i = 0; i < elementsArray.length - 20; i ++) {
        let price
        if (i == 0) {
          price = priceArray[i].innerHTML
          price = parseInt(price.replace('$', ''))
        } else {
          price = priceArray[i+i].innerHTML
          price = parseInt(price.replace('$', ''))
        }
        const productName = productNamesArray[i].innerHTML
        items.push({name: productName, price})
      }
      return items
    })
    console.log('Completed Scraping\n\n\n')
    await browser.close()
    return listOfProducts
  } catch (err) {
    return console.error('Error in Scraping Craigslist')
  }
}

module.exports = scrapeData