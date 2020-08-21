const puppeteer = require('puppeteer')
const dotenv = require('dotenv')
const fs = require('fs')

dotenv.config()

const findPrices = async (productName) => {
	console.log('\nInitiation: Starting Ebay Server Environment...\n')
	const timeout = parseInt(process.env.EBAY_TIMEOUT) * 1000
	process.setMaxListeners(0)
	const headless = process.env.EBAY_HEADLESS == 'true'
	const url = process.env.EBAY_URL || ''
	const browser = await puppeteer.launch({ headless, timeout: 0 })
	const page = await browser.newPage()
	await page.goto(url, { waitUntil: 'networkidle2', timeout: 0})
	console.log('Process 1: Landed on the correct page on Ebay...')
	await page.$eval(
		'.ui-autocomplete-input',
		(el, productName) => {
			el.value = productName
		},
		productName
	)
	console.log(`Process 2: Typed in "${productName}" in search bar`)
	await page.click('input[type="submit"]')
	console.log('Process 3: Clicked on the Submit Button')
	await page.waitForNavigation({timeout: 0})
	const typeOfProduct = await page.$eval('.SECONDARY_INFO', (element) => {
		return element.textContent
    })
    console.log(typeOfProduct)
	page.click('.s-item__title', {timeout: 0})
	console.log('Process 4: Clicked on First Link')
	await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 0})
	console.log(`Process 5: Starting to scrape item page for "${productName}"`)
	const price = await page.$eval('span[itemprop="price"]', (element) => {
		const priceString = element.textContent
		let price = parseInt(priceString.replace('US $', ''))
		return price
	})
	await browser.close()
	return {price, typeOfProduct}
}

module.exports = findPrices
