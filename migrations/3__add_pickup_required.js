/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
exports.up = (pgm) => {
  pgm.addColumn('donations', {
    pickup_required: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
  })
}

/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
exports.down = (pgm) => {
  pgm.dropColumn('donations', 'pickup_required')
}
