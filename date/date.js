import  express from "express"



const router = express.Router()
router.use(express.json());

router.get('/', (req, res) => {
    const currentTime = new Date().toLocaleString();
    res.json({ currentTime });
  });
  

export default router