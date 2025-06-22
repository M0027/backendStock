const pool = require('../config/db.js');

class Produto {
  // Cria um novo produto (com cálculo automático do preço de venda)
  static async criar(nome, categoria_id, preco_compra, preco_venda, stock, loja_id) {
    try {
      // Verificar se a categoria existe e pertence à loja
      const [categorias] = await pool.query(
        `SELECT id FROM categorias WHERE id = ? AND loja_id = ?`,
        [categoria_id, loja_id]
      );

      if (categorias.length === 0) {
        throw new Error("Categoria não encontrada ou não pertence à loja.");
      }

      // Inserir o produto
      const [result] = await pool.query(
        `INSERT INTO produtos (nome, categoria_id, preco_compra, preco_venda, stock, loja_id)
       VALUES (?, ?, ?, ?, ?,?)`,
        [nome, categoria_id, preco_compra, preco_venda, stock, loja_id]
      );

      return result.insertId;
    } catch (err) {
      throw new Error(`Erro ao criar produto: ${err.message}`);
    }
  }


  // Remove um produto por ID
  static async deletar(id, loja_id) {
    try {
      const [result] = await pool.query('DELETE FROM produtos WHERE id = ? AND loja_id = ?', [id, loja_id]);

      if (result.affectedRows === 0) {
        throw new Error('Produto não encontrado.');
      }
    } catch (err) {
      throw new Error(`Erro ao deletar produto: ${err.message}`);
    }
  }


  // actualizar stock e preco de compra

  static async atualizarEstoqueEPreco(id, loja_id, novoStock, novoPrecoCompra) {

    console.log({
      novoStock,
      tipo1: typeof novoStock,
      novoPrecoCompra,
      tipo2: typeof novoPrecoCompra,
      id,
      tipo3: typeof id,
      loja_id,
      tipo4: typeof loja_id
    });




    try {
      const [result] = await pool.query(
        `UPDATE produtos 
       SET stock = ?, preco_compra = ?
       WHERE id = ? AND loja_id = ?`,
        [novoStock, novoPrecoCompra, id, loja_id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Produto não encontrado ou não pertence à loja.');
      }
    } catch (err) {
      throw new Error(`Erro ao atualizar produto: ${err.message}`);
    }
  }


  // Lista todos os produtos com nome da categoria
  static async listar(loja_id) {
    try {
      const [rows] = await pool.query(`
  SELECT p.*, c.nome AS categoria_nome 
  FROM produtos p
  JOIN categorias c ON p.categoria_id = c.id
  WHERE p.loja_id = ? AND c.loja_id = ?
`, [loja_id, loja_id]);

      return rows;
    } catch (err) {
      throw new Error(`Erro ao listar produtos: ${err.message}`);
    }
  }
}

module.exports = Produto; // Exportação padrão