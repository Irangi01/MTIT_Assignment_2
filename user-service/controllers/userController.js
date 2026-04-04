/**
 * User Service - Controllers
 */

const getAllUsers = (User) => {
  return (req, res) => {
    User.find()
      .sort({ createdAt: -1 })
      .then((users) => res.status(200).json(users))
      .catch((error) => res.status(500).json({ message: 'Failed to fetch users.', error: error.message }));
  };
};

const createUser = (User) => {
  return (req, res) => {
    const { name, email } = req.body;
    User.create({ name, email })
      .then((newUser) => res.status(201).json(newUser))
      .catch((error) => res.status(500).json({ message: 'Failed to create user.', error: error.message }));
  };
};

const getUserById = (User) => {
  return (req, res) => {
    const { id } = req.params;
    User.findById(id)
      .then((user) => {
        if (!user) return res.status(404).json({ message: 'User not found.' });
        return res.status(200).json(user);
      })
      .catch((error) => res.status(500).json({ message: 'Failed to fetch user.', error: error.message }));
  };
};

const updateUser = (User) => {
  return (req, res) => {
    const { id } = req.params;
    User.findByIdAndUpdate(id, req.body, { new: true })
      .then((user) => {
        if (!user) return res.status(404).json({ message: 'User not found.' });
        return res.status(200).json(user);
      })
      .catch((error) => res.status(500).json({ message: 'Failed to update user.', error: error.message }));
  };
};

const deleteUser = (User) => {
  return (req, res) => {
    const { id } = req.params;
    User.findByIdAndDelete(id)
      .then((user) => {
        if (!user) return res.status(404).json({ message: 'User not found.' });
        return res.status(200).json({ message: 'User deleted successfully.' });
      })
      .catch((error) => res.status(500).json({ message: 'Failed to delete user.', error: error.message }));
  };
};

module.exports = { getAllUsers, createUser, getUserById, updateUser, deleteUser };
