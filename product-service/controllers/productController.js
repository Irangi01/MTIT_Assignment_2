/**
 * Product Service - Controllers
 * Handles business logic for product endpoints
 */

const getAllProducts = (Product) => {
  return (req, res) => {
    Product.find()
      .sort({ createdAt: -1 })
      .then((products) => res.status(200).json(products))
      .catch((error) =>
        res.status(500).json({ message: 'Failed to fetch products.', error: error.message })
      );
  };
};

const createProduct = (Product) => {
  return (req, res) => {
    const { name, price } = req.body;

    Product.create({ name, price })
      .then((newProduct) => res.status(201).json(newProduct))
      .catch((error) =>
        res.status(500).json({ message: 'Failed to create product.', error: error.message })
      );
  };
};

const getProductById = (Product) => {
  return (req, res) => {
    const { id } = req.params;

    Product.findById(id)
      .then((product) => {
        if (!product) {
          return res.status(404).json({ message: 'Product not found.' });
        }
        return res.status(200).json(product);
      })
      .catch((error) =>
        res.status(500).json({ message: 'Failed to fetch product.', error: error.message })
      );
  };
};

const updateProduct = (Product) => {
  return (req, res) => {
    const { id } = req.params;

    Product.findByIdAndUpdate(id, req.body, { new: true })
      .then((product) => {
        if (!product) {
          return res.status(404).json({ message: 'Product not found.' });
        }
        return res.status(200).json(product);
      })
      .catch((error) =>
        res.status(500).json({ message: 'Failed to update product.', error: error.message })
      );
  };
};

const deleteProduct = (Product) => {
  return (req, res) => {
    const { id } = req.params;

    Product.findByIdAndDelete(id)
      .then((product) => {
        if (!product) {
          return res.status(404).json({ message: 'Product not found.' });
        }
        return res.status(200).json({ message: 'Product deleted successfully.' });
      })
      .catch((error) =>
        res.status(500).json({ message: 'Failed to delete product.', error: error.message })
      );
  };
};

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
};
