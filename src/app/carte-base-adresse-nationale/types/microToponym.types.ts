type TypePosition = {
  type: string
  coordinates: number[]
}

interface TypeAddress {
  banId: string
  numero: number
  suffixe: string | null
  lieuDitComplementNom: string | null
  parcelles: any[]
  sources: string[]
  certifie: boolean
  position: TypePosition
  positionType: string
  sourcePosition: string
  codePostal: string
  libelleAcheminement: string
  id: string
}

interface TypeDistrict {
  id: string
  banId?: string
  nom: string
  code: string
  departement: {
    nom: string
    code: string
  }
  region: {
    nom: string
    code: string
  }
}

interface TypeMicroToponym {
  id: string
  type: string
  banId: string
  idVoie: string
  nomVoie: string
  sourceNomVoie: string
  sources: string[]
  displayBBox: number[]
  nbNumeros: number
  nbNumerosCertifies: number
  position: {
    type: string
    coordinates: number[]
  }
  commune: TypeDistrict
  numeros: TypeAddress[]
}

/*
const microToponymSample: TypeMicroToponym = {
  id: '93051_0015',
  type: 'voie',
  banId: '039e1613-49af-4072-8979-2b8dc05aa6dc',
  idVoie: '93051_0015',
  nomVoie: 'Allee Albert Laurencon',
  sourceNomVoie: 'ign-api-gestion-ign',
  sources: [
    'ign-api-gestion-ign',
    'cadastre',
    'ftth',
  ],
  displayBBox: [
    2.5705,
    48.8455,
    2.5762,
    48.8493,
  ],
  nbNumeros: 4,
  nbNumerosCertifies: 0,
  position: {
    type: 'Point',
    coordinates: [
      2.573379,
      48.847404,
    ],
  },
  commune: {
    id: '93051',
    banId: 'e0c38a50-c8c0-4eeb-972f-428f8f583339',
    nom: 'Noisy-le-Grand',
    code: '93051',
    departement: {
      nom: 'Seine-Saint-Denis',
      code: '93',
    },
    region: {
      nom: 'Île-de-France',
      code: '11',
    },
  },
  numeros: [
    {
      banId: '1fe5a90e-8cce-45ff-828f-2a97ce50f5e0',
      numero: 2,
      suffixe: null,
      lieuDitComplementNom: null,
      parcelles: [],
      sources: [
        'ign-api-gestion-ign',
        'cadastre',
        'ftth',
      ],
      certifie: false,
      position: {
        type: 'Point',
        coordinates: [
          2.573506,
          48.847339,
        ],
      },
      positionType: 'segment',
      sourcePosition: 'ign-api-gestion-ign',
      codePostal: '93160',
      libelleAcheminement: 'NOISY LE GRAND',
      id: '93051_0015_00002',
    },
    {
      banId: '94656482-8d07-46f7-b114-6932c04ecfad',
      numero: 4,
      suffixe: null,
      lieuDitComplementNom: null,
      parcelles: [],
      sources: [
        'ign-api-gestion-ign',
        'cadastre',
        'ftth',
      ],
      certifie: false,
      position: {
        type: 'Point',
        coordinates: [
          2.573506,
          48.847339,
        ],
      },
      positionType: 'segment',
      sourcePosition: 'ign-api-gestion-ign',
      codePostal: '93160',
      libelleAcheminement: 'NOISY LE GRAND',
      id: '93051_0015_00004',
    },
    {
      banId: '50dc346e-52cd-42aa-b396-7a7992f8509f',
      numero: 5,
      suffixe: null,
      lieuDitComplementNom: null,
      parcelles: [],
      sources: [
        'ign-api-gestion-ign',
      ],
      certifie: false,
      position: {
        type: 'Point',
        coordinates: [
          2.573253,
          48.847257,
        ],
      },
      positionType: 'segment',
      sourcePosition: 'ign-api-gestion-ign',
      codePostal: '93160',
      libelleAcheminement: 'NOISY LE GRAND',
      id: '93051_0015_00005',
    },
    {
      banId: 'a7aee2de-d205-4689-800a-9fd3967d4609',
      numero: 6,
      suffixe: null,
      lieuDitComplementNom: null,
      parcelles: [],
      sources: [
        'ign-api-gestion-ign',
        'cadastre',
        'ftth',
      ],
      certifie: false,
      position: {
        type: 'Point',
        coordinates: [
          2.573255,
          48.84755,
        ],
      },
      positionType: 'entrée',
      sourcePosition: 'ign-api-gestion-ign',
      codePostal: '93160',
      libelleAcheminement: 'NOISY LE GRAND',
      id: '93051_0015_00006',
    },
  ],
}
 */
