import * as express from 'express'
import * as passport from 'passport'
import * as jwt from 'jsonwebtoken'

const userAPI = express();

// When the user sends a post request to this route, passport authenticates the user based on the
// middleware created previously
// userAPI.post('/signup', passport.authenticate('signup', { session : false }) , async (req, res, next) => {
//   res.json({
//     message : 'Signup successful',
//     user : req.user
//   });
// });

userAPI.post('/signup', async (req, res, next) => {
  passport.authenticate('signup',{ session : false }, async (err, user) => {
    try {
      if(err){
        const error = new Error('An Error occurred')
        res.status(500).send({message: err.message})
        return next(error);
      }
      else{
        res.json({
          message : 'Signup successful',
          user : req.user
        });
      }
      

    } catch (error) {
        return next(error);
    }
  })(req, res, next);
});

userAPI.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
      try {
        if(err || !user){
          const error = new Error('An Error occurred')
          res.status(401).send({message: info.message})
          return next(error);
        }
        req.login(user, { session : false }, async (error) => {
          if( error ) return next(error)
          //We don't want to store the sensitive information such as the
          //user password in the token so we pick only the email and id
          const body = { _id : user._id, email : user.email };
          //Sign the JWT token and populate the payload with the user email and id
          const token = jwt.sign({ user : body },'top_secret', { expiresIn: '1d' });
          //Send back the token to the user
          return res.json({ token });
        });     
      } catch (error) {
          return next(error);
      }
    })(req, res, next);
  });
  
export { userAPI };