import type { HttpContext } from '@adonisjs/core/http'
import Region from '#models/region'
import { responseUtil } from '../../helper/response_util.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export default class RegionsController {
  async index({ response }: HttpContext) {
    const regions = await Region.all()
    return responseUtil.success(response, regions, 'Regions retrieved successfully')
  }

  async show({ params, response }: HttpContext) {
    const region = await Region.find(params.id)
    if (!region) {
      return responseUtil.notFound(response)
    }
    return responseUtil.success(response, region, 'Region retrieved successfully')
  }

  async store({ request, response }: HttpContext) {
    const data = await vine
      .compile(
        vine.object({
          name: vine.string().trim(),
          zone_id: vine.number(),
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'The {{ field }} field is required.',
        }),
      })

    const region = await Region.create({
      name: data.name,
      zoneId: data.zone_id,
    })

    return responseUtil.created(response, region)
  }

  async update({ params, request, response }: HttpContext) {
    const region = await Region.find(params.id)
    if (!region) {
      return responseUtil.notFound(response)
    }

    const data = await vine
      .compile(
        vine.object({
          name: vine.string().trim(),
          zone_id: vine.number(),
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'The {{ field }} field is required.',
        }),
      })

    region.name = data.name
    region.zoneId = data.zone_id
    await region.save()

    return responseUtil.success(response, region, 'Region updated successfully')
  }

  async destroy({ params, response }: HttpContext) {
    const region = await Region.find(params.id)
    if (!region) {
      return responseUtil.notFound(response)
    }

    await region.delete()
    return responseUtil.noContent(response)
  }
}
