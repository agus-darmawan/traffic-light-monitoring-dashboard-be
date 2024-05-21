import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'regions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
       .integer('zone_id')
       .notNullable()
       .unsigned()
       .references('id')
       .inTable('zones')
       .onDelete('CASCADE')
       .notNullable()
      table.string('name').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}