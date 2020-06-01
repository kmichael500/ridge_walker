import * as express from 'express';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import {UserModel} from '../models/User';
import {SubmittedPoint} from '../models/SubmittedPoint';

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
  passport.authenticate('signup', {session: false}, async (err, user) => {
    try {
      if (err) {
        const error = new Error('An Error occurred');
        res.status(500).send({message: err.message});
        return next(error);
      } else {
        res.json({
          message: 'Signup successful',
          user: req.user,
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
      if (err || !user) {
        const error = new Error('An Error occurred');
        res.status(401).send({message: info.message});
        return next(error);
      }
      req.login(user, {session: false}, async error => {
        if (error) return next(error);
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        const body = JSON.parse(JSON.stringify(user));
        body.password = 'undefined';
        //Sign the JWT token and populate the payload with the user email and id
        const token = jwt.sign({user: body}, 'top_secret', {expiresIn: '1d'});
        //Send back the token to the user
        return res.json({token, user: body});
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

//Let's say the route below is very sensitive and we want only authorized users to have access

//Displays information tailored according to the logged in user
userAPI.get(
  '/profile',
  passport.authenticate('jwt', {session: false}),
  (req, res, next) => {
    // const id = (<any>req).user._id;

    UserModel.findById((<any>req).user._id, (err, currentUser) => {
      if (err) {
        console.log("\nUserAPI.get('/profile')  error");
        next(err);
      } else if (currentUser == null) {
        console.log("\nuserAPI.get('/profile')  error");
        err = new Error('User does not exist');
        next(err);
      } else {
        currentUser.password = 'undefined';
        res.json(currentUser);
      }
    });
    //We'll just send back the user details and the token
    // res.json({
    //   message : 'You made it to the secure route',
    //   user : req.user,
    //   token : req.query.secret_token
    // })
  }
);

//Displays information tailored according to the logged in user
userAPI.get(
  '/submissions',
  passport.authenticate('jwt', {session: false}),
  (req, res, next) => {
    // const id = (<any>req).user._id;

    SubmittedPoint.find(
      {submitted_by: (<any>req).user._id},
      (err, submittedPoints) => {
        if (err) {
          console.log("\nuserAPI.get('/submissions')  error");
          next(err);
        } else {
          res.json(submittedPoints);
        }
      }
    );
    //We'll just send back the user details and the token
    // res.json({
    //   message : 'You made it to the secure route',
    //   user : req.user,
    //   token : req.query.secret_token
    // })
  }
);

//Displays information tailored according to the logged in user
userAPI.get(
  '/:id',
  passport.authenticate('jwt', {session: false}),
  (req, res, next) => {
    const role = (<any>req).user.role;
    const status = (<any>req).user.status;
    if (role === 'Admin') {
      UserModel.findById(req.params.id, (err, currentUser) => {
        if (err) {
          console.log("\nuserAPI.get('/:id')  error");
          next(err);
        } else if (currentUser == null) {
          console.log("\nuserAPI.get('/:id')  error");
          err = new Error('User does not exist');
          next(err);
        } else {
          currentUser.password = 'undefined';
          res.json(currentUser);
        }
      });
    } else if (role === 'User' && status !== 'Pending') {
      console.log('Requested User');
      UserModel.findById(req.params.id, (err, currentUser) => {
        if (err) {
          console.log("\nuserAPI.get('/:id')  error");
          next(err);
        } else if (currentUser == null) {
          console.log("\nuserAPI.get('/:id')  error");
          err = new Error('User does not exist');
          next(err);
        } else {
          currentUser.password = 'undefined';
          res.json(currentUser);
        }
      });
    } else {
      console.log("\nuserAPI.get('/:id') error");
      const err = new Error('Unauthorized');
      next(err);
    }
    //We'll just send back the user details and the token
    // res.json({
    //   message : 'You made it to the secure route',
    //   user : req.user,
    //   token : req.query.secret_token
    // })
  }
);

export {userAPI};
