export const displayWithPlural = (quantity: number, str: string) => quantity > 1 ? `${quantity} ${str}s` : `${quantity} ${str}`
