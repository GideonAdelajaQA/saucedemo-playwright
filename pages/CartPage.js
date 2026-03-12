const { SELECTORS } = require('../utils/constants');

/**
 * Page Object Model for the Shopping Cart page
 */
class CartPage {
  constructor(page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/cart.html');
  }

  async getItemCount() {
    return this.page.locator(SELECTORS.cartItem).count();
  }

  async getItemNames() {
    const names = await this.page.locator(SELECTORS.cartItemName).allTextContents();
    return names;
  }

  async getItemPrices() {
    const prices = await this.page.locator(SELECTORS.cartItemPrice).allTextContents();
    return prices.map(p => parseFloat(p.replace('$', '')));
  }

  async removeItem(productSlug) {
    await this.page.click(SELECTORS.removeBtnFn(productSlug));
  }

  async clickCheckout() {
    await this.page.click(SELECTORS.checkoutButton);
  }

  async clickContinueShopping() {
    await this.page.click(SELECTORS.continueShoppingBtn);
  }

  async isItemInCart(productName) {
    const items = await this.getItemNames();
    return items.includes(productName);
  }

  async isCartEmpty() {
    const count = await this.getItemCount();
    return count === 0;
  }
}

module.exports = CartPage;
