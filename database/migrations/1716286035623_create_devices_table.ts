import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'devices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table
      .integer('zone_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('zones')
      .onDelete('CASCADE')
      .notNullable()
      table
      .integer('region_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('regions')
      .onDelete('CASCADE')
      .notNullable()
      table
      .integer('registered_by')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}