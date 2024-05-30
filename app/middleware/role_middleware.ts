import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
    redirectTo = '/login'

    async handle({ auth, response}: HttpContext, next: NextFn, role: string) {
        if (auth.user?.role !== role && auth.user?.role !== 'superadmin') {
            return response.status(401).send({ message: 'Unauthorized' })
        }
        await next()
    }
}
