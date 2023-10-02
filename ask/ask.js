import  express from "express"
import { pool }  from "../db.js"
import { v4 as uuidv4 } from 'uuid';
import  { Contact } from "./ask.queries.js"


const router = express.Router()
router.use(express.json());

router.post('/', (req, res) => {
    const {  email, phone, text, lastName, firstName } = req.body;
    const id = uuidv4()
    
    pool.query(Contact, [id, email, phone, text, lastName, firstName],
   (err, result) => {
     if (err) {
       console.error(err);
       return res.status(500).json({ error: 'Failed to save form data to the database' });
     } else {
        return res.status(201).json({ result: 'Form saved' })
     }

})})

export default router
