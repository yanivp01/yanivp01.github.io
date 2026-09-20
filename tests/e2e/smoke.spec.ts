import { expect, test } from '@playwright/test';

const routes = ['/', '/speaking', '/teaching', '/research', '/essays', '/essays/mushrooms-not-ecosystems', '/model', '/about'];

for (const route of routes) {
  test(`${route} renders cleanly`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\/www\.yapros\.co\.uk\//);
    const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonicalHref).toMatch(/^https:\/\/www\.yapros\.co\.uk\//);
    expect(canonicalHref).not.toMatch(/\.html$/);
    await expect(page.locator('a[href^="mailto:yanivproselkov@gmail.com"]').first()).toBeVisible();
    expect(errors, errors.join('\n')).toEqual([]);
  });
}

test('legacy URL redirects', async ({ page }) => {
  await page.goto('/bio.html');
  await expect(page).toHaveURL(/\/about$/);
});

test('mobile nav opens', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('link', { name: 'Speaking' })).toBeVisible();
});

test('no CTO copy anywhere', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route);
    expect(await page.locator('body').innerText()).not.toMatch(/\bCTO\b/);
  }
});
