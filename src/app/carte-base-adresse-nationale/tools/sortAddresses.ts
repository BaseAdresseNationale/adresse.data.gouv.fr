export interface SortAddressesEntry {
  numero: string
  suffixe?: string
}

const sortAddresses = (
  { numero: numeroA, suffixe: suffixeA }: SortAddressesEntry,
  { numero: numeroB, suffixe: suffixeB }: SortAddressesEntry,
) => {
  const basicSuffix = {
    bis: 0,
    ter: 1,
    quater: 2,
    quinquies: 3,
    sexies: 4,
    septies: 5,
    octies: 6,
    novies: 7,
    decies: 8,
    undecies: 9,
    duodecies: 10,
    terdecies: 11,
    quaterdecies: 12,
    quindecies: 13,
    sedecies: 14,
  }
  const numA = Number(numeroA)
  const numB = Number(numeroB)
  if (numA < numB) return -1
  if (numA > numB) return 1
  if (suffixeA === suffixeB) return 0
  const suffixeAInt = Number(suffixeA)
  const suffixeBInt = Number(suffixeB)
  if (suffixeAInt < suffixeBInt) return -1
  if (suffixeAInt > suffixeBInt) return 1
  const suffixeAIndex = basicSuffix[suffixeA?.toLowerCase() as keyof typeof basicSuffix]
  const suffixeBIndex = basicSuffix[suffixeB?.toLowerCase() as keyof typeof basicSuffix]
  if (suffixeAIndex && suffixeBIndex) {
    if (suffixeAIndex < suffixeBIndex) return -1
    if (suffixeAIndex > suffixeBIndex) return 1
  }
  return String(suffixeA || '').localeCompare(String(suffixeB || ''))
}

export default sortAddresses
