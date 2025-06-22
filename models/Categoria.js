const db = require('../config/db');

const Categoria = {
  listar: async (loja_id) => {
    const [rows] = await db.query("SELECT id, nome FROM categorias WHERE loja_id = ?", [loja_id]);
    return rows;
  },

  criar: async (nome, loja_id) => {
    const [result] = await db.query(`
  INSERT INTO categorias (nome, loja_id)
  SELECT ?, ?
  FROM lojas
  WHERE id = ?
`, [nome, loja_id, loja_id]);

    return result.insertId;
  },

  deletar: async (id,loja_id) => {
   await db.query("DELETE FROM categorias WHERE id = ? AND loja_id = ?", [id, loja_id]);

  }
};

module.exports = Categoria;
