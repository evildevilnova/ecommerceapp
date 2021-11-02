const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const shortid = require('shortid');

exports.signup = (req, res) => {

    User.findOne({email: req.body.email})
    .exec( async (error, data) => {
        if(data) return res.status(400).json({
            message : "User is already registered"
        });
            const {
                name,
                phone,
                password
            } = req.body;
            const hash_password = await bcrypt.hash(password, 10);
            const _user = new User({
                name,
                hash_password,
                phone,
                username: shortid.generate()
            });
    
            _user.save((error, data) => {
                if(error){
                    return res.status(400).json({
                        message: "something went wrong"
                    });
                }
    
                if(data){
                    return res.status(200).json({
                        message: "Ragistretion  is successful."
                    });
                }
            });
    })
} 

exports.signin = (req, res) => {

    User.findOne({phone: req.body.phone})
    .exec(async (error, user) => {
        if(error) return res.status(400).json({ error })
        if(user){

            if (user.authenticate(req.body.password)) {
                try {
                    const admin = await bcrypt.compare(req.body.password, user.hash_password)
                    if (admin) {
                        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
                        // res.cookie("token", token);
                        const { name, role, phone} = user;

                        // storing token in client browser
                        res.status(200).json({
                            token,
                            user: {
                                name, role, phone
                            }
                        });
                    } else {
                        res.status(400).json({
                            message: "invalid password"
                        });
                    }
                } catch (e) {
                    res.status(400).json({
                        message: "server error"
                    });
                }

            } else {
                return res.status(400).json({
                    message: "invalid user"
                })
            }

    }

})
}

// exports.signin = (req, res) => {

//     User.findOne({email: req.body.email})
//     .exec((error, user) => {
//         if(error) return res.status(400).json({ error })
//         if(user){

//             if(user.authenticate(req.body.password)){
//                 const token = jwt.sign({_id: user._id, role: user.role } , process.env.JWT_SECRET , { expiresIn: '1d'});
//                 const {firstname, lastname, role ,email ,fullname} =user;

//                 // storing token in client browser
//                 res.cookie("jwt",token,{
//                     // expires: new Date(Date.now() + 3600000*24*24),
//                     httpOnly: true
//                 });
//                 ////
                
//                 res.status(200).json({
//                     token,
//                     user: {
//                         firstname, lastname, role ,email ,fullname
//                     }
//                 });
//             }else{
//                 return res.status(400).json({
//                     message: "invalid user"
//                 })
//             }
//         }else{

//         }
//     })
// }
