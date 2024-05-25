import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class IssueLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare deviceId: number

  @column()
  declare reportedAt: DateTime

  @column()
  declare resolvedAt: DateTime

  @column()
  declare issueDescription: string

  @column()
  declare resolutionDescription: string

  @column()
  declare resolvedBy: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
