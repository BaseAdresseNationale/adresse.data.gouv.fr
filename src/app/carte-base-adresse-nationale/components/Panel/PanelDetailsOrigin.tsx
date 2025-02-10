import { PanelDetailsItemWithDesc } from './PanelDetailsItemWithDesc'

interface ConfigEntryValue {
  className: string
  message: React.ReactNode
  desc: React.ReactNode
}

type ConfigEntryKey = string
type ConfigOrigin = Record<ConfigEntryKey, ConfigEntryValue>
interface DistrictDetailsOriginProps extends React.HTMLAttributes<HTMLLIElement> {
  config: ConfigOrigin
  origin: ConfigEntryKey
}

export const PanelDetailsOrigin = ({ config, origin, className, ...props }: DistrictDetailsOriginProps) => {
  const configOrigin = config[origin] || config.default
  return (
    configOrigin
    && (
      <PanelDetailsItemWithDesc
        {...props}
        message={configOrigin.message}
        desc={configOrigin.desc}
        className={
          `${configOrigin.className} `
          + `isIsolated `
          + `${className}`
        }
      />
    )
  )
}
