const { SELECTORS } = require('../utils/constants');

/**
 * Page Object Model for the Checkout pages (Step 1 and Step 2)
 */
class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  // ── Step One ────────────────────────────────────────────────────────────

  async fillFirstName(value) {
    await this.page.fill(SELECTORS.firstNameInput, value);
  }

  async fillLastName(value) {
    await this.page.fill(SELECTORS.lastNameInput, value);
  }

  async fillZip(value) {
    await this.page.fill(SELECTORS.zipInput, value);
  }

  async fillInfo(firstName, lastName, zip) {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillZip(zip);
  }

  async clickContinue() {
    await this.page.click(SELECTORS.continueButton);
  }

  async clickCancel() {
    await this.page.click(SELECTORS.cancelButton);
  }

  async getErrorMessage() {
    return this.page.locator(SELECTORS.errorMessage).textContent();
  }

  async isErrorVisible() {
    return this.page.locator(SELECTORS.errorMessage).isVisible();
  }

  // ── Step Two (Overview) ─────────────────────────────────────────────────

  async getSubtotal() {
    const text = await this.page.locator(SELECTORS.subtotalLabel).textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTax() {
    const text = await this.page.locator(SELECTORS.taxLabel).textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTotal() {
    const text = await this.page.locator(SELECTORS.totalLabel).textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getOverviewItemCount() {
    return this.page.locator(SELECTORS.overviewItems).count();
  }

  async clickFinish() {
    await this.page.click(SELECTORS.finishButton);
  }

  // ── Confirmation ────────────────────────────────────────────────────────

  async getConfirmationHeader() {
    return this.page.locator(SELECTORS.confirmHeader).textContent();
  }

  async clickBackHome() {
    await this.page.click(SELECTORS.backHomeButton);
  }
}

module.exports = CheckoutPage;
