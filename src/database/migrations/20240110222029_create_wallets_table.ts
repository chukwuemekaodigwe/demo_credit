import { Knex, SchemaBuilder } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable('wallets', function(table){
        table.increments('id');
        table.integer('user_id').notNullable();
        //table.foreign('id', 'user_id').references('users.id');
        table.string('walletId').notNullable()
        table.decimal('balance', 10, 2).defaultTo(0.00)
        table.timestamps()
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .dropTableIfExists('wallets')
}

