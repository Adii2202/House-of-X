import db from './knex';

async function createTables() {
  try {
    await db.schema.createTable('logs', (table) => {
      table.increments('id').primary();
      table.string('message').notNullable();
      table.enum('type', ['error', 'info', 'verbose']).notNullable();
      table.timestamp('timestamp').defaultTo(db.fn.now());
      table.index(['timestamp']);
      table.index(['type']);
    });
    console.log('Table "logs" created successfully!');
  } catch (error: any) {
    console.error('Error creating table:', error.message);
  }
}

async function setup() {
  await createTables();
  db.destroy();
}

setup();
