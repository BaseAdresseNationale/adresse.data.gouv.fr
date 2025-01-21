'use client'

import styled from 'styled-components'
import ResponsiveImage from '../ResponsiveImage'
import Tooltip from '../Tooltip'
import { CommuneAchievements as CommuneAchievementsType } from '@/lib/commune'

const StyledWrapper = styled.div<{ $isMini?: boolean }>`
    margin: ${({ $isMini }) => $isMini ? '1rem 0' : '2em 0'};
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: ${({ $isMini }) => $isMini ? '0.8rem' : '1.6rem'};
`

const StyledAchievementBadge = styled.div<{ $isMini?: boolean }>`
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
  margin: ${({ $isMini }) => $isMini ? '0' : '0 1.6em'};
  width: ${({ $isMini }) => $isMini ? '32px' : '100px'};
  height: ${({ $isMini }) => $isMini ? '32px' : '100px'};
  border-radius: ${({ $isMini }) => $isMini ? '2px' : '10px'};
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

interface CommuneAchievementsProps {
  isMini?: boolean
  achievements: CommuneAchievementsType
}

export function CommuneAchievements({ isMini, achievements: { hasProcessedSignalement, hasPublishedBAL, hasRegionalLanguage, has100PercentCertifiedNumbers, hasAbove50PercentCertifiedNumbers, isPartenaireDeLaCharte, hasStableID } }: CommuneAchievementsProps) {
  const achievements = [
    {
      title: 'La commune a publié une Base Adresse Locale',
      icone: '/commune/achievements/published-bal.svg',
      achieved: hasPublishedBAL,
      required: true,
    },
    {
      title: 'La Base Adresse Locale contient au moins 50% d\'adresses certifiées',
      icone: '/commune/achievements/50-certified.svg',
      achieved: hasAbove50PercentCertifiedNumbers,
      required: true,
    },
    {
      title: 'La Base Adresse Locale contient 100% d\'adresses certifiées',
      icone: '/commune/achievements/100-certified.svg',
      achieved: has100PercentCertifiedNumbers,
      required: true,
    },
    {
      title: 'La Base Adresse Locale contient des identifiants stables',
      icone: '/commune/achievements/fiabilite.svg',
      achieved: hasStableID,
      required: true,
    },
    {
      title: 'La commune a traité au moins un signalement',
      icone: '/commune/achievements/processed-signalement.svg',
      achieved: hasProcessedSignalement,
    },
    {
      title: 'La Base Adresse de la commune contient au moins une langue régionale',
      icone: '/commune/achievements/regional-language.svg',
      achieved: hasRegionalLanguage,
    },
    {
      title: 'La commune est partenaire de la charte',
      icone: '/commune/achievements/partner.svg',
      achieved: isPartenaireDeLaCharte,
    },
  ]
  return (
    <StyledWrapper $isMini={isMini}>
      {achievements.map(({ title, icone, achieved, required }) => (!achieved && !required)
        ? null
        : (
            <Tooltip key={title} message={<b>{title}</b>}>
              <StyledAchievementBadge $isMini={isMini} className={`${achieved ? 'green' : 'disabled'}`}>
                <ResponsiveImage src={icone} alt={`Badge ${title}`} />
              </StyledAchievementBadge>
            </Tooltip>
          ))}
    </StyledWrapper>
  )
}
