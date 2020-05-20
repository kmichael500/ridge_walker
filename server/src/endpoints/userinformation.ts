import * as express from 'express';

const userInfoAPI = express();

//Let's say the route below is very sensitive and we want only authorized users to have access

//Displays information tailored according to the logged in user
userInfoAPI.get('/profile', (req, res, next) => {
  //We'll just send back the user details and the token
  res.json({
    message : 'You made it to the secure route',
    user : req.user,
    token : req.query.secret_token
  })
});

export { userInfoAPI }