const fs = require('fs')

const log = string => {
    fs.appendFile('dataLogger.txt', string, err => {
        if (err) {
            return console.error(err)
        }
        console.log('Successful logging')
    })
}

module.exports = log