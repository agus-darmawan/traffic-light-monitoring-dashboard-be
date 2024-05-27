
const DashboardController = () => import('#controllers/dashboard_controller')
import router from '@adonisjs/core/services/router'

export default function dashboardRoutes(){
    router.group(() => {
        router.get('/', [DashboardController, 'index'])
    }).prefix('/dashboard')
}