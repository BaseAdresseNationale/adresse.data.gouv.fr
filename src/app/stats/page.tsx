'use client'
import { useMemo, useEffect } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { fr } from '@codegouvfr/react-dsfr'

import { TextWrapper } from './page.styled'
import Breadcrumb from '@/layouts/Breadcrumb'

import Section from '@/components/Section'
import KeyNumbersBlock from '@/components/KeyNumberBlock'
import { CartesianChart as Chart } from '@/components/Charts'
import {
  getDataDef,
  getBanStatsData,
  fetcher,
} from './utils/helper'
import {
  defDataDailyDownload,
  defDataMonthlyLookup,
  defDataBanVisit,
} from './utils/stats-config-data'

const URL_GET_STATS_DOWNLOAD_DAY = '/stats/daily-download'
const URL_GET_STATS_DOWNLOAD_MONTH = '/stats/monthly-usage'
const URL_GET_STATS_LOOKUP_MONTH = '/stats/daily-lookup'
const URL_GET_STATS_VISIT = '/stats/visit'

function StatsPage() {
  const { data: dataDailyDownload, error: errorDataDailyDownload } = useSWR(URL_GET_STATS_DOWNLOAD_DAY, fetcher)
  const { data: dataMonthlyUsage, error: errorDataMonthlyUsage } = useSWR(URL_GET_STATS_DOWNLOAD_MONTH, fetcher)
  const { data: dataMonthlyLookup, error: errorDataMonthlyLookup } = useSWR(URL_GET_STATS_LOOKUP_MONTH, fetcher)
  const { data: dataBanVisit, error: errorDataBanVisit } = useSWR(URL_GET_STATS_VISIT, fetcher)
  const { data: dataStateBan, error: errorBanStats } = useSWR('BAN__GET_STATE__API', getBanStatsData)

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
    <>
      <Breadcrumb
        currentPageLabel="Statistiques"
        segments={[]}
      />
      <TextWrapper>
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

          <p className="section-footer-notes">
            <i>Ces données étant en cours de construction, elles peuvent, dans certains cas, être incomplètes. <br />
              Nous vous remercions de votre compréhension.
            </i>
          </p>
        </Section>

        <Section
          title="Les usages de la BAN en chiffres"
          id="Ban en chiffres"
          theme="secondary"
          className="key-number-section"
        >
          <p><b>{dataMonthlyUsage?.period && `● Periode : ${dataMonthlyUsage.period}`}</b></p>
          <KeyNumbersBlock data={dataMonthlyUsage?.value} />

          <ul className="section-footer-notes">
            {dataMonthlyUsage?.value?.map(({ note, label }) => (
              <li key={label}>{note}</li>
            ))}
          </ul>
        </Section>

        <Section>
          <h2>Exploitation directe de la BAN : <br />Nombre de recherches de composants d’adresses</h2>
          <p>Consommation quotidienne des données de la BAN depuis l’API d’exploration (<i>API Lookup</i>).</p>
          <p className="note-info">
            <i className={fr.cx('fr-icon-info-fill')} /> Données collectées à partir de Novembre 2023
          </p>

          <div className="chart-wrapper">
            <Chart
              type="line"
              data={dataMonthlyLookup}
              axisDef={axisDefDataMonthlyLookup}
            />
          </div>

          <ul className="section-footer-notes">
            <li>
              Recherches quotidiennes sur les 30 derniers jours.
            </li>
          </ul>
        </Section>

        <Section>
          <h2>Exploitation indirecte de la BAN : <br />Nombre de téléchargements des données de la BAN</h2>
          <p>Téléchargement quotidien des données brutes issues des serveurs BAN par des exploitants extérieurs, en vue d’une utilisation directe depuis leurs systèmes.</p>
          <p className="note-info">
            <i className={fr.cx('fr-icon-info-fill')} /> Données collectées à partir de Novembre 2023
          </p>

          <div className="chart-wrapper">
            <Chart
              type="bar"
              data={dataDailyDownload}
              axisDef={axisDefDailyDownload}
            />
          </div>

          <ul className="section-footer-notes">
            <li>
              Téléchargements quotidiens sur les 30 derniers jours.
            </li>
          </ul>
        </Section>

        <Section
          title="État de la Base Adresse Nationale (BAN)"
          id="Etat de la BAN"
          theme="secondary"
          className="key-number-section"
        >
          <p>
            La <b>Base Adresse Nationale (BAN)</b> est constituée de plusieurs sources de données, de natures différentes.
            La récente loi dite 3DS impose aux communes de mettre en place une <b>Base Adresse Locale (BAL)</b>,
            seule source certifiable et officielle, qui à terme constituera l’intégralité de la BAN.
          </p>

          {dataStateBan && (
            <KeyNumbersBlock data={dataStateBan} />
          )}

          <div>
            <Link href="/deploiement-bal">Plus d&apos;informations sur l&apos;état du déploiement des Bases Adresses Locales</Link>
          </div>
        </Section>

        <Section>
          <h2>Attrait du sujet “Adresse”</h2>
          <p>Quantité de visites sur le site web de l’adresse.</p>

          <div className="chart-wrapper">
            <Chart
              type="line"
              data={dataBanVisit}
              axisDef={axisDefDataBanVisit}
            />
          </div>

          <ul className="section-footer-notes">
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
            nos <Link href="/cgu">Conditions Générales d’Utilisation</Link>.
          </p>
        </Section>
      </TextWrapper>
    </>
  )
}

export default StatsPage
