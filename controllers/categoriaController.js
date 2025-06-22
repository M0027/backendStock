const Categoria = require('../models/Categoria');

const categoriaController = {
  async listar(req, res) {
   const loja_id = req.loja_id;
    const categorias = await Categoria.listar(loja_id);
    res.json(categorias);
  },

  async criar(req, res) {
    const { nome } = req.body;
    const loja_id = req.loja_id;
    if (!nome) return res.status(400).json({ error: "Nome obrigatório" });
    const id = await Categoria.criar(nome,loja_id);
    res.status(201).json({ id, nome });
  },

  async deletar(req, res) {
    const { id } = req.params;
    const loja_id = req.loja_id;
    await Categoria.deletar(id,loja_id);
    res.status(201).json({ message: "Categoria removida com sucesso" });
  }
};

module.exports = categoriaController;
