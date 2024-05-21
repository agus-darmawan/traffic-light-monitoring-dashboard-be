import type { HttpContext } from '@adonisjs/core/http'
import Zone from '#models/zone'
import { responseUtil } from '../../helper/response_util.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export default class ZonesController {
    async index({ response }: HttpContext) {
        const zones = await Zone.all()
        return responseUtil.success(response, zones, 'Zones retrieved successfully')
    }

    async show({ params, response }: HttpContext) {
        const zone = await Zone.find(params.id)
        if (!zone) {
            return responseUtil.notFound(response)
        }
        return responseUtil.success(response, zone, 'Zone retrieved successfully')
    }

    async store({ request, response }: HttpContext) {
        const data = await vine
            .compile(
                vine.object({
                    name: vine.string().trim()
                })
            )
            .validate(request.all(), {
                messagesProvider: new SimpleMessagesProvider({
                    'required': 'The {{ field }} field is required.',
                }),
            })

        const zone = await Zone.create({
            name: data.name,
        })

        return responseUtil.created(response, zone)
    }

    async update({ params, request, response }: HttpContext) {
        const zone = await Zone.find(params.id)
        if (!zone) {
            return responseUtil.notFound(response)
        }

        const data = await vine
            .compile(
                vine.object({
                    name: vine.string().trim()
                })
            )
            .validate(request.all(), {
                messagesProvider: new SimpleMessagesProvider({
                    'required': 'The {{ field }} field is required.',
                }),
            })

        zone.name = data.name
        await zone.save()

        return responseUtil.success(response, zone, 'Zone updated successfully')
    }

    async destroy({ params, response }: HttpContext) {
        const zone = await Zone.find(params.id)
        if (!zone) {
            return responseUtil.notFound(response)
        }

        await zone.delete()
        return responseUtil.noContent(response)
    }
}
