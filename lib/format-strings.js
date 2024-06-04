export const removeAccents = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // eslint-disable-line unicorn/escape-case
