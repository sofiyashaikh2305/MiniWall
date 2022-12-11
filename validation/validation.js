const joi = require('joi')

//Validate Registeration User Input
const registerValidation = (data) => {
    const schemaValidation = joi.object({
        username:joi.string().required().min(3).max(256),
        email:joi.string().required().min(3).max(256).email(),
        password:joi.string().required().min(3).max(1024)
    })
    return schemaValidation.validate(data)
}

//Validate Login Input
const loginValidation = (data) => {
    const schemaValidation = joi.object({
        email:joi.string().required().min(3).max(256).email(),
        password:joi.string().required().min(3).max(1024)
    })
    return schemaValidation.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation