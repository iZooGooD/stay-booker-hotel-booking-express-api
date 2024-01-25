import express from 'express';

const router = express.Router();

/* GET users listing. */
router.get('/:userId', async function (req, res, next) {
  res.json({ 'users': users })
});

export default router;
