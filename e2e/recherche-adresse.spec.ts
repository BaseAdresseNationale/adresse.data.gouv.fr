import { test, expect } from '@playwright/test'

// Parcours : un usager cherche son adresse depuis l'accueil et arrive sur sa fiche dans la carte BAN.
// Le test interroge les vraies API (géocodeur et BAN) : il dépend de leur disponibilité.
test('rechercher une adresse depuis l’accueil ouvre sa fiche sur la carte', async ({ page }) => {
  await page.goto('/')

  const recherche = page.getByRole('combobox', { name: /Rechercher dans la Base Adresse Nationale/ })
  await recherche.fill('20 avenue de Ségur 75007 Paris')

  const resultat = page.getByRole('option', { name: /20 Avenue de Ségur/ }).first()
  await resultat.click()

  await expect(page).toHaveURL(/\/carte-base-adresse-nationale\?id=75107_\w+_00020$/)
  await expect(page.getByText('Avenue de Ségur,')).toBeVisible()
  await expect(page.getByText(/Commune de/)).toBeVisible()
})
