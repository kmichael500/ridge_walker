import { SubmittedPoint } from '../models/SubmittedPoint'
import * as express from 'express'
import {Request, Response, NextFunction} from 'express';
const submittedPointAPI = express();
submittedPointAPI.use(express.json());

// add a single submission to database
submittedPointAPI.post("/", (req, res, next) => {
    
        const newSubmission = new SubmittedPoint({
            point: req.body.point,
            submitted_by: req.body.submitted_by,
            status: req.body.status,
            pointType: req.body.pointType,
        })
        newSubmission.save((err) => {
            if (err) {
                console.log("\n `err`");
                next(err)
            }
            else {
                console.log('Saved submission successfully!');
                res.send("Point under review.").status(400);
            }
        });
    
});

// Endpoint to get all submitted points
submittedPointAPI.get('/', (req, res, next) => {
    SubmittedPoint.find((err, submittedPoints) => {
        if (err) {
            console.log("\nsubmittedPointsAPI.get('/')  error");
            next(err)
        }
        else {
            res.json(submittedPoints)
        }
    })
});

// Endpoint to get a single submitted point
submittedPointAPI.get('/:id', (req, res, next) => {
    SubmittedPoint.findById(req.params.id, (err, submittedPoint) => {
        if (err) {
            console.log("\nsubmittedPointAPI.get('/:id')  error");
            next(err)
        } else if (submittedPoint == null) {
            console.log("\nsubmittedPointAPI.get('/:id')  error");
            err = new Error("Submitted point for Id does not exist");
            next(err)
        }
        else {
            res.json(submittedPoint)
        }
      });
});

// Endpoint to update a single submission
submittedPointAPI.put('/:id', (req, res, next) => {
    SubmittedPoint.findByIdAndUpdate(req.params.id, req.body, (err, submittedPoint) => {
        if (err) {
            console.log("\nsubmittedPointAPI.put('/:id')  error");
            next(err)
        }
        else{
            res.sendStatus(200);
        }
        
    });
});

// Endpoint to delete a single submission
submittedPointAPI.delete('/:id', (req, res, next) => {
    SubmittedPoint.findByIdAndDelete(req.params.id, (err, submittedPoint) => {
        if (err) {
            console.log("\nsubmittedPointAPI.get('/:id')  error");
            next(err)
        } else if (submittedPoint == null) {
            console.log("\nsubmittedPointAPI.get('/:id')  error");
            err = new Error("Submitted point for Id does not exist");
            next(err)
        }
        else {
            res.send("Sucsess");
        }
      });
});

//Catches every request to a route we have not defined elsewhere.
submittedPointAPI.get('*', (req, res, next) => {
    const err = new Error('Page Not Found');
    next(err);
});


//General server error handler
submittedPointAPI.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(500)
    console.error("ERROR MESSAGE")
    console.error(err.message);
    console.log();
})

export { submittedPointAPI };