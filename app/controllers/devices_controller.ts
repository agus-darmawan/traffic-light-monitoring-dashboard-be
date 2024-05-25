import type { HttpContext } from '@adonisjs/core/http'
import Device from '#models/device'
import { responseUtil } from '../../helper/response_util.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export default class DevicesController {
    async index({ response }: HttpContext) {
        const devices = await Device.all()
        return responseUtil.success(response, devices, 'Devices retrieved successfully')
    }

    async show({ params, response }: HttpContext) {
        const device = await Device.findBy('id', params.id)
        if (!device) {
            return responseUtil.notFound(response)
        }
        return responseUtil.success(response, device, 'Device retrieved successfully')
    }

    async store({ request, response }: HttpContext) {
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
    
        const device = await Device.create({
            name: data.name,
            regionId: data.region_id,
            registeredBy: data.registered_by,
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
