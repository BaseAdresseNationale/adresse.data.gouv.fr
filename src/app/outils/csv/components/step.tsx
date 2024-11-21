import theme from '@/theme/theme'

interface StepPropTypes {
  title: string
  children: React.ReactNode
}

export default Step
function Step({ title, children = null }: StepPropTypes) {
  return (
    <div style={{ margin: '1em 0' }}>
      <h2 className={`${children ? '' : 'disabled'}`}>{title}</h2>
      {children}
      <style jsx>{`
        .disabled {
          color: ${theme.colors.grey};
        }
      `}
      </style>
    </div>
  )
}
