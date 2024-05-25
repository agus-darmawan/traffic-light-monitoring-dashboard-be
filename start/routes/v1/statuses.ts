const StatusesController = () => import('#controllers/statuses_controller')
import router from '@adonisjs/core/services/router'

export default function statusesRoutes(){
    router.group(() => {
        router.post('/', [StatusesController,'store'])
        router.get('/', [StatusesController, 'index'])
        router.get('/:id', [StatusesController,'show'])
        router.patch('/:id', [StatusesController, 'update'])
        router.delete('/:id', [StatusesController, 'destroy'])
    }).prefix('/statuses')
}