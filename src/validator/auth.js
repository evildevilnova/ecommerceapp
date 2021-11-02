const {check, validationResult} = require('express-validator');

// for signup
exports.validateRequest = [
    check('name')
    .notEmpty()
    .withMessage('name is requied'),
    check('phone')
    .isMobilePhone()
    .withMessage('Invalid Phone number'),
    check('password')
    .isLength({min: 6})
    .withMessage('Password length must be 6 digit.4')
];
// for signin
exports.validatesigninRequest = [
    check('phone')
    .isMobilePhone()
    .withMessage('Invalid email'),
    check('password')
    .isLength({min: 6})
    .withMessage('Password length must be 6 digit.4')
];

exports.isRequestValidated = (req, res, next) => {
    const errors =  validationResult(req);
    if(errors.array().length > 0){
        return res.status(400).json({error: errors.array()[0].msg });
    }
    
    next();
};