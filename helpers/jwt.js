const jwt = require('jsonwebtoken')

module.exports = {
    createToken : (value) => {
        return jwt.sign(value, process.env.SECRET)
    }
}