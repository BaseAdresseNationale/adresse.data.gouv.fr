export const displayWithPlural = (quantity: number, str: string) => quantity > 1 ? `${quantity} ${str}s` : `${quantity} ${str}`

export const removeAccent = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
