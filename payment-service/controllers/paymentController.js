/**
 * Payment Service - Controllers
 */

const getAllPayments = (Payment) => {
  return (req, res) => {
    Payment.find()
      .sort({ createdAt: -1 })
      .then((payments) => res.status(200).json(payments))
      .catch((error) => res.status(500).json({ message: 'Failed to fetch payments.', error: error.message }));
  };
};

const createPayment = (Payment) => {
  return (req, res) => {
    const { orderId, amount, method } = req.body;
    Payment.create({ orderId, amount, method, status: 'PENDING' })
      .then((newPayment) => res.status(201).json(newPayment))
      .catch((error) => res.status(500).json({ message: 'Failed to create payment.', error: error.message }));
  };
};

const getPaymentById = (Payment) => {
  return (req, res) => {
    const { id } = req.params;
    Payment.findById(id)
      .then((payment) => {
        if (!payment) return res.status(404).json({ message: 'Payment not found.' });
        return res.status(200).json(payment);
      })
      .catch((error) => res.status(500).json({ message: 'Failed to fetch payment.', error: error.message }));
  };
};

const updatePayment = (Payment) => {
  return (req, res) => {
    const { id } = req.params;
    Payment.findByIdAndUpdate(id, req.body, { new: true })
      .then((payment) => {
        if (!payment) return res.status(404).json({ message: 'Payment not found.' });
        return res.status(200).json(payment);
      })
      .catch((error) => res.status(500).json({ message: 'Failed to update payment.', error: error.message }));
  };
};

const deletePayment = (Payment) => {
  return (req, res) => {
    const { id } = req.params;
    Payment.findByIdAndDelete(id)
      .then((payment) => {
        if (!payment) return res.status(404).json({ message: 'Payment not found.' });
        return res.status(200).json({ message: 'Payment deleted successfully.' });
      })
      .catch((error) => res.status(500).json({ message: 'Failed to delete payment.', error: error.message }));
  };
};

module.exports = { getAllPayments, createPayment, getPaymentById, updatePayment, deletePayment };
