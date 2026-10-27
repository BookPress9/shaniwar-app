import { test, expect } from '@playwright/test';

test.describe('Hybrid Monk Onboarding Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to local web dev server
    await page.goto('/');
  });

  test('should render the monastery initial landing and orientation', async ({ page }) => {
    // Verify app brand presence
    await expect(page.locator('text=HYBRID MONK').or(page.locator('text=DAILY DISCIPLINE'))).toBeVisible({ timeout: 10000 });
  });

  test('should allow user to navigate between Routine and Sadhna', async ({ page }) => {
    // Tap on Sadhna bottom tab or link
    const sadhnaTab = page.locator('text=SADHNA').or(page.locator('text=🧘'));
    if (await sadhnaTab.isVisible()) {
      await sadhnaTab.click();
      await expect(page.locator('text=Spine').or(page.locator('text=Vertebra'))).toBeVisible();
    }
  });

  test('should track the 3 mandatory daily anchors in the cockpit', async ({ page }) => {
    // Verify Cockpit displays the 3 mandatory anchors
    await expect(page.locator('text=Action Alarm').or(page.locator('text=Alarm'))).toBeVisible();
    await expect(page.locator('text=Sadhna').or(page.locator('text=Ascension'))).toBeVisible();
    await expect(page.locator('text=Manovigyan').or(page.locator('text=Inquiry'))).toBeVisible();
  });
});
