import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable('transactions', function(table){
        table.bigIncrements('id');
       table.integer('user_id').notNullable()
        table.integer('transactiontype').notNullable();
        table.decimal('amount').notNullable();
        table.string('transactionId').notNullable();
        table.string('beneficiary').nullable()
        table.text('comments').nullable();
        table.timestamps(false, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .dropSchemaIfExists('transactions')
}

