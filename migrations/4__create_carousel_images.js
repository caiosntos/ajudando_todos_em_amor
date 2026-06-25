exports.up = pgm => {
  pgm.createTable('carousel_images', {
    id: { type: 'serial', primaryKey: true },
    filename: { type: 'varchar(255)', notNull: true },
    alt_text: { type: 'varchar(255)', notNull: true, default: "'Foto do carrossel'" },
    display_order: { type: 'integer', notNull: true, default: 0 },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  })

  pgm.sql(`
    INSERT INTO carousel_images (filename, alt_text, display_order) VALUES
    ('luana-1.png', 'Luana entregando doações', 0),
    ('doacao.png', 'Doações sendo entregues', 1)
  `)
}

exports.down = pgm => {
  pgm.dropTable('carousel_images')
}
