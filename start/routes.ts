const AuthController = () => import('#controllers/auth_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

import { HttpContext } from '@adonisjs/core/http'

router.get('/', async ({ response }: HttpContext) => {
    response.status(200).json({
      status: 200,
      message: 'Welcome to SMBRICast by Agus Darmawan',
    })
  })
  
  // Group routers under api/v1 prefix
  router.group(() => {
    router.group(() => {
      router.post('/login', [AuthController, 'login'])
      router.post('/register', [AuthController, 'register'])
      router.get('/email/verify/:email/:id', [AuthController, 'verifyEmail']).as('verifyEmail')
      router.post('/password/forgot', [AuthController, 'forgotPassword'])
      router.post('/password/reset/:id/:token', [AuthController, 'resetPassword']).as('resetPassword')
      router.group(() => {
        router.get('/user', [AuthController, 'user'])
        router.post('/logout', [AuthController, 'logout'])
        router.post('/email/verify/resend', [AuthController, 'resendVerificationEmail'])
      }).middleware(middleware.auth({ guards: ['api'] }))
    }).prefix('/auth')


  }).prefix('/api/v1')