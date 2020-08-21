const evaluatePricing = (expectedPrice, typeOfProduct, item) => {
	const typesAndRatios = [
		{
			type: 'New',
			ratio: 0.15,
		},
		{
			type: 'Open Box',
			ratio: 0.125,
		},
		{
			type: 'Refurbished',
			ratio: 0.1,
		},
		{
			type: 'Used',
			ratio: 0,
		},
		{
			type: 'Pre-Owned',
			ratio: 0,
		},
		{
			type: 'Brand New',
			ratio: 0.15,
		},
    ]
    let ratio = 0
    typesAndRatios.forEach(object => {
        if (object.type === typeOfProduct) {
            ratio = object.ratio
        }
    })
	const itemPrice = item.price
	console.log('Item Price on Craigslist: ' + itemPrice)
	console.log('Expected price: ' + expectedPrice)
	const scamPricing = expectedPrice - 0.9 * expectedPrice
	const bestPrice = expectedPrice - 0.3 * expectedPrice  - (ratio * expectedPrice)
	const greatPrice = expectedPrice - 0.2 * expectedPrice - - (ratio * expectedPrice)
	const goodPrice = expectedPrice - 0.15 * expectedPrice - (ratio * expectedPrice)
	const okayPrice = expectedPrice - 0.1 * expectedPrice - (ratio * expectedPrice)
	if (itemPrice > expectedPrice) {
		return { status: 'fail' }
	} else if (itemPrice <= bestPrice && itemPrice > scamPricing) {
		return { status: 'excellent' }
	} else if (itemPrice <= greatPrice && itemPrice > scamPricing) {
		return { status: 'great' }
	} else if (itemPrice <= goodPrice && itemPrice > scamPricing) {
		return { status: 'good' }
	} else if (itemPrice <= okayPrice && itemPrice > scamPricing) {
		return { status: 'ok' }
	} else if (itemPrice <= scamPricing) {
		return { status: 'excellent (potential to be a scam)' }
	} else {
		return { status: 'undecided' }
	}
}

module.exports = evaluatePricing
