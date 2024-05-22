import type { HttpContext } from '@adonisjs/core/http'
import Device from '#models/device'
import { responseUtil } from '../../helper/response_util.js'

export default class DevicesController {
    async index({ response }: HttpContext) {
        const devices = await Device.all()
        return responseUtil.success(response, devices, 'Devices retrieved successfully')
    }

    async show({ params, response }: HttpContext) {
        const device = await Device.findBy('tid', params.tid)
        if (!device) {
            return responseUtil.notFound(response)
        }
        return responseUtil.success(response, device, 'Device retrieved successfully')
    }

    async store({ request, response }: HttpContext) {
        const data = request.only(['tid', 'name', 'zoneId', 'regionId'])
        const device = await Device.create(data)
        return responseUtil.created(response, device, 'Device created successfully')
    }

    async update({ params, request, response }: HttpContext) {
        const device = await Device.findBy('tid', params.tid)
        if (!device) {
            return responseUtil.notFound(response)
        }
        const data = request.only(['name', 'zoneId', 'regionId'])
        device.merge(data)
        await device.save()
        return responseUtil.success(response, device, 'Device updated successfully')
    }

    async destroy({ params, response }: HttpContext) {
        const device = await Device.findBy('tid', params.tid)
        if (!device) {
            return responseUtil.notFound(response)
        }
        await device.delete()
        return responseUtil.noContent(response, 'Device deleted successfully')
    }
}
