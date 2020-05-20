const bcrypt = require('bcrypt')

const hashPassword = data => {
    return bcrypt.hashSync(data,10)
}

const comparePassword = (password,hash) => {
    return bcrypt.compareSync(password,hash)
}

module.exports = {
    hashPassword,
    comparePassword
}