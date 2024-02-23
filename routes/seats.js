import { Router } from 'express'
import { create } from '../controllers/seats.js'
import * as auth from '../middlewares/auth.js'
import admin from '../middlewares/admin.js'

const router = Router()
router.post('/', auth.jwt, admin, create)

export default router
