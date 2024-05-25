import type { HttpContext } from '@adonisjs/core/http'
import Status from '#models/status'
import { responseUtil } from '../../helper/response_util.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export default class StatusesController {
    async index({ response }: HttpContext) {
        const devices = await Status.all()
        return responseUtil.success(response, devices, 'Statuses retrieved successfully')
    }

    async show({ params, response }: HttpContext) {
        const device = await Status.findBy('id', params.id)
        if (!device) {
            return responseUtil.notFound(response)
        }
        return responseUtil.success(response, device, 'Status retrieved successfully')
    }

    async store({ request, response }: HttpContext) {
        const data = await vine
          .compile(
            vine.object({
                device_id: vine.number(),
            })
          )
          .validate(request.all(), {
            messagesProvider: new SimpleMessagesProvider({
              'required': 'The {{ field }} field is required.',
            }),
          })
    
        const device = await Status.create({
            device_id: data.device_id,
            is_active: true,
        })
    
        return responseUtil.created(response, device)
    }

    async update({ params, response }: HttpContext) {
        const device = await Status.findBy('id', params.id)
        if (!device) {
            return responseUtil.notFound(response)
        }

        device.is_active = true
        await device.save()
        return responseUtil.success(response, device, 'Device updated successfully')
    }

    async destroy({ params, response }: HttpContext) {
        const device = await Status.findBy('id', params.tid)
        if (!device) {
            return responseUtil.notFound(response)
        }
        await device.delete()
        return responseUtil.noContent(response, 'Device deleted successfully')
    }
}