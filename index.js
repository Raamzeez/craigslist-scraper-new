const scrapeData = require('./craigsist')
const findPrices = require('./priceFinder')
const evaluatePricing = require('./evaluatePricing')
const log = require('./logger')
const dotenv = require('dotenv')

dotenv.config()

const rounds = parseInt(process.env.ROUNDS)

scrapeData().then((productsInfo) => {
	for (let i = 0; i < rounds; i++) {
		findPrices(productsInfo[i].name).then(({ price, typeOfProduct }) => {
			console.log(productsInfo[i])
			const status = evaluatePricing(price, typeOfProduct, productsInfo[i])
			console.log(status)
			const logData = `------------------------------------------------------------------------\n
			\nTime: ${new Date()}
			\nItem Entry #: ${i + 1}\nProduct Name: ${
				productsInfo[i].name
			} \nType of Product: ${typeOfProduct} \nPrice on Craigslist: ${
				productsInfo[i].price
			}\nPrice on Ebay: ${price}\nStatus Determined: ${status.status}\n\n`
			log(logData)
		})
	}
})

//scrapeData() //- Returns an array of objects with a product name and price attached

// findPrices('Macbook Pro 2018') //- Figure out how to await this - Returns price that the product should be used (done on each object)

// console.log(evaluatePricing(400, {name: 'Macbook', price: 360})) //- Accepts the expected value and the item object and returns an object with the proper status
