const formatNumber = (value: string | number) => new Intl.NumberFormat('fr-FR').format(Number(value))

export default formatNumber
