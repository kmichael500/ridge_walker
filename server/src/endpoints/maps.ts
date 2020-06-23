import * as express from 'express';
import * as multer from 'multer';
import {Request, Response, NextFunction} from 'express';
import * as fs from 'fs';

import 'pdf-image';

import * as glob from 'glob';
import {PDFImage} from 'pdf-image';

// Initialize an express api and configure it parse requests as JSON
const mapsAPI = express();
mapsAPI.use(express.json());

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public')
//     },
//     filename: function (req, file, cb) {
//         // You could rename the file name
//         // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))

//         // You could use the original name
//         cb(null, file.originalname)

//     }
// });

const storage = multer.memoryStorage();
var upload = multer({storage: storage});

var upload = multer({storage: storage});
// // View map in browser
// mapsAPI.get("/:mapName", (req, res, next)=>{
//     try{
//         res.sendFile(req.params.mapName,{root: "./public/maps"})
//     }
//     catch(error){
//         res.sendStatus(404);
//     }
// })

// Map as image
mapsAPI.get('/image/:mapName.png', (req, res, next) => {
  try {
    let rootFolder = './';
    if (process.env.ROOTFOLDER){
      rootFolder = process.env.ROOTFOLDER;
    }
    const pdfPath = rootFolder + '/public/maps/' + req.params.mapName + '.pdf';
    const pageNumber = 0;
    const pdfImage = new PDFImage(pdfPath, {
      convertOptions: {
        // '-resize': '80%',
        '-density': '200',
        '-background': 'white',
        '-alpha': 'background -alpha off',
      },
      outputDirectory: rootFolder + '/public/maps/images/',
      //   combinedImage: true
    });
    pdfImage.setConvertExtension('png');

    if (rootFolder !== './'){
      rootFolder = '/'
    }
    pdfImage.convertPage(0).then(
      imagePath => {
        res.sendFile(imagePath, {root: rootFolder});
      },
      err => {
        res.send(500);
      }
    );
  } catch (error) {
    res.sendStatus(404);
  }
});

// Get map file names for a single point
mapsAPI.get('/:id/getAll', (req, res, next) => {
  const searchString = req.params.id + '_*.pdf';
  let rootFolder = './';
  if (process.env.ROOTFOLDER){
    rootFolder = process.env.ROOTFOLDER;
  }
  glob(searchString, {cwd: "public/maps", root:rootFolder}, (err, files) => {
    console.log(files);
    if (err) {
      console.log(err);
    } else {
      try {
        res.json(files);
      } catch (error) {
        res.sendStatus(404);
      }
    }
  });
});

// Download a map as pdf
mapsAPI.get('/:id', (req, res, next) => {
  try {
    let rootFolder = './';
    if (process.env.ROOTFOLDER){
      rootFolder = process.env.ROOTFOLDER;
    }
    const file = fs.createReadStream(rootFolder + '/public/maps/' + req.params.id);
    const stat = fs.statSync(rootFolder + '/public/maps/' + req.params.id);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    const fileName = 'attachment; ' + req.params.id;
    res.setHeader('Content-Disposition', fileName);
    file.pipe(res);
  } catch (error) {
    console.log('File not found');
    console.log(req.params.id);
    res.sendStatus(404);
    next(error);
  }
});

//Catches every request to a route we have not defined elsewhere.
mapsAPI.get('*', (req, res, next) => {
  const err = new Error('Page Not Found');
  next(err);
});

//General server error handler
mapsAPI.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(500);
  console.error('ERROR MESSAGE');
  console.error(err.message);
});

export {mapsAPI};
