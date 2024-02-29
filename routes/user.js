import { Router } from 'express'
import { create, login, logout, extend, getProfile, getUsers, getMe } from '../controllers/user.js'
import * as auth from '../middlewares/auth.js'
import admin from '../middlewares/admin.js'

const router = Router()
router.post('/', create)
router.post('/login', auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.patch('/extend', auth.jwt, extend)
router.get('/me', auth.jwt, getProfile)
router.get('/', auth.jwt, admin, getUsers)
router.get('/', auth.jwt, getMe)

export default router
