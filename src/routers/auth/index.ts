import express from 'express'
import * as authController from '@controllers/auth'
import isAuth from '@utils/isAuth'
import isOnboard from '@utils/isOnboard'

const router = express.Router()

router.get('/google', authController.getGoogleAuth)
router.get('/github', authController.getGithubAuth)
router.get('/google/callback', authController.googleCallback);
router.get('/github/callback', authController.githubCallback);
router.post('/onboard', isAuth, authController.onboard);
router.get('/', isOnboard, authController.getDashBoard);

export default router