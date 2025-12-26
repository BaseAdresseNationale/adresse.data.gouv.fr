type TypeAddressOriginal = Record<string, unknown>

interface TypeVoie {
  id: string
  idVoie: string
  nomVoie: string
}

interface TypeAddressExtended {
  type: string
  banId?: string
  banIdMainCommonToponym?: string
  banIdDistrict?: string
  numero: number
  suffixe: string | null
  lieuDitComplementNom: string | null
  parcelles: string[]
  sources: string[]
  certifie: boolean
  position: TypePosition
  positionType: string
  positions: { position: TypePosition, positionType: string }[]
  displayBBox: number[]
  sourcePosition: string
  lon: number
  lat: number
  x: number
  y: number
  tiles: string[]
  codeAncienneCommune: string | null
  nomAncienneCommune: string | null
  codePostal: string
  libelleAcheminement: string
  adressesOriginales: TypeAddressOriginal[]
  id: string
  cleInterop: string
  voie: TypeVoie
  commune: TypeDistrict
}
/*
const addressSample: TypeAddressExtended = {
  type: 'numero',
  banId: '1fe5a90e-8cce-45ff-828f-2a97ce50f5e0',
  banIdMainCommonToponym: '039e1613-49af-4072-8979-2b8dc05aa6dc',
  banIdDistrict: 'e0c38a50-c8c0-4eeb-972f-428f8f583339',
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
  positions: [
    {
      position: {
        type: 'Point',
        coordinates: [
          2.573506,
          48.847339,
        ],
      },
      positionType: 'segment',
    },
  ],
  displayBBox: [
    2.5728,
    48.8469,
    2.5742,
    48.8478,
  ],
  sourcePosition: 'ign-api-gestion-ign',
  lon: 2.573506,
  lat: 48.847339,
  x: 668701.13,
  y: 6860895.04,
  tiles: [
    '12/2077/1409',
    '13/4154/2818',
    '14/8309/5637',
  ],
  codeAncienneCommune: null,
  nomAncienneCommune: null,
  codePostal: '93160',
  libelleAcheminement: 'NOISY LE GRAND',
  adressesOriginales: [
    {
      _id: '6258122f2194b2510a57650b',
      dataSource: 'ign-api-gestion',
      source: 'ign-api-gestion-ign',
      idAdresse: 'ban-housenumber-314d89616649496dbb0955271cc61c4d',
      anciensIdAdresse: [
        'ADRNIVX_0000000268345644',
      ],
      numero: 2,
      suffixe: null,
      nomVoie: 'ALLEE ALBERT LAURENCON',
      lieuDitComplementNom: null,
      codePostal: '93160',
      codeCommune: '93051',
      nomCommune: 'Noisy-le-Grand',
      idPosition: 'ban-position-c161bd5ecf43431182c070b477b1a315',
      positionType: 'segment',
      sourcePosition: 'ign',
      dateMAJPosition: null,
      position: {
        type: 'Point',
        coordinates: [
          2.573506,
          48.847339,
        ],
      },
      idVoie: '93051_0015',
      groupId: 'fantoir-93051_0015',
    },
    {
      _id: '6258122f2194b2510a577055',
      dataSource: 'ign-api-gestion',
      source: 'ign-api-gestion-ign',
      idAdresse: 'ban-housenumber-314d89616649496dbb0955271cc61c4d',
      anciensIdAdresse: [
        'ADRNIVX_0000000268345644',
      ],
      numero: 2,
      suffixe: null,
      nomVoie: 'ALLEE ALBERT LAURENCON',
      lieuDitComplementNom: null,
      codePostal: '93160',
      codeCommune: '93051',
      nomCommune: 'Noisy-le-Grand',
      idPosition: 'ban-position-e72d323189d547109b225668c0ccce92',
      positionType: 'entrée',
      sourcePosition: 'ign',
      dateMAJPosition: null,
      position: {
        type: 'Point',
        coordinates: [
          2.573019,
          48.847875,
        ],
      },
      idVoie: '93051_0015',
      groupId: 'fantoir-93051_0015',
    },
    {
      _id: '64f6e95eee8fb2de8cf5d01a',
      dataSource: 'cadastre',
      source: 'cadastre',
      idAdresse: '93051-0015-2',
      numero: 2,
      suffixe: null,
      nomVoie: 'Allée Albert Laurencon',
      codeCommune: '93051',
      nomCommune: 'Noisy-le-Grand',
      pseudoNumero: false,
      destination: [
        'appartement',
      ],
      parcelles: [
        '93051000AI0523',
      ],
      position: {
        type: 'Point',
        coordinates: [
          2.5724855150943404,
          48.84620287169814,
        ],
      },
      positionType: 'parcelle',
      idVoie: '93051_0015',
      groupId: 'fantoir-93051_0015',
    },
    {
      _id: '65129647e7317f73d385c4c1',
      dataSource: 'ftth',
      source: 'ftth',
      idAdresse: 'IMB/93051/C/002Q',
      numero: 2,
      suffixe: null,
      nomVoie: 'Allée Albert Laurençon',
      codeCommune: '93051',
      nomCommune: 'Noisy-le-Grand',
      codePostal: '93160',
      position: {
        type: 'Point',
        coordinates: [
          2.573061,
          48.84785,
        ],
      },
      idVoie: '93051_0015',
      groupId: 'fantoir-93051_0015',
    },
  ],
  id: '93051_0015_00002',
  cleInterop: '93051_0015_00002',
  voie: {
    id: '93051_0015',
    idVoie: '93051_0015',
    nomVoie: 'Allee Albert Laurencon',
  },
  commune: {
    id: '93051',
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
}
*/
