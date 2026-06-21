/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
exports.up = (pgm) => {
  pgm.sql('CREATE EXTENSION IF NOT EXISTS pgcrypto')

  pgm.createTable('donations', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    donor_name: { type: 'text', notNull: true },
    donor_email: { type: 'text', notNull: true },
    donor_phone: { type: 'text' },
    donation_type: {
      type: 'text',
      notNull: true,
      check: "donation_type IN ('money','item')",
    },
    amount: { type: 'numeric(12,2)' },
    item_description: { type: 'text' },
    item_quantity: { type: 'integer' },
    status: {
      type: 'text',
      notNull: true,
      default: 'pending',
      check: "status IN ('pending','confirmed','canceled')",
    },
    message: { type: 'text' },
    donated_at: { type: 'date', notNull: true, default: pgm.func('CURRENT_DATE') },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  })

  pgm.createIndex('donations', 'status')
  pgm.createIndex('donations', 'donated_at')
}

/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
exports.down = (pgm) => {
  pgm.dropTable('donations')
}
