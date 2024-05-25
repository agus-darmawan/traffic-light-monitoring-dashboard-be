import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'statuses'

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
      table.boolean('is_active')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}