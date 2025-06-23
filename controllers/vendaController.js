const { message } = require('statuses');
const Venda = require('../models/Venda');

const criarVenda = async (req, res) => {
  try {
    const loja_id = req.loja_id;
    const { produto_id, quantidade, preco_unitario, data_venda } = req.body;
    const novaVenda = await Venda.criar(produto_id, quantidade, preco_unitario, data_venda, loja_id);
    res.status(201).json({ message: 'Venda criada com sucesso', venda: novaVenda });
  } catch (error) {
    res.status(400).json({ error: error.message });
    // res.status(409).json({ message:'Stock insuficiente' });
  }
};



const deletarVenda = async (req, res) => {
  const { id } = req.params;
  const loja_id = req.loja_id;

  // console.log(id)

  try {
    const venda = await Venda.buscarPorId(id);

    if (!venda) {
      return res.status(404).json({ error: 'Venda não encontrada' });

    }

    if (venda.loja_id !== loja_id) {
      return res.status(403).json({ error: 'Você não tem permissão para excluir esta venda' });
    }

    await Venda.deletar(id);

    res.status(200).json({ message: 'Venda excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir venda' });
    console.error(error)
  }
};


const listarVendas = async (req, res) => {
  const loja_id = req.loja_id;
  try {
    const vendas = await Venda.listar(loja_id);
    res.status(200).json(vendas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar vendas' });
  }
};

module.exports = {
  criarVenda,
  listarVendas,
  deletarVenda 
};
