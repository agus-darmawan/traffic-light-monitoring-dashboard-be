const StatusesController = () => import('#controllers/statuses_controller')
import router from '@adonisjs/core/services/router'

export default function statusesRoutesPublic(){
    router.group(() => {
        router.post('/', [StatusesController,'store'])
        router.patch('/:id', [StatusesController, 'update'])
    }).prefix('/statuses')
}