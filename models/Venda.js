const db = require('../config/db');

class Venda {
  static async criar(produto_id, quantidade, preco_unitario, data_venda, loja_id) {
    const [produtoRows] = await db.query(
      'SELECT stock FROM produtos WHERE id = ? AND loja_id = ?',
      [produto_id, loja_id]
    );


    const produto = produtoRows[0];

    if (!produto || produto.stock < quantidade) {
      throw new Error('Estoque insuficiente');
    }

    // Inicia uma transação
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Atualiza o estoque
      await conn.query(
        'UPDATE produtos SET stock = stock - ? WHERE id = ? AND loja_id = ?',
        [quantidade, produto_id, loja_id]
      );

      // Insere a venda
      const [result] = await conn.query(
        'INSERT INTO vendas (produto_id, quantidade, preco_unitario, data_venda, loja_id) VALUES (?, ?, ?, ?, ?)',
        [produto_id, quantidade, preco_unitario, data_venda, loja_id]
      );


      await conn.commit();
      conn.release();

      return { id: result.insertId };
    } catch (error) {
      await conn.rollback();
      conn.release();
      throw error;
    }
  }

  static async listar(loja_id) {
    const [rows] = await db.query(`
  SELECT v.id, v.produto_id, p.nome AS nome_produto, v.quantidade, v.total, v.data_venda
  FROM vendas v
  JOIN produtos p ON v.produto_id = p.id
  WHERE v.loja_id = ?
  ORDER BY v.data_venda DESC
`, [loja_id]);

    return rows;
  }

  static async deletar(id) {
    await db.query(
      'DELETE FROM vendas WHERE id = ?', [id]
    );
  }

 static async buscarPorId(id) {
  const [rows] = await db.query(
  'SELECT * FROM vendas WHERE id = ?', [id]);
  return rows[0]; // retorna apenas a venda com o id
}




}

module.exports = Venda;
