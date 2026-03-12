const { SELECTORS } = require('../utils/constants');

/**
 * Page Object Model for the Inventory (Products) page
 */
class InventoryPage {
  constructor(page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/inventory.html');
  }

  async addToCart(productSlug) {
    await this.page.click(SELECTORS.addToCartBtnFn(productSlug));
  }

  async removeFromCart(productSlug) {
    await this.page.click(SELECTORS.removeBtnFn(productSlug));
  }

  async getCartBadgeCount() {
    const badge = this.page.locator(SELECTORS.cartBadge);
    const visible = await badge.isVisible();
    if (!visible) return 0;
    const text = await badge.textContent();
    return parseInt(text, 10);
  }

  async isCartBadgeVisible() {
    return this.page.locator(SELECTORS.cartBadge).isVisible();
  }

  async goToCart() {
    await this.page.click(SELECTORS.cartIcon);
  }

  async getProductCount() {
    return this.page.locator(SELECTORS.inventoryItems).count();
  }

  async sortBy(value) {
    // az | za | lohi | hilo
    await this.page.selectOption(SELECTORS.sortDropdown, value);
  }

  async getAddToCartButtonText(productSlug) {
    const btn = this.page.locator(SELECTORS.addToCartBtnFn(productSlug));
    if (await btn.isVisible()) return btn.textContent();
    // If "add" btn not visible, check "remove" btn
    const removeBtn = this.page.locator(SELECTORS.removeBtnFn(productSlug));
    if (await removeBtn.isVisible()) return 'Remove';
    return null;
  }

  async clickProductName(name) {
    await this.page.locator(`.inventory_item_name`, { hasText: name }).click();
  }

  async logout() {
    await this.page.click(SELECTORS.burgerMenu);
    await this.page.click(SELECTORS.logoutLink);
  }

  async getAllProductPrices() {
    const priceEls = this.page.locator('.inventory_item_price');
    const texts = await priceEls.allTextContents();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }
}

module.exports = InventoryPage;
