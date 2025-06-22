const { message } = require('statuses');
const Produto = require('../models/Produto')

const produtoController = {
  async listar(req, res, next) {
    const loja_id = req.loja_id;
    
    try {
      const produtos = await Produto.listar(loja_id);
      res.json(produtos);
      // console.log(produtos)
    } catch (err) {
      next(err); // Passa para o middleware de erro
    }
  },

  async actualizar(req, res, next){
      const id = req.params.id

      const { novoStock, novoPrecoCompra } = req.body;
      const loja_id = req.loja_id;

     try {
      
      await Produto.atualizarEstoqueEPreco(id, loja_id, novoStock, novoPrecoCompra)
       res.status(201).json({ id, message:"actualizado com sucesso" });
    } catch (error) {
      
      next(error);
      console.error(error)
      throw error
      
     }


  },

  async criar(req, res, next) {
    const loja_id = req.loja_id;
    const { nome, categoria_id, preco_compra, preco_venda, stock } = req.body;
    try {
      const id = await Produto.criar(nome, categoria_id, preco_compra, preco_venda, stock, loja_id);
      res.status(201).json({ id });
    } catch (err) {
      next(err);
    }
  },


  async deletar(req, res, next) {
    const { id } = req.params;
    const loja_id = req.loja_id;

    try {
      await Produto.deletar(id,loja_id);
      res.status(204).send(); // Resposta sem conteúdo (sucesso)
    } catch (err) {
      if (err.message === 'Produto não encontrado.') {
        res.status(404).json({ error: err.message });
      } else {
        next(err); // Passa para o middleware de erro global
      }
    }
  }
};

module.exports = produtoController;