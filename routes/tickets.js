import { Router } from 'express'
import { create } from '../controllers/tickets.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'

const router = Router()
router.post('/', auth.jwt, upload, create)

export default router
