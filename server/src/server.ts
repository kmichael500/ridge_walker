import * as Express from 'express';
import * as mongoose from 'mongoose'

import { masterPointsAPI } from './endpoints/masterPointsAPI'


const app = Express();
/*

DB Config
Add your MongoDB connection string in the keys file.
This keys file is stored in /config/keys.ts
Do not commit this file.
The file looks like this:

  export const mongoURI = ""

*/

import { mongoURI } from './config/keys'
import { mapsAPI } from './endpoints/maps';

// Connect to MongoDB
mongoose.connect(
    mongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err: Error) => console.log(err));


mongoose.set('useFindAndModify', false);

//Handle errors
// tslint:disable-next-line: no-any
app.use((err: any, req: any, res: any, next: any) => {
  res.status(err.status || 500);
  res.json({ error : err });
});


// fixes CORS issues
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');
  next();
});


// Routes
app.use("/api/points/master", masterPointsAPI);
app.use("/api/maps", mapsAPI);

app.use(Express.static(__dirname + '/public'))
const port = process.env.PORT || 5000;

const server = app.listen(port, () => console.log(`Server up and running on port ${port} !`));
