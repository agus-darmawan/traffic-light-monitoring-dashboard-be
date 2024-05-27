const UsersController = () => import('#controllers/users_controller')
import router from '@adonisjs/core/services/router'

export default function usersRoutes(){
    router.group(() => {
        router.get('/:role', [UsersController, 'index'])
        router.post('/', [UsersController,'store'])
        router.get('/:id', [UsersController,'show'])
        router.patch('/:id', [UsersController, 'update'])
        router.delete('/:id', [UsersController, 'destroy'])
    }).prefix('/users')
}