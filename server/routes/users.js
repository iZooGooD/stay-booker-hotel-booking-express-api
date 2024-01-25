import express from 'express';

const router = express.Router();

/* GET users listing. */
router.get('/:userId', function (req, res, next) {
  const userId = req.params.userId;
  res.json({ 'userId': userId })
});

export default router;
