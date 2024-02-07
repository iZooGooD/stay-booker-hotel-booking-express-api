import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.json({ message: 'express JSON' });
});

export default router;
