import * as passport from 'passport';

import { Strategy as localStrategy } from 'passport-local'
import { UserModel, UserInterface } from '../models/User';

//Create a passport middleware to handle user registration
passport.use('signup', new localStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
}, async (req, email: string, password: string, done) => {
    try {
      //Save the information provided by the user to the the database
      const user = await UserModel.create({
        email,
        password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,
        phoneNumber: req.body.phoneNumber,
        nssNumber: req.body.nssNumber
      } as UserInterface);
      //Send the user information to the next middleware
      return done(null, user);
    } catch (error) {
      if (error.name === 'MongoError' && error.code === 11000){
        const err = new Error('Email Not Unique');
        err.message = 'Email already exists.'
        return done(err, false, { message : 'Email already exists.'});
      }
      else{
        return done(error);
      }
      
    }
}));

//Create a passport middleware to handle User login
passport.use('login', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async (email, password, done) => {
  try {
    //Find the user associated with the email provided by the user
    const user = await UserModel.findOne({ email });
    if( !user ){
      //If the user isn't found in the database, return a message
      return done(null, false, { message : 'User not found'});
    }
    //Validate password and make sure it matches with the corresponding hash stored in the database
    //If the passwords match, it returns a value of true.
    const validate = await user.isValidPassword(password);
    if( !validate ){
      return done(null, false, { message : 'Wrong Password'});
    }
    //Send the user information to the next middleware
    return done(null, user, { message : 'Logged in Successfully'});
  } catch (error) {
    return done(error);
  }
}));

import { Strategy as JWTstrategy } from 'passport-jwt'
//We use this to extract the JWT sent by the user
import { ExtractJwt as ExtractJWT } from 'passport-jwt'

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  //secret we used to sign our JWT
  secretOrKey : 'top_secret',
  //we expect the user to send the token as a query parameter with the name 'secret_token'
  jwtFromRequest : ExtractJWT.fromUrlQueryParameter('secret_token')
}, async (token, done) => {
  try {
    //Pass the user details to the next middleware
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));