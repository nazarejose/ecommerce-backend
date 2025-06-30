const { Category } = require("../models");

class CategoryController {
  async search(req, res) {
    try {
      const { limit = 12, page = 1, fields, use_in_menu } = req.query;

      const queryOptions = {
        where: {},
      };

      if (use_in_menu) {
        queryOptions.where.use_in_menu = use_in_menu === "true";
      }

      if (fields) {
        queryOptions.attributes = fields.split(",");
      }

      const limitNumber = Number(limit);
      const pageNumber = Number(page);

      if (limitNumber > 0) {
        queryOptions.limit = limitNumber;

        queryOptions.offset = (pageNumber - 1) * limitNumber;
      }

      const { count, rows } = await Category.findAndCountAll(queryOptions);

      const response = {
        data: rows,
        total: count,
        limit: limitNumber > 0 ? limitNumber : -1,
        page: limitNumber > 0 ? pageNumber : 1,
      };

      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Falha ao buscar categorias." });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ error: "Categoria não encontrada." });
      }

      return res.status(200).json(category);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Falha ao buscar categoria." });
    }
  }

  async create(req, res) {
    try {
      const { name, slug, use_in_menu = false } = req.body;

      if (!name || !slug) {
        return res.status(400).json({ error: "Nome e slug são obrigatórios." });
      }

      const categoryExists = await Category.findOne({ where: { slug } });
      if (categoryExists) {
        return res.status(400).json({ error: "Este slug já está em uso." });
      }

      const newCategory = await Category.create({
        name,
        slug,
        use_in_menu,
      });

      return res.status(201).json(newCategory);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Falha ao criar categoria." });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, slug, use_in_menu } = req.body;

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ error: "Categoria não encontrada." });
      }

      if (slug && slug !== category.slug) {
        const slugExists = await Category.findOne({ where: { slug } });
        if (slugExists) {
          return res.status(400).json({ error: "Este slug já está em uso." });
        }
      }

      await category.update({ name, slug, use_in_menu });

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Falha ao atualizar categoria." });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ error: "Categoria não encontrada." });
      }

      await category.destroy();

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Falha ao deletar categoria." });
    }
  }
}

module.exports = new CategoryController();
