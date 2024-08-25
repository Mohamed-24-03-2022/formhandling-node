const usersStorage = require('../storages/usersStorage');

const { body, validationResult } = require('express-validator');

const alphaErr = 'must only contain letters.';
const lengthErr = 'must be between 1 and 10 characters.';

// middlewares for validation
const validateUser = [
  body('firstName')
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),

  body('lastName')
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),

  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),

];

const usersListGet = (req, res, next) => {
  res.render('index', {
    title: 'User list',
    users: usersStorage.getUsers(),
  });
};

const usersCreateGet = (req, res) => {
  res.render('createUser', {
    title: 'Create user',
  });
};

const usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('createUser', {
        title: 'Create User',
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email } = req.body;
    usersStorage.addUser({ firstName, lastName, email });
    res.redirect('/');
  },
];

const usersUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id);

  res.render('updateUser', { title: 'Update user', user: user });
};

const usersUpdatePost = [
  validateUser,
  (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render('updateUser', {
        title: 'Update User',
        user,
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email } = req.body;
    usersStorage.updateUser(req.params.id, { firstName, lastName, email });
    res.redirect('/');
  },
];


const usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);

  res.redirect("/");
}

const searchUserByName = (req, res) => {
  const searchedName = req.query.searchName.toLowerCase();

  const allUsers = usersStorage.getUsers();

  const searchRes = allUsers.filter(user => user.firstName.toLowerCase().includes(searchedName));


  res.render('search', { title: 'Search Result', result: searchRes });
}

module.exports = { usersListGet, usersCreateGet, usersCreatePost, usersUpdateGet, usersUpdatePost, usersDeletePost, searchUserByName };
