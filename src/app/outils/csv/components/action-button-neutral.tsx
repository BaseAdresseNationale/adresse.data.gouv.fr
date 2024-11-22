import colors from '@/theme'
import Button from '@codegouvfr/react-dsfr/Button'

interface ActionButtonNeutralPropTypes {
  children: React.ReactNode
  label: string
  isFullSize: boolean
  [key: string]: any
}

export default function ActionButtonNeutral({ children, label, isFullSize = false, ...props }: ActionButtonNeutralPropTypes) {
  return (
    <Button aria-label={label} {...props}>
      {children}

      <style jsx>{`
        button {
          width: ${isFullSize ? '100%' : 'fit-content'};
          height: fit-content;
          border: none;
          background: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          color: ${colors.colors.grey.border};
        }

        button:disabled {
          opacity: 50%;
          cursor: not-allowed;
        }
      `}
      </style>
    </Button>
  )
}
