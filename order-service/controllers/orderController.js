/**
 * Order Service - Controllers
 */

const getAllOrders = (Order) => {
  return (req, res) => {
    Order.find()
      .sort({ createdAt: -1 })
      .then((orders) => res.status(200).json(orders))
      .catch((error) => res.status(500).json({ message: 'Failed to fetch orders.', error: error.message }));
  };
};

const createOrder = (Order) => {
  return (req, res) => {
    const { customerName, totalAmount, status } = req.body;
    Order.create({ customerName, totalAmount, status: status || 'PENDING' })
      .then((newOrder) => res.status(201).json(newOrder))
      .catch((error) => res.status(500).json({ message: 'Failed to create order.', error: error.message }));
  };
};

const getOrderById = (Order) => {
  return (req, res) => {
    const { id } = req.params;
    Order.findById(id)
      .then((order) => {
        if (!order) return res.status(404).json({ message: 'Order not found.' });
        return res.status(200).json(order);
      })
      .catch((error) => res.status(500).json({ message: 'Failed to fetch order.', error: error.message }));
  };
};

const updateOrder = (Order) => {
  return (req, res) => {
    const { id } = req.params;
    Order.findByIdAndUpdate(id, req.body, { new: true })
      .then((order) => {
        if (!order) return res.status(404).json({ message: 'Order not found.' });
        return res.status(200).json(order);
      })
      .catch((error) => res.status(500).json({ message: 'Failed to update order.', error: error.message }));
  };
};

const deleteOrder = (Order) => {
  return (req, res) => {
    const { id } = req.params;
    Order.findByIdAndDelete(id)
      .then((order) => {
        if (!order) return res.status(404).json({ message: 'Order not found.' });
        return res.status(200).json({ message: 'Order deleted successfully.' });
      })
      .catch((error) => res.status(500).json({ message: 'Failed to delete order.', error: error.message }));
  };
};

module.exports = { getAllOrders, createOrder, getOrderById, updateOrder, deleteOrder };
