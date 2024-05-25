import type { HttpContext } from '@adonisjs/core/http'
import IssueLog from '#models/issue_log'
import { responseUtil } from '../../helper/response_util.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { DateTime } from 'luxon'

export default class IssueLogsController {
  public async index({ response }: HttpContext) {
    const issueLogs = await IssueLog.all()
    return responseUtil.success(response, issueLogs)
  }

  public async store({ request, response }: HttpContext) {
    const data = await vine
    .compile(
      vine.object({
        deviceId: vine.number(),
        reportedAt: vine.string(),
        issueDescription: vine.string().trim(),
      })
    )
    .validate(request.all(), {
      messagesProvider: new SimpleMessagesProvider({
        'required': 'The {{ field }} field is required.',
      }),
    })

  const issueLog = await IssueLog.create({
    ...data,
    reportedAt: DateTime.fromISO(data.reportedAt)
  })
  return responseUtil.created(response, issueLog)
  }

  public async show({ params, response }: HttpContext) {
    const issueLog = await IssueLog.find(params.id)
    if (!issueLog) {
      return responseUtil.notFound(response, 'Issue log not found')
    }
    return responseUtil.success(response, issueLog)
  }

  public async update({ params, request, response }: HttpContext) {
    const issueLog = await IssueLog.find(params.id)
    if (!issueLog) {
      return responseUtil.notFound(response, 'Issue log not found')
    }

    const data = await vine
      .compile(
        vine.object({
          deviceId: vine.number().optional(),
          reportedAt: vine.string().optional(),
          resolvedAt: vine.string().optional(),
          issueDescription: vine.string().trim().optional(),
          resolutionDescription: vine.string().trim().optional(),
          resolvedBy: vine.string().trim().optional(),
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'The {{ field }} field is required.',
        }),
      })
    let reportedAt, resolvedAt;
    if (data.reportedAt) {
      reportedAt = DateTime.fromISO(data.reportedAt)
    }
    if (data.resolvedAt) {
      resolvedAt = DateTime.fromISO(data.resolvedAt)
    }

    issueLog.merge({...data,
        reportedAt: reportedAt,
        resolvedAt: resolvedAt,
    })
    await issueLog.save()

    return responseUtil.success(response, issueLog, 'Issue log updated successfully')
  }

  public async destroy({ params, response }: HttpContext) {
    const issueLog = await IssueLog.find(params.id)
    if (!issueLog) {
      return responseUtil.notFound(response, 'Issue log not found')
    }

    await issueLog.delete()
    return responseUtil.noContent(response)
  }
}
