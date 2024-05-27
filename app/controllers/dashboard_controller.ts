import type { HttpContext } from '@adonisjs/core/http'
import Device from '#models/device'
import Region from '#models/region'
import Zone from '#models/zone'
import Technician from '#models/technician'
import User from '#models/user'
import { responseUtil } from '../../helper/response_util.js'

export default class DashboardController {
    async index({ response }: HttpContext) {
        try {
            const devices = await Device.all();
    
            const deviceData = await Promise.all(
                devices.map(async (device) => {
                    const region = await Region.find(device.regionId);
                    const zone = region ? await Zone.find(region.zoneId) : null;
                    const user = await User.find(device.registeredBy);
                    
                    let register_by_name = null;
                    if (user && user.role == 'technician') {
                        const technician = await Technician.findBy('user_id',device.registeredBy);
                        register_by_name = technician ? technician.name : null;
                    }
                    const tid = String(zone ? zone.id : null) +String(region ? region.id : null) +String(device.id)
                    
                    return {
                        id: device.id,
                        tid: tid,
                        name: device.name,
                        zone_id: zone ? zone.id : null,
                        zone_name: zone ? zone.name : null,
                        region_id: device.regionId,
                        region_name: region ? region.name : null,
                        register_by_id: device.registeredBy,
                        register_by: register_by_name ? register_by_name : user ? user.email : null,
                    };
                })
            );
    
            return responseUtil.success(response, deviceData, 'Devices retrieved successfully');
        } catch (error) {
            console.error(error);
            return responseUtil.notFound(response, 'Failed to retrieve devices');
        }
    }   
}