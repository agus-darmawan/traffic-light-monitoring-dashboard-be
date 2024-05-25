import type { HttpContext } from '@adonisjs/core/http'
import Technician from '#models/technician'
import { responseUtil } from '../../helper/response_util.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export default class TechniciansController {
    async index({ response }: HttpContext) {
        const zones = await Technician.all()
        return responseUtil.success(response, zones, 'Techinians retrieved successfully')
    }

    async show({ params, response }: HttpContext) {
        const zone = await Technician.find(params.id)
        if (!zone) {
            return responseUtil.notFound(response)
        }
        return responseUtil.success(response, zone, 'Technician retrieved successfully')
    }

    async store({ request, response }: HttpContext) {
        const data = await vine
            .compile(
                vine.object({
                    user_id: vine.number(),
                    region_id: vine.number()
                })
            )
            .validate(request.all(), {
                messagesProvider: new SimpleMessagesProvider({
                    'required': 'The {{ field }} field is required.',
                }),
            })

        const zone = await Technician.create({
            userId: data.user_id,
            regionId: data.region_id,
        })

        return responseUtil.created(response, zone)
    }

    async update({ params, request, response }: HttpContext) {
        const zone = await Technician.find(params.id)
        if (!zone) {
            return responseUtil.notFound(response)
        }

        const data = await vine
            .compile(
                vine.object({
                    user_id: vine.number(),
                    region_id: vine.number()
                })
            )
            .validate(request.all(), {
                messagesProvider: new SimpleMessagesProvider({
                    'required': 'The {{ field }} field is required.',
                }),
            })

        zone.userId = data.user_id
        zone.regionId = data.region_id
        await zone.save()

        return responseUtil.success(response, zone, 'Technician updated successfully')
    }

    async destroy({ params, response }: HttpContext) {
        const zone = await Technician.find(params.id)
        if (!zone) {
            return responseUtil.notFound(response)
        }

        await zone.delete()
        return responseUtil.noContent(response)
    }
}