const User1 = require('../models/Register');
const User2 = require('../models/Register2');
const bcrypt = require('bcryptjs');
const errors = require('restify-errors');
const Joi = require('joi');
const config = require('../config');
require('dotenv').config();

//Joi Schema
const registrant = Joi.object().keys({
    username: Joi.string().required().max(20).trim().min(3).regex(/^[a-zA-Z0-9]+$/),
    email: Joi.string().required().email().trim().lowercase(),
    password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,20}$/).trim(),
    
});

const registrant2 = Joi.object().keys({
    username: Joi.string().required().max(20).trim().min(3).regex(/^[a-zA-Z0-9]+$/),
    email: Joi.string().required().email().trim().lowercase(),
    password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,20}$/).trim(),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required()
    
});

/**********************************/

exports.registerV1 = async (req, res, next) => {
    var { email, password, username} = req.body;
    const user = new User1({
        username, email, password
    });
  
   
    const data = req.body;
    const dataCompare = (Joi.validate(data, registrant).error === null);
    const dataCompare1 = Joi.validate(data, registrant);

    if(dataCompare === false){
        res.send({Validation_results: dataCompare1});
        return next();
        
    }else{
        const userPresent = await User1.findOne({ 'email': dataCompare1.value.email })
        if (userPresent) {
            //res.send({ Error: 'Email is already in use.'});
            return next(new errors.InvalidContentError('Email is already in used.'));
        }else{

        bcrypt.genSalt(10, (_err, salt) => {
            bcrypt.hash(user.password, salt, async (err, hash) => {
            // Hash Password
            user.password = hash;
            // Save User
            try {
                const newUser = await user.save();
                res.send(201);
                next();
            } catch (err) {
                return next(new errors.InternalError(err.message));
            }
            });
        });


   }}};



    



/*******************************************************************V2*/

   exports.registerV2 = async (req, res, next) => {
    var { email, password, username} = req.body;
   
    const data2 = req.body;
    const dataCompare2 = (Joi.validate(data2, registrant2).error === null);
    const dataCompare22 = Joi.validate(data2, registrant2);

    if(dataCompare2 === false){
        res.send({ Validation_Errors: dataCompare22});
        return next();
        
    }else{
        
        const user2 = new User2({
            username, email, password
        });
        const userPresent2 = await User2.findOne({ 'email': dataCompare22.value.email })
        if (userPresent2) {
            res.send({ Error: 'Email is already in use.'});
            return next();
        }else{

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user2.password, salt, async (err, hash) => {
            // Hash Password
            user2.password = hash;
            // Save User
            try {
                res.send(201);
                next();
            } catch (err) {
                return next(new errors.InternalError(err.message));
            }
            });
        });


   }};



  
   


  
    
            
    
        

                

    
       

    
     

      

    // bcrypt.genSalt(10, (err, salt) => {
    //   bcrypt.hash(user.password, salt, async (err, hash) => {
    //     // Hash Password
    //     user.password = hash;
    //     // Save User
    //     try {
    //       const newUser = await user.save();
    //       res.send(201);
    //       next();
    //     } catch (err) {
    //       return next(new errors.InternalError(err.message));
    //     }
    //   });
    // });

};