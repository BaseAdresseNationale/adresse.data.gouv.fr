const BASE_URL = 'https://query.wikidata.org'

const communeFlagQuery = (codeCommune: string) => `
SELECT  ?city
        ?inseeCode
        ?cityLabel
        ?neighborLabel 
        ?neighborINSEE
        ?flag
    WHERE
    {
    ?city wdt:P374 "${codeCommune}".
    ?city wdt:P374 ?inseeCode.
    OPTIONAL { ?city wdt:P94 ?ownFlag. }
    OPTIONAL { ?city wdt:P131 ?parents.
            ?parents wdt:P31 wd:Q6465;
                        wdt:P94 ?dptFlag.}
    OPTIONAL { ?city wdt:P131 ?parents.
            ?parents wdt:P31 wd:Q36784;
                        wdt:P94 ?directRegionFlag.}
    OPTIONAL { ?city wdt:P131/wdt:P131 ?parents.
            ?parents wdt:P31 wd:Q36784;
                        wdt:P94 ?regionFlag.}
    OPTIONAL { ?city wdt:P131 ?parents.
            ?parents wdt:P31 wd:Q719487;
                        wdt:P94 ?territoryFlag.}
    BIND(IF(BOUND(?ownFlag), ?ownFlag, IF(BOUND(?dptFlag), ?dptFlag, IF(BOUND(?directRegionFlag), ?directRegionFlag, IF(BOUND(?regionFlag), ?regionFlag, ?territoryFlag)))) AS ?flag)
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE]". }
    }
    ORDER BY ?inseeCode
`

export const getCommuneFlag = async (codeCommune: string): Promise<string | undefined> => {
  const url = `${BASE_URL}/sparql?query=${encodeURIComponent(communeFlagQuery(codeCommune))}`
  // Wikidata blocks requests without a user agent specific enough
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    },
    cache: 'force-cache',
  })
  const responseBody = await response.text()
  const flagUrl = responseBody.match(/http.*\.svg/)?.[0]

  return flagUrl
}

const communeLogoQuery = (codeCommune: string) => `
    SELECT  ?city
            ?inseeCode
            ?cityLabel
            ?logo
    WHERE
    {
        ?city wdt:P374 "${codeCommune}".
        ?city wdt:P374 ?inseeCode.
        OPTIONAL { ?city wdt:P154 ?logo. }  # Récupère le logo de la ville si disponible
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }
    ORDER BY ?inseeCode
`

export const getCommuneLogo = async (codeCommune: string): Promise<string | undefined> => {
  const url = `${BASE_URL}/sparql?query=${encodeURIComponent(communeLogoQuery(codeCommune))}`
  // Wikidata blocks requests without a user agent specific enough
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    },
    cache: 'force-cache',
  })
  const responseBody = await response.text()
  const flagUrl = responseBody.match(/http.*\.png/)?.[0]

  return flagUrl
}
