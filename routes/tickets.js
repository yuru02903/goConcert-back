import { Router } from 'express'
import { create, getMyTickets, getLaunchedTickets, edit, getTicketId } from '../controllers/tickets.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'
// import admin from '../middlewares/admin.js'

const router = Router()
router.post('/', auth.jwt, upload, create)
router.patch('/:id', auth.jwt, edit)
router.get('/all', getLaunchedTickets)
router.get('/my', auth.jwt, getMyTickets)
router.get('/:id', getTicketId)

export default router
