import express from 'express';
const router = express.Router();
import cookieParser from 'cookie-parser';

// Use JSON middleware before defining routes
router.use(express.json());
router.use(cookieParser());


router.post('/', (req, res) => {

 

  res.clearCookie('cookies-jwt', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 0, // Setting maxAge to 0 or a negative value immediately expires the cookie
  });

    // Set Cache-Control header to prevent caching
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Expires', '0');
    res.setHeader('Pragma', 'no-cache');
  

  return res.status(200).json({ message: 'Logged out successfully' });
});


export default router;
