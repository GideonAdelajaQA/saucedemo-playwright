// @ts-check
const { test, expect } = require('@playwright/test');
const LoginPage   = require('../pages/LoginPage');
const { USERS, ERRORS } = require('../utils/constants');

/**
 * ══════════════════════════════════════════════════════════════
 *  LOGIN TEST SUITE – SauceDemo
 *  Valid & Invalid scenarios for standard_user and locked_out_user
 * ══════════════════════════════════════════════════════════════
 */

test.describe('Login – Valid Scenarios', () => {

  test('TC-L01 | standard_user can log in successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('TC-L12 | performance_glitch_user logs in (with delay)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(USERS.performance.username, USERS.performance.password);
    // Allow extra time for slow user
    await expect(page).toHaveURL(/inventory\.html/, { timeout: 15000 });
  });

  test('TC-L13 | error_user logs in (errors appear later on actions)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(USERS.error.username, USERS.error.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-L14 | standard_user can log out', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);

    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await expect(page).toHaveURL('/');
    await expect(page.locator('#login-button')).toBeVisible();
  });

  test('TC-L15 | browser back after logout does not re-enter app', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(USERS.standard.username, USERS.standard.password);

    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');

    await page.goBack();
    // Should NOT be on inventory — either redirected to login or stays on login
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('TC-L16 | direct URL access without login redirects to login', async ({ page }) => {
    await page.goto('/inventory.html');
    await expect(page).toHaveURL('/');
    await expect(page.locator('#login-button')).toBeVisible();
  });

});

test.describe('Login – Locked-Out User', () => {

  test('TC-L02 | locked_out_user is blocked with correct error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(USERS.locked.username, USERS.locked.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('locked out');
    await expect(page).not.toHaveURL(/inventory/);
  });

  test('TC-L02b | locked_out_user error is visible and styled', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(USERS.locked.username, USERS.locked.password);

    const errorEl = page.locator('[data-test="error"]');
    await expect(errorEl).toBeVisible();
    // Error should contain the correct copy
    await expect(errorEl).toContainText('locked out');
  });

});

test.describe('Login – Invalid Credentials (Negative Scenarios)', () => {

  test('TC-L03 | empty username shows validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('', USERS.standard.password);

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username is required');
  });

  test('TC-L04 | empty password shows validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(USERS.standard.username, '');

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Password is required');
  });

  test('TC-L05 | both fields empty shows username required error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('', '');

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username is required');
  });

  test('TC-L06 | wrong password shows credentials mismatch error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(USERS.standard.username, 'wrongpassword123');

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('do not match');
  });

  test('TC-L07 | invalid username shows credentials mismatch error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('nonexistent_user', USERS.standard.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('do not match');
  });

  test('TC-L10 | username is case-sensitive – mixed case rejected', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('Standard_User', USERS.standard.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('do not match');
  });

  test('TC-L11 | username with surrounding whitespace is rejected', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('  standard_user  ', USERS.standard.password);

    // App should NOT log in with padded spaces
    await expect(page).not.toHaveURL(/inventory/);
  });

  test('TC-L17 | very long username is handled gracefully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    const longUsername = 'a'.repeat(256);
    await loginPage.login(longUsername, USERS.standard.password);

    // Should not crash the app; error or no-match expected
    await expect(page).not.toHaveURL(/inventory/);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-L18 | special characters in password are handled safely', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(USERS.standard.username, '!@#$%^&*()<>');

    await expect(page).not.toHaveURL(/inventory/);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('do not match');
  });

  test('TC-L08 | SQL injection in username is blocked', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login("' OR 1=1--", USERS.standard.password);

    await expect(page).not.toHaveURL(/inventory/);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-L09 | XSS payload in username is not executed', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    let alertFired = false;
    page.on('dialog', async (dialog) => {
      alertFired = true;
      await dialog.dismiss();
    });

    await loginPage.login('<script>alert(1)</script>', USERS.standard.password);

    await expect(page).not.toHaveURL(/inventory/);
    expect(alertFired).toBe(false);
  });

  test('TC-L19 | NEGATIVE – wrong username AND wrong password both rejected', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('admin', 'admin');

    await expect(page).not.toHaveURL(/inventory/);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('do not match');
  });

  test('TC-L20 | NEGATIVE – password only (no username) is rejected', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.fillPassword(USERS.standard.password);
    await loginPage.clickLogin();

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username is required');
  });

  test('TC-L21 | NEGATIVE – numeric username and password rejected', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('123456', '654321');

    await expect(page).not.toHaveURL(/inventory/);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-L22 | NEGATIVE – emoji characters in credentials rejected gracefully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('😊😊😊', '🔑🔑🔑');

    await expect(page).not.toHaveURL(/inventory/);
  });

});
