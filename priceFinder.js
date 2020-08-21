const puppeteer = require('puppeteer')
const dotenv = require('dotenv')
const fs = require('fs')

dotenv.config()

const findPrices = async (productName) => {
	console.log('\nInitiation: Starting Ebay Server Environment...\n')
	const timeout = parseInt(process.env.EBAY_TIMEOUT) * 1000
	// await page.setDefaultNavigationTimeout(timeout)
	// emitter.setMaxListeners([100])
	process.setMaxListeners(0)
	const headless = process.env.EBAY_HEADLESS == 'true'
	const url = process.env.EBAY_URL || ''
	const browser = await puppeteer.launch({ headless })
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
	await page.waitForNavigation()
	const typeOfProduct = await page.$eval('.SECONDARY_INFO', (element) => {
		return element.textContent
    })
    console.log(typeOfProduct)
	page.click('.s-item__title')
	console.log('Process 4: Clicked on First Link')
	await page.waitForNavigation({ waitUntil: 'networkidle2' })
	console.log(`Process 5: Starting to scrape item page for "${productName}"`)
	//<span class="notranslate" id="prcIsum" itemprop="price" style="" content="329.0">US $329.00</span>
	const price = await page.$eval('span[itemprop="price"]', (element) => {
		const priceString = element.textContent
		let price = parseInt(priceString.replace('US $', ''))
		return price
	})
	// console.log('Process 6: Gathering info for the Reference URL')
	//     try {
	//         const referenceURL = await page.$eval(() => {
	//         return window.location.href
	//     })
	//     } catch (err) {
	//         console.log('FAILED Process 6: Unable to gather info for the Reference URL --> Continuing Operation')
	//         // console.error(err)
	//     }
	// console.log(`\nIdeal price for a ${typeOfProduct} "${productName}": ${price}\n`)
	// try {
	//     console.log('Reference URL ' + referenceURL)
	// } catch {
	//     console.log('Unable to retrieve info for the Reference URL')
	// }
	await browser.close()
	return {price, typeOfProduct}
}

module.exports = findPrices
