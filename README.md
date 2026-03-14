# SauceDemo – Playwright E2E Test Suite

> **QA Automation Assessment | Gideon Adelaja**  
> Application Under Test: [https://www.saucedemo.com](https://www.saucedemo.com)  
> Tool: [Playwright](https://playwright.dev) (JavaScript / Node.js)

Playwright results link (includes screenshots and videos) : http://localhost:9323/
## Structure

```
saucedemo-playwright/
├── pages/
│   ├── LoginPage.js        # POM: Login page actions
│   ├── InventoryPage.js    # POM: Product listing actions
│   ├── CartPage.js         # POM: Cart page actions
│   └── CheckoutPage.js     # POM: Checkout step 1 & 2 actions
├── tests/
│   ├── login.spec.js       # 22 login scenarios (valid + negative)
│   ├── cart.spec.js        # 24 add/remove cart scenarios (valid + negative)
│   └── checkout.spec.js    # 27 checkout scenarios (valid + negative)
├── utils/
│   └── constants.js        # Credentials, selectors, product data, expected errors
├── playwright.config.js    # Playwright configuration (Chromium + Firefox)
└── package.json
```

---

##  Getting Started

### Prerequisites
- Node.js v18+
- npm v8+

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/saucedemo-playwright.git
cd saucedemo-playwright

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install
```

---

## Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (headless) |
| `npm run test:headed` | Run all tests with browser visible |
| `npm run test:login` | Login tests only |
| `npm run test:cart` | Cart (add/remove) tests only |
| `npm run test:checkout` | Checkout tests only |
| `npm run test:report` | Open HTML report |

### Run with specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
```

### Run a single test by title
```bash
npx playwright test -g "complete valid checkout"
```

---

## Test Coverage Summary

### `login.spec.js` – 22 Tests
| Category | Count |
|----------|-------|
| Valid login (standard_user, performance, error) | 5 |
| Locked-out user | 2 |
| Empty field validation | 3 |
| Wrong / invalid credentials | 3 |
| Security (SQL injection, XSS) | 2 |
| Edge cases (case sensitivity, whitespace, long input, emoji) | 5 |
| Session / navigation | 2 |

### `cart.spec.js` – 24 Tests
| Category | Count |
|----------|-------|
| Add single / multiple / all items | 3 |
| Add from product detail page | 1 |
| Cart persistence (refresh, navigation) | 2 |
| Cart contents verification (names, prices) | 2 |
| Sorting + add | 2 |
| Button state verification | 1 |
| Cart count validation | 1 |
| Negative add scenarios | 3 |
| Remove from listing / cart / detail | 3 |
| Remove all / remove one of many | 2 |
| Re-add / button restore | 2 |
| Price exclusion after remove | 1 |
| Negative remove scenarios | 2 |

### `checkout.spec.js` – 27 Tests
| Category | Count |
|----------|-------|
| Full valid checkout flow | 2 |
| Summary / price verification | 4 |
| Back home / cart cleared | 2 |
| Form validation – empty fields | 4 |
| Form validation – invalid inputs | 4 |
| Security (XSS, SQL injection) | 2 |
| Cancel / navigation | 3 |
| Edge cases (empty cart, direct URL, long input) | 3 |
| Known defects captured (soft assertions) | 3 |

**Total: 73 automated test scenarios**

---

## Design Patterns

- **Page Object Model (POM)** — Each page has its own class encapsulating all locators and actions
- **Centralized constants** — Credentials, selectors, and product data in `utils/constants.js`
- **Before-each login** — Cart and checkout tests automatically log in before each test
- **Soft assertions** — Known SauceDemo defects (e.g. alphabetic zip accepted) are flagged with `console.warn` without blocking the suite
- **Screenshot / video on failure** — Configured in `playwright.config.js`

---

## Known Defects Identified

| ID | Area | Description |
|----|------|-------------|
| DEF-01 | Checkout | Alphabetic postal code accepted without validation |
| DEF-02 | Checkout | Numeric-only first/last name accepted without validation |
| DEF-03 | Checkout | Whitespace-only fields accepted in some cases |
| DEF-04 | Cart | Checkout proceeds with empty cart (no guard) |
| DEF-05 | Login | Whitespace-padded username behaviour inconsistent |

---

## Manual Test Case Document

A companion Word document (`SauceDemo_TestCase_Document.docx`) with 65 structured manual test cases (covering Login, Add to Cart, Remove from Cart, and Checkout) is available in the project root.

---

Prepared by: Gideon Adelaja — QA
