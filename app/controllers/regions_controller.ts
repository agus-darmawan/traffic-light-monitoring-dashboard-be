import type { HttpContext } from '@adonisjs/core/http'
import Region from '#models/region'
import Zone from '#models/zone'
import { responseUtil } from '../../helper/response_util.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export default class RegionsController {
  async index({ response }: HttpContext) {
    try {
      const regions = await Region.all();
      const regionsWithZoneNames = await Promise.all(
        regions.map(async (region) => {
          const zone = await Zone.find(region.zoneId);
          return {
            id : region.id,
            name: region.name,
            zone_id: region.zoneId,
            zone_name: zone ? zone.name : null,
            timezone: region.timezone,
          };
        })
      );
      return responseUtil.success(response, regionsWithZoneNames, 'Regions retrieved successfully');
    } catch (error) {
      return responseUtil.notFound(response, 'Failed to retrieve regions');
    }
  }

  async show({ params, response }: HttpContext) {
    const region = await Region.find(params.id)
    if (!region) {
      return responseUtil.notFound(response)
    }
    return responseUtil.success(response, region, 'Region retrieved successfully')
  }
  async showByZoneId({ params, response }: HttpContext) {
    try {
      const zone = await Zone.find(params.id);
      if (!zone) {
        return responseUtil.notFound(response);
      }
  
      const devices = await Region.query().where('zone_id', zone.id);
      if (!devices) {
        return responseUtil.notFound(response, 'No devices found for this zone');
      }
  
      return responseUtil.success(response, devices, 'Devices retrieved successfully');
    } catch (error) {
      console.error('Error fetching devices by zone ID:', error);
      return responseUtil.notFound(response, 'An error occurred while fetching devices');
    }
}

  async store({ request, response }: HttpContext) {
    const data = await vine
      .compile(
        vine.object({
          name: vine.string().trim(),
          zone_id: vine.number(),
          timezone: vine.string().trim(),
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
      timezone: data.timezone,
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
          timezone: vine.string().trim(),
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'The {{ field }} field is required.',
        }),
      })

    region.name = data.name
    region.zoneId = data.zone_id
    region.timezone = data.timezone
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
