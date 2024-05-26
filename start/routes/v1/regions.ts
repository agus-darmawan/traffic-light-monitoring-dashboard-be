const RegionsController = () => import('#controllers/regions_controller')
import router from '@adonisjs/core/services/router'

export default function regionsRoutes(){
    router.group(() => {
        router.get('/', [RegionsController, 'index'])
        router.post('/', [RegionsController,'store'])
        router.get('/:id', [RegionsController,'show'])
        router.get('/zone/:id', [RegionsController,'showByZoneId'])
        router.patch('/:id', [RegionsController, 'update'])
        router.delete('/:id', [RegionsController, 'destroy'])
    }).prefix('/regions')
}