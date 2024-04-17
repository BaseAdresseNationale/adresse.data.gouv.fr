import {useMemo, useEffect} from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import {fr} from '@codegouvfr/react-dsfr'

import Page from '@/layouts/main'
import Section from '@/components/section'
import KeyNumbersBlock from '@/components/key-numbers-block'
import {CartesianChart as Chart} from '@/components/charts'
import {
  getDataDef,
  getBanStatsData,
  fetcher,
} from '@/views/stats/helper'
import {
  defDataDailyDownload,
  defDataMonthlyLookup,
  defDataBanVisit,
} from '@/views/stats/stats-config-data'

const URL_GET_STATS_DOWNLOAD_DAY = './api/stats/daily-download'
const URL_GET_STATS_DOWNLOAD_MONTH = './api/stats/monthly-usage'
const URL_GET_STATS_LOOKUP_MONTH = './api/stats/daily-lookup'
const URL_GET_STATS_VISIT = './api/stats/visit'

function StatsPage() {
  const {data: dataDailyDownload, error: errorDataDailyDownload} = useSWR(URL_GET_STATS_DOWNLOAD_DAY, fetcher)
  const {data: dataMonthlyUsage, error: errorDataMonthlyUsage} = useSWR(URL_GET_STATS_DOWNLOAD_MONTH, fetcher)
  const {data: dataMonthlyLookup, error: errorDataMonthlyLookup} = useSWR(URL_GET_STATS_LOOKUP_MONTH, fetcher)
  const {data: dataBanVisit, error: errorDataBanVisit} = useSWR(URL_GET_STATS_VISIT, fetcher)
  const {data: dataStateBan, error: errorBanStats} = useSWR('BAN__GET_STATE__API', getBanStatsData)

  const axisDefDailyDownload = useMemo(() => getDataDef(defDataDailyDownload, 'rubi'), [])
  const axisDefDataMonthlyLookup = useMemo(() => getDataDef(defDataMonthlyLookup), [])
  const axisDefDataBanVisit = useMemo(() => getDataDef(defDataBanVisit), [])

  useEffect(() => {
    [
      errorDataDailyDownload,
      errorDataMonthlyUsage,
      errorDataMonthlyLookup,
      errorDataBanVisit,
      errorBanStats,
    ].filter(Boolean).forEach(err => console.error(`API CALL ERROR: ${err}`))
  }, [
    errorDataDailyDownload,
    errorDataMonthlyUsage,
    errorDataMonthlyLookup,
    errorDataBanVisit,
    errorBanStats,
  ])

  return (
    <Page title='Statistiques'>

      <Section>
        <h1>Statistiques</h1>
        <p>
          Vous trouverez ici les statistiques d’utilisation de la <b>Base Adresse Nationale (BAN)</b>.
          Ces données ont pour objectif de vous permettre de suivre l’évolution de la BAN et
          de vous aider à prendre des décisions sur son utilisation.
          Elles nous permettent également de mieux comprendre vos besoins et
          d’orienter nos actions pour améliorer la BAN.
        </p>

        <p>
          Il est à noter que ces statistiques ne sont pas exhaustives et qu’elles sont en constante évolution.
          De plus, elles ne prennent pas en compte les utilisations de la BAN par les exploitants ou organismes partenaires.
        </p>

        <p className='section-footer-notes'>
          <i>Ces données étant en cours de construction, elles peuvent, dans certains cas, être incomplètes. <br />
            Nous vous remercions de votre compréhension.</i>
        </p>
      </Section>

      <Section background='grey' className='key-number-section'>
        <h2>Les usages de la BAN en chiffre</h2>
        <p><b>{dataMonthlyUsage?.period && `● Periode : ${dataMonthlyUsage.period}`}</b></p>
        <KeyNumbersBlock data={dataMonthlyUsage?.value} />

        <ul className='section-footer-notes'>
          {dataMonthlyUsage?.value?.map(({note, label}) => (
            <li key={label}>{note}</li>
          ))}
        </ul>
      </Section>

      <Section>
        <h2>Exploitation directe de la BAN : <br />Nombre de recherches de composants d’adresses</h2>
        <p>Consommation quotidiennes des données de la BAN depuis l’API d’exploration (<i>API Lookup</i>).</p>
        <p className='note-info'>
          <i className={fr.cx('fr-icon-info-fill', 'fr-icon', 'warn-icon')} /> Données collectées à partir de Novembre 2023
        </p>

        <div className='chart-wrapper'>
          <Chart
            type='line'
            data={dataMonthlyLookup}
            axisDef={axisDefDataMonthlyLookup} />
        </div>

        <ul className='section-footer-notes'>
          <li>
            Recherches quotidiennes sur les 30 derniers jours.
          </li>
          <li>
            * L’API Geocodage-BAN (anciennement “API Adresse”) met à disposition les adresses présentes dans la BAN.
            Les adresses retournées par l’API ne sont actuellement disponibles qu’en français.
            L’API ne fournit pas encore les lieux-dits.
          </li>
        </ul>
      </Section>

      <Section>
        <h2>Exploitation indirecte de la BAN : <br />Nombre de téléchargements des données de la BAN</h2>
        <p>Téléchargement quotidien des données brutes issues des serveurs BAN par des exploitants extérieurs, en vue d’une utilisation direct depuis leurs systèmes.</p>
        <p className='note-info'>
          <i className={fr.cx('fr-icon-info-fill', 'fr-icon', 'warn-icon')} /> Données collectées à partir de Novembre 2023
        </p>

        <div className='chart-wrapper'>
          <Chart
            type='bar'
            data={dataDailyDownload}
            axisDef={axisDefDailyDownload} />
        </div>

        <ul className='section-footer-notes'>
          <li>Téléchargements quotidiens sur les 30 derniers jours.</li>
        </ul>
      </Section>

      <Section background='color' className='key-number-section'>
        <h2>État de la Base Adresses Nationale (BAN)</h2>
        <p>
          La <b>Base Adresse Nationale (BAN)</b> est constituée de plusieurs sources de données, de natures différentes.
          La récente loi dite 3DS impose aux communes de mettre en place une <b>Base Adresse Locale (BAL)</b>,
          seule source certifiable et officielle, qui à terme constituera l’intégralité de la BAN.
        </p>

        {dataStateBan && (
          <KeyNumbersBlock data={dataStateBan} />
        )}

        <div>
          <Link href='/deploiement-bal'>Plus d&apos;informations sur l&apos;état du déploiement des Bases Adresses Locales</Link>
        </div>
      </Section>

      <Section>
        <h2>Attrait du sujet “Adresse”</h2>
        <p>Quantité de visites sur le site web de l’adresse.</p>

        <div className='chart-wrapper'>
          <Chart
            type='line'
            data={dataBanVisit}
            axisDef={axisDefDataBanVisit} />
        </div>

        <ul className='section-footer-notes'>
          <li>Valeurs totales mensuelles des 12 derniers mois.</li>
        </ul>
      </Section>

      <Section>
        <h2>À propos des statistiques</h2>
        <p>
          Les données de statistiques sont issues de Matomo, un outil libre de mesure d’audience web.
          Ces données sont anonymisées, hébergées en France aupres de la société OVH, et conservées dans
          le but d’améliorer les services proposés par l’état.
          En aucun cas, ces données ne sont partagées avec des tiers ou utilisées à d’autres fins que
          l’amélioration de la plateforme.
        </p>
        <p>
          Pour plus d’informations, vous pouvez consulter
          nos <Link href='/cgu'>Conditions Générales d’Utilisation</Link>.
        </p>
      </Section>

      <style jsx>{`
        .wip-info,
        .note-info {
          font-size: 0.75em;
          line-height: 1.5;
          list-style: none;
          padding-left: 0;
          margin: -1em 0 2.5rem;
        }

        .wip-info {
          color: rgb(230, 90, 90);
        }

        .note-info {
          color: rgb(90, 145, 230);
        }

        .chart-wrapper {
          width: 100%;
          height: 560px;
        }

        .section-footer-notes {
          font-size: 0.75em;
          line-height: 1.5;
          list-style: none;
          padding-left: 0;
        }
      `}</style>

    </Page>
  )
}

export default StatsPage
