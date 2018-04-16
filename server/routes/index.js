import express from 'express'
import * as controllers from '../controllers'

const router = express.Router()

const devicesCtrl = new controllers.DevicesController()
router.get('/devices', devicesCtrl.index)
router.get('/devices/:nodeId', devicesCtrl.show)

const tagsCtrl = new controllers.TagsController()
router.get('/tags/:nodeId', tagsCtrl.show)

export default router
