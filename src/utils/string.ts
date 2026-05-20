export const removeAccent = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
export const codeCommuneRegex = /^(?:(?:0[1-9]|[1-8]\d|9[0-5]|2A|2B)\d{3}|97[1-6]\d{2})$/