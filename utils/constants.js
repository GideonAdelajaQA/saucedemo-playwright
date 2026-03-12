/**
 * Test constants for SauceDemo
 */

const BASE_URL = 'https://www.saucedemo.com';

const USERS = {
  standard:     { username: 'standard_user',         password: 'secret_sauce' },
  locked:       { username: 'locked_out_user',        password: 'secret_sauce' },
  problem:      { username: 'problem_user',           password: 'secret_sauce' },
  performance:  { username: 'performance_glitch_user',password: 'secret_sauce' },
  error:        { username: 'error_user',             password: 'secret_sauce' },
  visual:       { username: 'visual_user',            password: 'secret_sauce' },
};

const SELECTORS = {
  // Login
  usernameInput:    '#user-name',
  passwordInput:    '#password',
  loginButton:      '#login-button',
  errorMessage:     '[data-test="error"]',

  // Inventory
  inventoryList:    '.inventory_list',
  inventoryItems:   '.inventory_item',
  addToCartBtnFn:   (name) => `[data-test="add-to-cart-${name}"]`,
  removeBtnFn:      (name) => `[data-test="remove-${name}"]`,
  sortDropdown:     '.product_sort_container',

  // Cart
  cartIcon:         '.shopping_cart_link',
  cartBadge:        '.shopping_cart_badge',
  cartList:         '.cart_list',
  cartItem:         '.cart_item',
  cartItemName:     '.inventory_item_name',
  cartItemPrice:    '.inventory_item_price',
  checkoutButton:   '[data-test="checkout"]',
  continueShoppingBtn: '[data-test="continue-shopping"]',

  // Checkout Step 1
  firstNameInput:   '[data-test="firstName"]',
  lastNameInput:    '[data-test="lastName"]',
  zipInput:         '[data-test="postalCode"]',
  continueButton:   '[data-test="continue"]',
  cancelButton:     '[data-test="cancel"]',

  // Checkout Step 2 (Overview)
  overviewItems:    '.cart_item',
  subtotalLabel:    '.summary_subtotal_label',
  taxLabel:         '.summary_tax_label',
  totalLabel:       '.summary_total_label',
  finishButton:     '[data-test="finish"]',

  // Confirmation
  confirmHeader:    '.complete-header',
  confirmText:      '.complete-text',
  backHomeButton:   '[data-test="back-to-products"]',

  // Burger menu
  burgerMenu:       '#react-burger-menu-btn',
  logoutLink:       '#logout_sidebar_link',
};

const PRODUCTS = {
  backpack:     { slug: 'sauce-labs-backpack',        name: 'Sauce Labs Backpack',       price: 29.99 },
  bikeLight:    { slug: 'sauce-labs-bike-light',       name: 'Sauce Labs Bike Light',     price: 9.99  },
  boltTshirt:   { slug: 'sauce-labs-bolt-t-shirt',    name: 'Sauce Labs Bolt T-Shirt',   price: 15.99 },
  fleeceJacket: { slug: 'sauce-labs-fleece-jacket',   name: 'Sauce Labs Fleece Jacket',  price: 49.99 },
  onesie:       { slug: 'sauce-labs-onesie',          name: 'Sauce Labs Onesie',         price: 7.99  },
  redShirt:     { slug: 'test.allthethings()-t-shirt-(red)', name: 'Test.allTheThings() T-Shirt (Red)', price: 15.99 },
};

const CHECKOUT_INFO = {
  valid: { firstName: 'John', lastName: 'Doe', zip: '10001' },
};

const ERRORS = {
  lockedOut:       'Epic sadface: Sorry, this user has been locked out.',
  usernameMissing: 'Epic sadface: Username is required',
  passwordMissing: 'Epic sadface: Password is required',
  noMatch:         'Epic sadface: Username and password do not match any user in this service',
  firstNameReq:    'Error: First Name is required',
  lastNameReq:     'Error: Last Name is required',
  postalCodeReq:   'Error: Postal Code is required',
};

module.exports = { BASE_URL, USERS, SELECTORS, PRODUCTS, CHECKOUT_INFO, ERRORS };
