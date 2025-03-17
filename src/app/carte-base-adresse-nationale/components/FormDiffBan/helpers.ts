// === Interface pour les Labels ===
export interface Label {
  isoCode: string
  value: string
}

// === Interface pour une Position ===
export interface Position {
  type: string
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
}

// === Interface pour l'adresse ===
export interface Address {
  id: string
  mainCommonToponymID: string
  secondaryCommonToponymIDs: string[] | null
  districtID: string
  labels: Label[]
  number: number
  suffix: string | null
  certified: boolean
  positions: Position[]
  meta: {
    ban: {
      DEPRECATED_id: string
      DEPRECATED_cleInteropBAN: string
      cleInterop: string
      sources: string[]
      sourcePosition: string
      BETA_hashIdFix?: string
    }
    dgfip: {
      cadastre: string[]
      BETA_fantoir?: string
    }
    insee: {
      cog: string
      BETA_mainCog?: string
      BETA_isMainCog?: boolean
    }
    laPoste: { codePostal: string }
  }
  legalityDate: string
  BETA_lastRecordDate?: string
}

// === Interface pour un toponyme commun ===
export interface CommonToponym {
  id: string
  districtID: string
  labels: Label[]
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  meta: {
    ban: {
      DEPRECATED_id?: string
      DEPRECATED_groupId?: string
      DEPRECATED_cleInteropBAN?: string
      BETA_cleInterop?: string
      category: string
      sources: string[]
      sourceNomVoie: string
      BETA_hashIdFix?: string
    }
    dgfip?: {
      BETA_cadastre?: string
      BETA_codeFantoir?: string
    }
    insee: {
      cog: string
      BETA_mainCog: string
      BETA_isMainCog: boolean
    }
    laPoste: {
      codePostal: string[]
    }
  }
  BETA_legalityDate?: string
  BETA_lastRecordDate?: string
}

// === Interface pour un district ===
export interface District {
  id: string
  Labels: Label[]
  config: null
  meta: {
    ban: {
      DEPRECATED_id?: string
      type?: 'commune-actuelle' | 'commune-ancienne' | 'arrondissement'
      region: { nom: string, code: string }
      departement: { nom: string, code: string }
      composedAt: string
      dateRevision: string
      withBanId: boolean
      BETA_hashIdFix?: string
    }
    insee: {
      cog: string
      BETA_mainCog?: string
      BETA_isMainCog?: boolean
    }
    laPoste: {
      codePostal: string[]
    }
  }
  BETA_legalityDate?: string
  BETA_lastRecordDate?: string
}

// === Interface pour le format BAN ===
export interface BANFormat {
  districts: District[]
  commonToponyms: CommonToponym[]
  addresses: Address[]
}

// === Interface pour la sortie du formulaire ===
export interface FormDataResult {
  idBanAddress: string
  address: Address
  idBanMainCommonToponym: string
  commonToponym: CommonToponym
  idBanDistrict: string
  district: District
}

// === Interface pour le DiffBAN ===
export interface DiffBAN {
  __meta: {
    date: string
    fromDate: string
    toDate: string
    cogList: string[]
    districtIDs: string[]
  }
  created: BANFormat | {}
  disabled: BANFormat | {}
  updated: {
    districts: [District, District][]
    commonToponyms: [CommonToponym, CommonToponym][]
    addresses: [Address, Address][]
  }
  patchToUpdated: {
    districts: Partial<District>[]
    commonToponyms: Partial<CommonToponym>[]
    addresses: Partial<Address>[]
  }
}

const valueToJSON = (value: unknown): unknown | null => {
  try {
    return JSON.parse(value as string)
  }
  catch {
    return value !== '' ? value : null
  }
}

const formatFormDataValue = (key: string, value: any) => {
  switch (key) {
    case 'number':
      return Number(value)
    case 'positions':
      return value.map(({ type, lng, lat }: { type: string, lng: number, lat: number }) => ({
        type,
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      }))
    case 'codePostal':
      return `${value}`.padStart(5, '0')
    default:
      return value
  }
}

export const formDataToJson = (formData: FormData): FormDataResult => {
  const result: any = {}

  const setNestedValue = (obj: any, path: string[], value: any) => {
    let current = obj
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i]
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {}
      }
      current = current[key]
    }
    const pathValue = path[path.length - 1]
    current[path[path.length - 1]] = formatFormDataValue(pathValue, value)
  }

  for (const [key, value] of formData.entries()) {
    const parsedValue = valueToJSON(value)

    setNestedValue(result, key.split('.'), parsedValue)
  }

  return result as FormDataResult
}

export const formDataJsonToBAN = (formData: FormDataResult, oldValues: FormDataResult | null): BANFormat => {
  const { address, commonToponym, district } = formData

  const deepMerge = (obj1: any, obj2: any) => {
    if (!obj2) {
      return obj1
    }

    const result = JSON.parse(JSON.stringify(obj1))
    for (const key in obj1) {
      if (typeof obj1[key] === 'object') {
        result[key] = deepMerge(obj1[key], obj2[key])
      }
      else if (obj2[key]) {
        result[key] = obj2[key]
      }
    }

    return result
  }

  const mergedAddress = deepMerge(address, oldValues?.address)
  const mergedCommonToponym = deepMerge(oldValues?.commonToponym, commonToponym)
  const mergedDistrict = deepMerge(oldValues?.district, district)

  return {
    districts: [mergedDistrict],
    commonToponyms: [mergedCommonToponym],
    addresses: [mergedAddress],
  }
}

export const formatMongoToBAN = (mongoData: any): BANFormat => {
  return {
    districts: [
      {
        id: mongoData.banIdDistrict,
        Labels: [{ isoCode: 'fra', value: mongoData.commune.nom }]
          .concat(mongoData.commune.nomAlt ? [{ isoCode: 'fra', value: mongoData.commune.nom }] : []),
        config: null,
        meta: {
          ban: {
            DEPRECATED_id: mongoData.commune.code,
            region: {
              nom: mongoData.commune.region,
              code: mongoData.commune.region.code,
            },
            departement: {
              nom: mongoData.commune.departement,
              code: mongoData.commune.departement.code,
            },
            composedAt: new Date().toISOString(),
            dateRevision: new Date().toISOString(),
            withBanId: false,
          },
          insee: {
            cog: mongoData.commune.code,
            BETA_mainCog: mongoData.commune.mainCog || mongoData.commune.code,
            BETA_isMainCog: mongoData.commune.isMainCog || true,
          },
          laPoste: {
            codePostal: [`${mongoData.codePostal}`.padStart(5, '0')],
          },
        },
        BETA_legalityDate: '',
        BETA_lastRecordDate: '',
      },
    ],
    commonToponyms: [
      {
        id: mongoData.banIdMainCommonToponym,
        districtID: mongoData.banIdDistrict,
        labels: [
          { isoCode: 'fra', value: mongoData.voie.nomVoie },
          ...(
            Object.entries(
              (mongoData.voie.nomVoieAlt || {}) as Record<string, string>
            ).map(([isoCode, value]) => ({ isoCode, value }))
          ),
        ],
        geometry: {
          type: 'Point',
          coordinates: [mongoData.lon, mongoData.lat],
        },
        meta: {
          ban: {
            DEPRECATED_id: mongoData.voie.id,
            DEPRECATED_groupId: mongoData.voie.idVoie,
            category: 'voie',
            sources: mongoData.sources,
            sourceNomVoie: mongoData.sourcePosition,
          },
          insee: {
            cog: mongoData.commune.code,
            BETA_mainCog: mongoData.commune.mainCog || mongoData.commune.code,
            BETA_isMainCog: mongoData.commune.isMainCog || true,
          },
          laPoste: {
            codePostal: [`${mongoData.codePostal}`.padStart(5, '0')],
          },
        },
        BETA_legalityDate: '',
        BETA_lastRecordDate: '',
      },
    ],
    addresses: [
      {
        id: mongoData.banId,
        mainCommonToponymID: mongoData.banIdMainCommonToponym,
        secondaryCommonToponymIDs: null,
        districtID: mongoData.banIdDistrict,
        labels:
          (
            mongoData.lieuDitComplementNom
              ? [{ isoCode: 'fra', value: mongoData.lieuDitComplementNom }]
              : []
          ).concat(
            mongoData.lieuDitComplementNomAlt
              ? Object.entries(mongoData.lieuDitComplementNomAlt).map(([lang, value]) => ({
                isoCode: lang,
                value,
              }))
              : []
          ),
        number: mongoData.numero,
        suffix: mongoData.suffixe,
        certified: mongoData.certifie,
        positions: mongoData.positions.map((pos: any) => ({
          type: pos.positionType || 'entrée',
          geometry: {
            type: 'Point',
            coordinates: [pos.position.coordinates[0], pos.position.coordinates[1]],
          },
        })),
        meta: {
          ban: {
            DEPRECATED_id: mongoData.id,
            DEPRECATED_cleInteropBAN: mongoData.cleInterop,
            cleInterop: mongoData.cleInterop,
            sources: mongoData.sources,
            sourcePosition: mongoData.sourcePosition,
          },
          dgfip: {
            cadastre: mongoData.parcelles,
            BETA_fantoir: '',
          },
          insee: {
            cog: mongoData.commune.code,
            BETA_mainCog: mongoData.commune.mainCog || mongoData.commune.code,
            BETA_isMainCog: mongoData.commune.isMainCog || true,
          },
          laPoste: {
            codePostal: `${mongoData.codePostal}`.padStart(5, '0'),
          },
        },
        legalityDate: mongoData.dateMAJ ? mongoData.dateMAJ.split('T')[0] : '',
        BETA_lastRecordDate: '',
      },
    ],
  }
}

const deepDiff = <T extends Record<string, any>>(oldObj: T, newObj: T): Partial<T> => {
  const diff: Partial<T> = {}

  for (const key in newObj) {
    const oldValue = oldObj[key]
    const newValue = newObj[key]

    if (typeof newValue === 'object' && newValue !== null && !Array.isArray(newValue)) {
      const nestedDiff = deepDiff(oldValue || {}, newValue)
      if (Object.keys(nestedDiff).length > 0) {
        diff[key] = nestedDiff as T[Extract<keyof T, string>]
      }
    }
    else if (Array.isArray(newValue)) {
      const oldArray = Array.isArray(oldValue) ? oldValue : []
      const newArray = newValue

      if (JSON.stringify(oldArray) !== JSON.stringify(newArray)) {
        diff[key] = newArray
      }
    }
    else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      diff[key] = newValue
    }
  }

  return diff
}

export const FormResultToBanDiff = (
  action: 'created' | 'updated' | 'disabled',
  values: FormDataResult,
  oldValues: FormDataResult | null
): DiffBAN => {
  console.log('action', action)
  console.log('oldValues >>>', oldValues)
  console.log('values >>>', values)
  const banDiff: DiffBAN = {
    __meta: {
      date: new Date().toISOString(),
      fromDate: '',
      toDate: '',
      cogList: [],
      districtIDs: [],
    },
    created: {},
    disabled: {},
    updated: {
      districts: [],
      commonToponyms: [],
      addresses: [],
    },
    patchToUpdated: {
      districts: [],
      commonToponyms: [],
      addresses: [],
    },
  }

  if (action === 'created') {
    banDiff.created = values
  }
  else if (action === 'disabled') {
    banDiff.disabled = values
  }
  else if (action === 'updated' && oldValues) {
    // 🔹 Comparer l'ancienne et la nouvelle adresse
    const diffAddress = deepDiff(oldValues.address, values.address)
    console.log('diffAddress >>>', diffAddress)
    const diffCommonToponym = deepDiff(oldValues.commonToponym, values.commonToponym)
    console.log('diffCommonToponym >>>', diffCommonToponym)
    // const diffDistrict = deepDiff(oldValues.district, values.district)
    const hasChangesAddress = Object.keys(diffAddress).length > 0
    const hasChangesCommonToponym = Object.keys(diffCommonToponym).length > 0
    // const hasChangesDistrict = Object.keys(diffDistrict).length > 0

    // 🔥 Ajouter uniquement ce qui a changé
    console.log('hasChangesAddress >>>', hasChangesAddress)
    if (hasChangesAddress) {
      banDiff.updated.addresses = [[values.address, oldValues.address]]
      banDiff.patchToUpdated.addresses = [diffAddress]
    }
    console.log('hasChangesCommonToponym >>>', hasChangesCommonToponym)
    if (hasChangesCommonToponym) {
      banDiff.updated.commonToponyms = [[values.commonToponym, oldValues.commonToponym]]
      banDiff.patchToUpdated.commonToponyms = [diffCommonToponym]
    }
    // if (hasChangesDistrict) {
    //   banDiff.updated.districts = [[values.district, oldValues.district]]
    //   banDiff.patchToUpdated.districts = [diffDistrict]
    // }
  }

  return banDiff
}

export const banFormatToFormDataResult = (banData: BANFormat): FormDataResult => {
  return {
    idBanAddress: banData.addresses[0].id,
    address: banData.addresses[0],
    idBanMainCommonToponym: banData.commonToponyms[0].id,
    commonToponym: banData.commonToponyms[0],
    idBanDistrict: banData.districts[0].id,
    district: banData.districts[0],
  }
}

// // 1️⃣ Récupérer les données MongoDB et les formater en BAN
// const mongoData = { /* Insère les données MongoDB ici */ };
// const formattedBAN = formatMongoToBAN(mongoData);

// // 2️⃣ Simuler l’envoi du formulaire
// const formData = new FormData();
// formData.append("address.labels", JSON.stringify([{ lang: "fra", value: "Ma super baraque" }, { lang: "eus", value: "Nire etxe bikaina" }]));

// const formDataJson = formDataToJson(formData);

// // 3️⃣ Générer le DiffBAN avec l'ancienne version des données
// const oldFormattedBAN = formatMongoToBAN(mongoData);
// const diffBAN = FormResultToBanDiff("updated", formDataJson, oldFormattedBAN);

// console.log("📌 DiffBAN :", JSON.stringify(diffBAN, null, 2));
