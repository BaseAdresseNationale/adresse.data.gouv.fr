/* eslint-disable @stylistic/semi */
/* eslint-disable @stylistic/multiline-ternary */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @stylistic/no-multiple-empty-lines */
/* eslint-disable @stylistic/no-trailing-spaces */
import React from 'react'
import { Accordion } from '@codegouvfr/react-dsfr/Accordion'
import { Badge } from '@codegouvfr/react-dsfr/Badge'

export default function WebhookGuide() {
  const handleToggle = (expanded: boolean) => {
    if (expanded) {
      // Scroll vers le guide après un petit délai pour laisser l'accordion s'ouvrir
      setTimeout(() => {
        const guideElement = document.querySelector('[data-guide-container]')
        if (guideElement) {
          guideElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          })
        }
      }, 150)
    }
  }

  return (
    <div className="fr-mb-3w" data-guide-container>
      <Accordion
        titleAs="h3"
        label="Guide d'utilisation - Comprendre et configurer les webhooks"
        onExpandedChange={handleToggle}
      >
        <div className="fr-mt-2w fr-p-3w fr-background-alt--grey">
          {/* Introduction */}
          <div className="fr-mb-3w">
            <h4>Qu&apos;est-ce qu&apos;un webhook ?</h4>
            <p>
              Un webhook est un mécanisme de notification HTTP qui permet à une application d'envoyer 
              automatiquement des données vers une autre application lorsqu'un événement se produit.
            </p>
            <p>
              <strong>Dans le contexte des Bases Adresses Locales (BAL)</strong>, les webhooks permettent d'être 
              alerté instantanément lorsqu'une BAL est publiée, ou si elle rencontre 
              un problème et doit être corrigée puis republiée.
            </p>
            
            {/* Workflow en deux colonnes */}
            <h4>Workflow </h4>
            <div className="fr-grid-row fr-grid-row--gutters fr-mt-3w">
              {/* Colonne gauche - Cas d'erreur */}
              <div className="fr-col-12 fr-col-md-6">
                <div className="fr-background-alt--red-marianne fr-p-2w">
                  <h5 className="fr-text--bold">Cas d'erreur</h5>
                  <p className="fr-text--sm">
                    BAL publiée → Validation échoue → BAL bloquée → 
                    Webhook d'alerte envoyé → Équipe technique notifiée → Investigation et correction → 
                    Nouvelle soumission 
                  </p>
                </div>
              </div>

              {/* Colonne droite - Cas de validation réussie */}
              <div className="fr-col-12 fr-col-md-6">
                <div className="fr-background-alt--green-tilleul-verveine fr-p-2w">
                  <h5 className="fr-text--bold">Cas de validation réussie</h5>
                  <p className="fr-text--sm">
                    BAL publiée → Validation réussie → BAL acceptée → 
                    Webhook informatif envoyé → Équipe notifiée
                  </p>
                </div>
              </div>
            </div>

            <p className="fr-mt-2w">
              <strong>Objectif :</strong> Réduire le délai entre la détection d&apos;un problème et sa résolution
              pour maintenir la qualité des données adresses en continu.
            </p>
          </div>

          <div className="fr-grid-row fr-grid-row--gutters">
            {/* Colonne gauche - Configuration */}
            <div className="fr-col-12 fr-col-md-6">
              <h4>Configuration du webhook</h4>
              <div className="fr-mb-3w">
                <h5>
                  <Badge severity="info" small>Intégrations</Badge> Canaux de notification
                </h5>
                <p><strong>Messageries d&apos;équipe :</strong></p>
                <ul>
                  <li><strong>Microsoft Teams :</strong> Connecteur webhook → Canal dédié SIG/Adressage</li>
                  <li><strong>Slack :</strong> Incoming Webhooks → Canal technique</li>
                  <li><strong>Mattermost :</strong> Webhook entrant → Équipe BAL</li>
                </ul>
              </div>
              <div className="fr-mb-3w">
                <h5>
                  <Badge severity="success" small>Test</Badge> Validation avec webhook.site
                </h5>
                <ol>
                  <li>Accédez à <a href="https://webhook.site" target="_blank" rel="noopener noreferrer">webhook.site</a></li>
                  <li>Copiez l&apos;URL endpoint générée</li>
                  <li>Saisissez cette URL dans le formulaire de création d&apos;abonnement</li>
                  <li>Sélectionnez vos communes à surveiller</li>
                  <li>Choisissez les types d&apos;alertes (erreurs, avertissements, succès)</li>
                </ol>
                <p className="fr-text--sm">
                  Permet de visualiser en temps réel les notifications reçues pour comprendre le format des données.
                </p>
              </div>

            </div>

            {/* Colonne droite - Cas d'usage */}
            <div className="fr-col-12 fr-col-md-6">
              <h4>Scénarios d&apos;usage</h4>

              <div className="fr-mb-2w fr-p-2w fr-background-contrast--grey">
                <h5>Service communal</h5>
                <p className="fr-text--sm">
                  <strong>Contexte :</strong> Gestion directe des BAL pour 50 communes<br />
                  <strong>Configuration :</strong> Webhook → Canal Teams "Adressage"<br />
                  <strong>Workflow :</strong> Alerte reçue → Agent vérifie la BAL → Correction → Republication<br />
                  <strong>Bénéfice :</strong> Résolution sous 24h au lieu de plusieurs semaines
                </p>
              </div>

              <div className="fr-mb-2w fr-p-2w fr-background-contrast--grey">
                <h5>Prestataire technique (GeoPal, etc.)</h5>
                <p className="fr-text--sm">
                  <strong>Contexte :</strong> Gestion BAL pour plusieurs collectivités clientes<br />
                  <strong>Configuration :</strong> Webhook → Système de tickets automatique<br />
                  <strong>Workflow :</strong> Problème détecté → Ticket créé → Technicien assigné → Correction client → Republication<br />
                  <strong>Bénéfice :</strong> Suivi proactif et amélioration de la qualité de service
                </p>
              </div>
            </div>
          </div>

          {/* Section technique en bas */}
          <div className="fr-mt-4w">
            <h4>Spécifications techniques</h4>

            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-6">
                <h5>Format des notifications</h5>
                <pre className="fr-background-contrast--grey fr-p-2w fr-text--xs">
                  {`{
 "type": "ban-alert",
 "status": "error",
 "commune": {
   "code": "76734",
   "nom": "Vergetot"
 },
 "revision": {
   "id": "A39HFQCTA",
   "publishedAt": "2024-09-09T11:23:00Z"
 },
 "message": "BAL bloquée - updateDate manquant",
 "timestamp": "2024-09-09T11:23:00Z"
}`}
                </pre>
              </div>

              <div className="fr-col-12 fr-col-md-6">
                <h5>Types d&apos;alertes</h5>
                <ul className="fr-mb-3w">
                  <li><Badge severity="error" small>ERREUR</Badge> BAL bloquée - Action requise</li>
                  <li><Badge severity="warning" small>AVERTISSEMENT</Badge> Problème détecté - BAL bientôt bloquée</li>
                  <li><Badge severity="success" small>SUCCÈS</Badge> BAL publiée avec succès</li>
                  <li><Badge severity="info" small>INFORMATION</Badge> Information sur le traitement</li>
                </ul>

                <h5>Prérequis techniques</h5>
                <ul>
                  <li>URL endpoint HTTPS et accessible publiquement</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </Accordion>
    </div>
  )
}
