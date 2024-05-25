const StatusesController = () => import('#controllers/statuses_controller')
import router from '@adonisjs/core/services/router'

export default function statusesRoutesPrivate(){
    router.group(() => {
        router.get('/', [StatusesController, 'index'])
        router.get('/:id', [StatusesController,'show'])
        router.delete('/:id', [StatusesController, 'destroy'])
    }).prefix('/statuses')
}