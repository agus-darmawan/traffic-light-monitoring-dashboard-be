import type { HttpContext } from '@adonisjs/core/http'
import Device from '#models/device'
import Region from '#models/region'
import Zone from '#models/zone'
import Technician from '#models/technician'
import User from '#models/user'
import { responseUtil } from '../../helper/response_util.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export default class DevicesController {
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

    
    async show({ params, response }: HttpContext) {
        const device = await Device.findBy('id', params.id)
        if (!device) {
            return responseUtil.notFound(response)
        }
        return responseUtil.success(response, device, 'Device retrieved successfully')
    }      
    async store({auth, request, response }: HttpContext) {
        const authCheck = await auth.authenticate();
        const userId = authCheck.currentAccessToken.tokenableId;
        const data = await vine
          .compile(
            vine.object({
                name: vine.string().trim(),
                region_id: vine.number(),
            })
          )
          .validate(request.all(), {
            messagesProvider: new SimpleMessagesProvider({
              'required': 'The {{ field }} field is required.',
            }),
          })
    
        const device = await Device.create({
            name: data.name,
            regionId: data.region_id,
            registeredBy: Number(userId),
        })
    
        return responseUtil.created(response, device)
    }

    async update({ params, request, response }: HttpContext) {
        const device = await Device.findBy('id', params.id)
        if (!device) {
            return responseUtil.notFound(response)
        }

        const data = await vine
            .compile(
                vine.object({
                    name: vine.string().trim(),
                    region_id: vine.number(),
                    registered_by: vine.number(),
                })
            )
            .validate(request.all(), {
                messagesProvider: new SimpleMessagesProvider({
                'required': 'The {{ field }} field is required.',
                }),
            })

            device.name = data.name
            device.regionId = data.region_id
            device.registeredBy = data.registered_by
            await device.save()
        return responseUtil.success(response, device, 'Device updated successfully')
    }

    async destroy({ params, response }: HttpContext) {
        const device = await Device.findBy('id', params.tid)
        if (!device) {
            return responseUtil.notFound(response)
        }
        await device.delete()
        return responseUtil.noContent(response, 'Device deleted successfully')
    }
}
