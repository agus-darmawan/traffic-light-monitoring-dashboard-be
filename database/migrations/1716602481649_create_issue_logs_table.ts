import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'issue_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
      .integer('device_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('devices')
      .onDelete('CASCADE')
      .notNullable()
      table.timestamp('reported_at').notNullable()
      table.timestamp('resolved_at').nullable()
      table.text('issue_description').notNullable()
      table.text('resolution_description').nullable()
      table.string('resolved_by').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}