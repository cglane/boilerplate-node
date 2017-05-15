import express from 'express';
import httpStatus from 'http-status';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => {
  res.status(200).send('Authentication OK')
});


export default router;
