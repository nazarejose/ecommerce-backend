const { Op } = require("sequelize");
const { Product, Category, ProductImage, ProductOption } = require("../models");
const { sequelize } = require("../models");
const fs = require("fs");

class ProductController {
  async search(req, res) {
    try {
      const {
        limit = 12,
        page = 1,
        match,
        "price-range": priceRange,
        category_ids,
      } = req.query;

      const queryOptions = {
        where: {},
        include: [
          {
            model: ProductImage,
            as: "images",
            attributes: ["id", "path", "enabled"],
          },
          { model: ProductOption, as: "options" },
          {
            model: Category,
            as: "categories",
            attributes: ["id", "name"],
            through: { attributes: [] },
          },
        ],
      };

      const limitNumber = Number(limit);
      const pageNumber = Number(page);
      if (limitNumber > 0) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
      }

      if (match) {
        queryOptions.where[Op.or] = [
          { name: { [Op.like]: `%${match}%` } },
          { description: { [Op.like]: `%${match}%` } },
        ];
      }

      if (priceRange) {
        const [min, max] = priceRange.split("-");
        if (min && max) {
          queryOptions.where.price = {
            [Op.between]: [Number(min), Number(max)],
          };
        }
      }

      if (category_ids) {
        const ids = category_ids.split(",");
        queryOptions.include[2].where = { id: { [Op.in]: ids } };
        queryOptions.include[2].required = true;
      }

      const { count, rows } = await Product.findAndCountAll(queryOptions);

      const formattedData = rows.map((product) => {
        const plainProduct = product.get({ plain: true });
        return {
          ...plainProduct,
          category_ids: plainProduct.categories.map((cat) => cat.id),
        };
      });

      const response = {
        data: formattedData,
        total: count,
        limit: limitNumber > 0 ? limitNumber : -1,
        page: limitNumber > 0 ? pageNumber : 1,
      };

      return res.status(200).json(response);
    } catch (error) {
      console.error("ERRO DETALHADO:", error);
      return res.status(500).json({ error: "Falha ao buscar produtos." });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id, {
        include: [
          { model: ProductImage, as: "images" },
          { model: ProductOption, as: "options" },
          {
            model: Category,
            as: "categories",
            through: { attributes: [] },
          },
        ],
      });

      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado." });
      }

      const plainProduct = product.get({ plain: true });
      const response = {
        ...plainProduct,
        category_ids: plainProduct.categories.map((cat) => cat.id),
      };

      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Falha ao buscar produto." });
    }
  }

  async create(req, res) {
    const t = await sequelize.transaction();

    try {
      const {
        name,
        slug,
        stock,
        description,
        price,
        price_with_discount,
        enabled = false,
        use_in_menu = false,
        category_ids,
        images,
        options,
      } = req.body;

      const newProduct = await Product.create(
        {
          name,
          slug,
          stock,
          description,
          price,
          price_with_discount,
          enabled,
          use_in_menu,
        },
        { transaction: t }
      );

      if (category_ids && category_ids.length > 0) {
        await newProduct.setCategories(category_ids, { transaction: t });
      }

      if (images && images.length > 0) {
        if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

        for (const image of images) {
          const base64Data = image.content.replace(
            /^data:image\/\w+;base64,/,
            ""
          );
          const buffer = Buffer.from(base64Data, "base64");
          const imageName = `${Date.now()}-${newProduct.slug}.png`;
          const imagePath = `uploads/${imageName}`;

          fs.writeFileSync(imagePath, buffer);

          await ProductImage.create(
            {
              product_id: newProduct.id,
              path: imagePath,
              enabled: true,
            },
            { transaction: t }
          );
        }
      }

      if (options && options.length > 0) {
        for (const option of options) {
          await ProductOption.create(
            {
              product_id: newProduct.id,
              title: option.title,
              shape: option.shape,
              type: option.type,
              values: option.values.join(","),
            },
            { transaction: t }
          );
        }
      }

      await t.commit();

      const finalProduct = await Product.findByPk(newProduct.id, {
        include: ["images", "options", "categories"],
      });

      return res.status(201).json(finalProduct);
    } catch (error) {
      await t.rollback();
      console.error(error);
      return res.status(500).json({ error: "Falha ao criar produto." });
    }
  }

  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const {
        name,
        slug,
        stock,
        description,
        price,
        price_with_discount,
        enabled,
        use_in_menu,
        category_ids,
        images,
        options,
      } = req.body;

      const product = await Product.findByPk(id);
      if (!product) {
        await t.rollback();
        return res.status(404).json({ error: "Produto não encontrado." });
      }

      await product.update(
        {
          name,
          slug,
          stock,
          description,
          price,
          price_with_discount,
          enabled,
          use_in_menu,
        },
        { transaction: t }
      );

      if (category_ids) {
        await product.setCategories(category_ids, { transaction: t });
      }

      if (images) {
        await ProductImage.destroy(
          { where: { product_id: id } },
          { transaction: t }
        );

        for (const image of images) {
          const base64Data = image.content.replace(
            /^data:image\/\w+;base64,/,
            ""
          );
          const buffer = Buffer.from(base64Data, "base64");
          const imageName = `${Date.now()}-${product.slug}.png`;
          const imagePath = `uploads/${imageName}`;
          fs.writeFileSync(imagePath, buffer);

          await ProductImage.create(
            {
              product_id: product.id,
              path: imagePath,
              enabled: true,
            },
            { transaction: t }
          );
        }
      }

      if (options) {
        await ProductOption.destroy(
          { where: { product_id: id } },
          { transaction: t }
        );

        for (const option of options) {
          await ProductOption.create(
            {
              product_id: product.id,
              title: option.title,
              shape: option.shape,
              type: option.type,
              values: option.values.join(","),
            },
            { transaction: t }
          );
        }
      }

      await t.commit();

      return res.status(204).send();
    } catch (error) {
      await t.rollback();
      console.error(error);
      return res.status(500).json({ error: "Falha ao atualizar produto." });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado." });
      }

      await product.destroy();

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Falha ao deletar produto." });
    }
  }
}

module.exports = new ProductController();
