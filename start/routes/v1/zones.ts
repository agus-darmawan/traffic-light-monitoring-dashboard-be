const ZonesController = () => import('#controllers/zones_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export default function zoneRoutes(){
    router.group(() => {
        router.group(() => {
            router.post('/', [ZonesController, 'index'])
            router.get('/:id', [ZonesController,'show'])
            router.put('/:id', [ZonesController, 'update'])
            router.delete('/:id', [ZonesController, 'destroy'])
        }).middleware(middleware.auth({ guards: ['api'] }))
    }).prefix('/zone')
}