import  express from "express"
import multer from "multer";
import { pool }  from "../db.js"
import { v4 as uuidv4 } from 'uuid';
import  { CreateUser } from "./queries.js"
import AWS from "aws-sdk"
import multerS3 from "multer-s3"
import * as dotenv from 'dotenv'
dotenv.config() 

const router = express.Router()
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "us-east-2",
  endpoint: "s3.us-east-2.amazonaws.com"
 
});


router.get('/', (req, res) => {
  pool.query(`SELECT * FROM users`, (error, result) => {
    if (error) 
      throw error

    res.status(200).send( result.rows );
  });
  })

router.get('/', (req, res) => {
  const lastNameId = req.params.id;
  pool.query(`SELECT * FROM users WHERE id = '${lastNameId}'`, (error, result) => {
    if (error) {
      result.status(500).send({ message: error.message });
      return;
    }

    res.status(200).send({ users: result.rows });
  });
  })


  router.post('/', (req, res, next) => {
   
    const userId = uuidv4();
    const url = `https://hug-qr.space/user/${userId}`
    
    const upload = multer({
      storage: multerS3({
        s3: s3,
        bucket: "aws.qr",
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
          let prefix;
          if (file.fieldname === `photo`) {
            prefix = 'photo';
          } else if (file.fieldname === "video") {
            prefix = "videos";
          } else if (file.fieldname === "cover") {
            prefix = "cover";
          } else {
            prefix = 'other';
          }    
          const key = `attachments/${prefix}/${userId}/${file.originalname}`;
          cb(null, key)
        },
      }),
    }).fields([{ name: "photo", maxCount: 50 }, { name: "video", maxCount: 1 }, { name: "cover", maxCount: 1 }]);
  
    upload(req, res, async (err) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        const { lastName, firstName, email, phone, address, city, postal, description, birthYear, deathYear, terms, biography } = req.body;
        const photoUrls = req.files['photo'] ? req.files['photo'].map((file) => file.location) : [];
        const coverUrl = req.files['cover'] ? req.files['cover'][0].location : null;
        const videoUrl = req.files['video'] ? req.files['video'][0].location : null;
  
        try {
           pool.query(
            CreateUser, [userId, lastName, firstName, email, phone, address, city, postal, description, birthYear, deathYear, terms, biography, photoUrls, videoUrl, coverUrl, url]
          );
          res.sendStatus(201);
        } catch (error) {
          console.error(error);
          res.sendStatus(500);
        }
      }
    });
  });

 
  
  

  export default router