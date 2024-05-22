import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'

import { middleware } from './kernel.js'
import authRoutes from './routes/v1/auth.js'
import zoneRoutes from './routes/v1/zones.js'
import regionsRoutes from './routes/v1/regions.js'

router.get('/', async ({ response }: HttpContext) => {
  response.status(200).json({
    status: 200,
    message: 'Welcome to SMBRICast by Agus Darmawan',
  })
})
  
router.group(() => {
  authRoutes()
  router.group(() => {
    router.group(() => {
      zoneRoutes()
      regionsRoutes()
    }).middleware(middleware.verifiedEmail())
  }).middleware(middleware.auth({ guards: ['api'] }))

}).prefix('/api/v1')