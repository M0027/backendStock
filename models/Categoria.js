const db = require('../config/db');

const Categoria = {
  listar: async (loja_id) => {
    const { rows: categoria } = await db.query("SELECT id, nome FROM categorias WHERE loja_id = $1", [loja_id]);
    return categoria;
  },

  criar: async (nome, loja_id) => {
    try {
      const { rows } = await db.query(`
  INSERT INTO categorias (nome, loja_id)
  SELECT $1, $2
  FROM lojas
  WHERE id = $2
  RETURNING id
`, [nome, loja_id]); // ← Agora apenas 2 elementos

      return rows[0].id; // Retorna o ID da nova categoria
    } catch (err) {
      if (err.code === '23503') { // foreign_key_violation
        throw new Error('Loja não existe');
      }
      throw err;
    }
  },

  deletar: async (id, loja_id) => {
    await db.query("DELETE FROM categorias WHERE id = $1 AND loja_id = $2", [id, loja_id]);

  }
};

module.exports = Categoria;
