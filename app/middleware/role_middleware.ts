import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
    redirectTo = '/403'

    async handle({ auth, response }: HttpContext, next: NextFn, [role]: [string]) {
        if (auth.user?.role !== role) {
            return response.redirect(this.redirectTo)
        }

        await next()
    }
}
