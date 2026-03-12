const { SELECTORS } = require('../utils/constants');

/**
 * Page Object Model for the Login page
 */
class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/');
  }

  async fillUsername(value) {
    await this.page.fill(SELECTORS.usernameInput, value);
  }

  async fillPassword(value) {
    await this.page.fill(SELECTORS.passwordInput, value);
  }

  async clickLogin() {
    await this.page.click(SELECTORS.loginButton);
  }

  /**
   * Full login action
   */
  async login(username, password) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage() {
    return this.page.locator(SELECTORS.errorMessage).textContent();
  }

  async isErrorVisible() {
    return this.page.locator(SELECTORS.errorMessage).isVisible();
  }

  async getCurrentUrl() {
    return this.page.url();
  }
}

module.exports = LoginPage;
