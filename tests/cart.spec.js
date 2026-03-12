// @ts-check
const { test, expect } = require('@playwright/test');
const LoginPage     = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');
const CartPage      = require('../pages/CartPage');
const { USERS, PRODUCTS } = require('../utils/constants');

/**
 * ══════════════════════════════════════════════════════════════
 *  CART TEST SUITE – SauceDemo
 *  Covers: Adding to cart, removing from cart (valid & negative)
 * ══════════════════════════════════════════════════════════════
 */

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(USERS.standard.username, USERS.standard.password);
  await expect(page).toHaveURL(/inventory\.html/);
});

// ─────────────────────────────────────────────────────────────
//  ADDING TO CART
// ─────────────────────────────────────────────────────────────

test.describe('Add to Cart – Valid Scenarios', () => {

  test('TC-C01 | add single product – badge shows 1', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.backpack.slug);

    const count = await inv.getCartBadgeCount();
    expect(count).toBe(1);
  });

  test('TC-C02 | add two different products – badge shows 2', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.backpack.slug);
    await inv.addToCart(PRODUCTS.bikeLight.slug);

    const count = await inv.getCartBadgeCount();
    expect(count).toBe(2);
  });

  test('TC-C03 | add all 6 products – badge shows 6', async ({ page }) => {
    const inv = new InventoryPage(page);
    for (const product of Object.values(PRODUCTS)) {
      await inv.addToCart(product.slug);
    }
    const count = await inv.getCartBadgeCount();
    expect(count).toBe(6);
  });

  test('TC-C04 | add from product detail page', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.clickProductName(PRODUCTS.backpack.name);
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-C05 | cart badge persists after page navigation', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.onesie.slug);

    // Navigate away via burger menu -> About, then back
    await page.click('#react-burger-menu-btn');
    await page.click('#about_sidebar_link');
    await page.goBack();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-C06 | cart badge persists after page refresh', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.boltTshirt.slug);
    await page.reload();

    const count = await inv.getCartBadgeCount();
    expect(count).toBe(1);
  });

  test('TC-C07 | cart page shows correct product name and price', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.boltTshirt.slug);
    await inv.goToCart();

    const cart = new CartPage(page);
    const names = await cart.getItemNames();
    expect(names).toContain(PRODUCTS.boltTshirt.name);

    const prices = await cart.getItemPrices();
    expect(prices).toContain(PRODUCTS.boltTshirt.price);
  });

  test('TC-C08 | add most expensive item (Fleece Jacket $49.99)', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.fleeceJacket.slug);
    expect(await inv.getCartBadgeCount()).toBe(1);
  });

  test('TC-C09 | add least expensive item (Onesie $7.99)', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.onesie.slug);
    expect(await inv.getCartBadgeCount()).toBe(1);
  });

  test('TC-C10 | add item while sorted A-Z', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.sortBy('az');
    await inv.addToCart(PRODUCTS.backpack.slug); // Backpack first alphabetically
    expect(await inv.getCartBadgeCount()).toBe(1);
  });

  test('TC-C11 | add item while sorted price low-to-high', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.sortBy('lohi');
    await inv.addToCart(PRODUCTS.onesie.slug); // Onesie is cheapest
    expect(await inv.getCartBadgeCount()).toBe(1);
  });

  test('TC-C12 | button changes from "Add to cart" to "Remove" after adding', async ({ page }) => {
    const inv = new InventoryPage(page);
    // Before adding
    const addBtn = page.locator(`[data-test="add-to-cart-${PRODUCTS.backpack.slug}"]`);
    await expect(addBtn).toBeVisible();

    await inv.addToCart(PRODUCTS.backpack.slug);

    // After adding – remove button should appear
    const removeBtn = page.locator(`[data-test="remove-${PRODUCTS.backpack.slug}"]`);
    await expect(removeBtn).toBeVisible();
    await expect(addBtn).not.toBeVisible();
  });

  test('TC-C13 | cart item count in cart page matches added count', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.backpack.slug);
    await inv.addToCart(PRODUCTS.bikeLight.slug);
    await inv.addToCart(PRODUCTS.boltTshirt.slug);
    await inv.goToCart();

    const cart = new CartPage(page);
    const count = await cart.getItemCount();
    expect(count).toBe(3);
  });

});

test.describe('Add to Cart – Negative Scenarios', () => {

  test('TC-CN01 | NEGATIVE – no badge visible before any item added', async ({ page }) => {
    const inv = new InventoryPage(page);
    const visible = await inv.isCartBadgeVisible();
    expect(visible).toBe(false);
  });

  test('TC-CN02 | NEGATIVE – cannot add same item twice (button disappears)', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.backpack.slug);

    // Add button should no longer exist for this item
    const addBtn = page.locator(`[data-test="add-to-cart-${PRODUCTS.backpack.slug}"]`);
    await expect(addBtn).not.toBeVisible();
    // Count should still be 1, not 2
    expect(await inv.getCartBadgeCount()).toBe(1);
  });

  test('TC-CN03 | NEGATIVE – cart page shows empty when nothing added', async ({ page }) => {
    await page.goto('/cart.html');
    const cart = new CartPage(page);
    const count = await cart.getItemCount();
    expect(count).toBe(0);
  });

});

// ─────────────────────────────────────────────────────────────
//  REMOVING FROM CART
// ─────────────────────────────────────────────────────────────

test.describe('Remove from Cart – Valid Scenarios', () => {

  test('TC-R01 | remove item from product listing – badge decrements', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.backpack.slug);
    expect(await inv.getCartBadgeCount()).toBe(1);

    await inv.removeFromCart(PRODUCTS.backpack.slug);
    expect(await inv.isCartBadgeVisible()).toBe(false);
  });

  test('TC-R02 | remove item from cart page', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.backpack.slug);
    await inv.goToCart();

    const cart = new CartPage(page);
    await cart.removeItem(PRODUCTS.backpack.slug);
    expect(await cart.isCartEmpty()).toBe(true);
  });

  test('TC-R03 | remove item from product detail page', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.bikeLight.slug);
    await inv.clickProductName(PRODUCTS.bikeLight.name);

    const removeBtn = page.locator(`[data-test="remove-${PRODUCTS.bikeLight.slug}"]`);
    await expect(removeBtn).toBeVisible();
    await removeBtn.click();

    await expect(page.locator(`[data-test="add-to-cart-${PRODUCTS.bikeLight.slug}"]`)).toBeVisible();
  });

  test('TC-R04 | remove all items – cart becomes empty', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.backpack.slug);
    await inv.addToCart(PRODUCTS.bikeLight.slug);
    await inv.addToCart(PRODUCTS.onesie.slug);
    await inv.goToCart();

    const cart = new CartPage(page);
    await cart.removeItem(PRODUCTS.backpack.slug);
    await cart.removeItem(PRODUCTS.bikeLight.slug);
    await cart.removeItem(PRODUCTS.onesie.slug);
    expect(await cart.isCartEmpty()).toBe(true);
  });

  test('TC-R05 | cart badge disappears when last item removed', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.boltTshirt.slug);
    await inv.removeFromCart(PRODUCTS.boltTshirt.slug);

    expect(await inv.isCartBadgeVisible()).toBe(false);
  });

  test('TC-R06 | remove one of multiple items – others remain', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.backpack.slug);
    await inv.addToCart(PRODUCTS.bikeLight.slug);
    await inv.addToCart(PRODUCTS.boltTshirt.slug);

    await inv.goToCart();
    const cart = new CartPage(page);
    await cart.removeItem(PRODUCTS.boltTshirt.slug);

    const remaining = await cart.getItemCount();
    expect(remaining).toBe(2);
    const names = await cart.getItemNames();
    expect(names).not.toContain(PRODUCTS.boltTshirt.name);
  });

  test('TC-R07 | continue shopping after remove returns to products', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.backpack.slug);
    await inv.goToCart();

    const cart = new CartPage(page);
    await cart.removeItem(PRODUCTS.backpack.slug);
    await cart.clickContinueShopping();

    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-R08 | re-add previously removed item', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.backpack.slug);
    await inv.removeFromCart(PRODUCTS.backpack.slug);
    // Re-add
    await inv.addToCart(PRODUCTS.backpack.slug);
    expect(await inv.getCartBadgeCount()).toBe(1);
  });

  test('TC-R09 | removed item price not included in checkout', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.fleeceJacket.slug); // $49.99
    await inv.addToCart(PRODUCTS.bikeLight.slug);    // $9.99
    await inv.removeFromCart(PRODUCTS.fleeceJacket.slug);
    await inv.goToCart();

    const cart = new CartPage(page);
    await cart.clickCheckout();

    const { CheckoutPage } = require('../pages/CheckoutPage');
    // just navigate to step 2 and check subtotal
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '10001');
    await page.click('[data-test="continue"]');

    const subtotalText = await page.locator('.summary_subtotal_label').textContent();
    const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
    // Should be bikeLight price only
    expect(subtotal).toBeCloseTo(PRODUCTS.bikeLight.price, 1);
  });

  test('TC-R10 | remove item – persists after page refresh', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.boltTshirt.slug);
    await inv.removeFromCart(PRODUCTS.boltTshirt.slug);
    await page.reload();

    expect(await inv.isCartBadgeVisible()).toBe(false);
  });

  test('TC-R11 | add-to-cart button is restored after removal', async ({ page }) => {
    const inv = new InventoryPage(page);
    await inv.addToCart(PRODUCTS.onesie.slug);
    await inv.removeFromCart(PRODUCTS.onesie.slug);

    const addBtn = page.locator(`[data-test="add-to-cart-${PRODUCTS.onesie.slug}"]`);
    await expect(addBtn).toBeVisible();
  });

});

test.describe('Remove from Cart – Negative Scenarios', () => {

  test('TC-RN01 | NEGATIVE – remove button not visible before adding', async ({ page }) => {
    const removeBtn = page.locator(`[data-test="remove-${PRODUCTS.backpack.slug}"]`);
    await expect(removeBtn).not.toBeVisible();
  });

  test('TC-RN02 | NEGATIVE – cart stays empty after attempting checkout with 0 items', async ({ page }) => {
    await page.goto('/cart.html');
    const cart = new CartPage(page);
    expect(await cart.isCartEmpty()).toBe(true);
    await cart.clickCheckout();
    // Should still allow checkout flow (SauceDemo doesn't block empty cart)
    await expect(page).toHaveURL(/checkout-step-one/);
  });

});
