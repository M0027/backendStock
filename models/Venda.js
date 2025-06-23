const db = require('../config/db');

class Venda {
  static async criar(produto_id, quantidade, preco_unitario, data_venda, loja_id) {
    const { rows: produtoRows } = await db.query(
      'SELECT stock FROM produtos WHERE id = $1 AND loja_id = $2',
      [produto_id, loja_id]
    );
    
    const produto = produtoRows[0];
    
    
    if (!produto || produto.stock < quantidade) {
      throw new Error('Estoque insuficiente');
    }
    
    
    try {
      
      const client = await db.connect();

      await client.query('BEGIN');

      // Atualiza o estoque
      const updateEstoque = await client.query(
        'UPDATE produtos SET stock = stock - $1 WHERE id = $2 AND loja_id = $3',
        [quantidade, produto_id, loja_id]
      );

      // Verifica se o produto foi encontrado e atualizado
      if (updateEstoque.rowCount === 0) {
        throw new Error('Produto não encontrado ou não pertence à loja');
      }

      // 2. Insere a venda (com RETURNING para obter o ID)
      const vendaResult = await client.query(
        `INSERT INTO vendas 
       (produto_id, quantidade, preco_unitario, data_venda, loja_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id`,
        [produto_id, quantidade, preco_unitario, data_venda, loja_id]
      );

      console.log(vendaResult.rows[0].id)

      // Confirma a transação
      await client.query('COMMIT');

      // Retorna o ID da venda criada
      return { id: vendaResult.rows[0].id };

    } catch (error) {
      await conn.rollback();
      conn.release();
      throw error;
    }
  }

  static async listar(loja_id) {
    const { rows: resust } = await db.query(`
  SELECT v.id, v.produto_id, p.nome AS nome_produto, v.quantidade, v.total, v.data_venda
  FROM vendas v
  JOIN produtos p ON v.produto_id = p.id
  WHERE v.loja_id = $1
  ORDER BY v.data_venda DESC
`, [loja_id]);

  console.log(resust)
    return resust;

  }

  static async deletar(id) {
    await db.query(
      'DELETE FROM vendas WHERE id = $1', [id]
    );
  }

  static async buscarPorId(id) {
    const { rows: result } = await db.query(
      'SELECT * FROM vendas WHERE id = $1', [id]);
    return result[0]; // retorna apenas a venda com o id
  }




}

module.exports = Venda;
