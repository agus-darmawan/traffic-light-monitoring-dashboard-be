const DevicesController = () => import('#controllers/devices_controller')
import router from '@adonisjs/core/services/router'

export default function devicesRoutes(){
    router.group(() => {
        router.get('/', [DevicesController, 'index'])
        router.post('/', [DevicesController,'store'])
        router.get('/:id', [DevicesController,'show'])
        router.patch('/:id', [DevicesController, 'update'])
        router.delete('/:id', [DevicesController, 'destroy'])
    }).prefix('/devices')
}