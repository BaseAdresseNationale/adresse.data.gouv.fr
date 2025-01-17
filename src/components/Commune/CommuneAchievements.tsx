'use client'

import styled from 'styled-components'
import ResponsiveImage from '../ResponsiveImage'
import Tooltip from '../Tooltip'

interface CommuneAchievementsProps {
  hasPublishedBAL: boolean
  certificationPercentage: number
  hasProcessedSignalement: boolean
  hasRegionalLanguage: boolean
  isPartner: boolean
}

const StyledWrapper = styled.div`
    margin: 2rem 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 1.6em;
`

const StyledAchievementBadge = styled.div`
  --size: 3.75em;
  --border-size: 0.35em;

  &.disabled {
    filter: opacity(0.5) grayscale(1);
  }

  &.green {
    --color-gradient-from: var(--background-contrast-success-hover);
    --color-gradient-to: var(--background-contrast-success);
    --color: var(--background-contrast-success-active);
    --color-contrast: var(--text-default-success);
  }

  position: relative;
  font-size: 1em;
  margin: 0em 1.6em;
  width: 100px;
  height: 100px;
  border-radius: 10px;
  display: inline-block;
  top: 0;
  background: linear-gradient(to bottom right, var(--color-gradient-from) 0%, var(--color-gradient-to) 100%);
  color: var(--color);

  &:before,
  &:after {
    position: absolute;
    width: inherit;
    height: inherit;
    border-radius: inherit;
    background: inherit;
    content: "";
    inset: 0;
    margin: auto;
  }

  &:before {
    transform: rotate(60deg);
  }

  &:after {
    transform: rotate(-60deg);
  }

  > img {
    position: absolute;
    z-index: 10;
  }
`

export function CommuneAchievements({ hasProcessedSignalement, hasPublishedBAL, hasRegionalLanguage, isPartner, certificationPercentage }: CommuneAchievementsProps) {
  const achievements = [
    {
      title: 'La commune a publié une Base Adresse Locale',
      icone: '/commune/achievements/published-bal.svg',
      achieved: hasPublishedBAL,
      required: true,
    }, {
      title: 'La Base Adresse Locale contient au moins 50% d\'adresses certifiées',
      icone: '/commune/achievements/50-certified.svg',
      achieved: certificationPercentage >= 50,
      required: true,
    }, {
      title: 'La Base Adresse Locale contient 100% d\'adresses certifiées',
      icone: '/commune/achievements/100-certified.svg',
      achieved: certificationPercentage === 100,
      required: true,
    }, {
      title: 'La commune a traité au moins un signalement',
      icone: '/commune/achievements/processed-signalement.svg',
      achieved: hasProcessedSignalement,
    }, {
      title: 'La Base Adresse de la commune contient au moins une langue régionale',
      icone: '/commune/achievements/regional-language.svg',
      achieved: hasRegionalLanguage,
    }, {
      title: 'La commune est partenaire de la charte',
      icone: '/commune/achievements/partner.svg',
      achieved: isPartner,
    },
  ]
  return (
    <StyledWrapper>
      {achievements.map(({ title, icone, achieved, required }) => (!achieved && !required)
        ? null
        : (
            <Tooltip key={title} message={<b>{title}</b>}>
              <StyledAchievementBadge className={`${achieved ? 'green' : 'disabled'}`}>
                <ResponsiveImage src={icone} alt={`Badge ${title}`} />
              </StyledAchievementBadge>
            </Tooltip>
          ))}
    </StyledWrapper>
  )
}
