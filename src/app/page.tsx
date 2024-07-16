import Section from '@/components/Section'

export default function Home() {
  return (
    <>
      <Section pageTitle="Page Title" color="primary">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
          malesuada consectetur turpis eu sodales. Donec fringilla odio a justo
          maximus ornare. Vivamus pellentesque nisl vitae mi pretium lacinia.
          Vestibulum tincidunt enim eu scelerisque viverra. Quisque sagittis
          nunc risus, nec venenatis est fringilla vitae. Ut feugiat velit
          bibendum ullamcorper aliquet. Maecenas augue quam, suscipit ut finibus
          eu, dictum a erat. Cras blandit, ante nec congue aliquet, sem diam
          euismod magna, eget efficitur purus dui sed tellus. Vestibulum finibus
          ullamcorper dui. Aliquam erat volutpat. Quisque a accumsan magna, eu
          facilisis dui.
        </p>
        <p>
          Sed eleifend quam mi, laoreet eleifend metus maximus eu. Nunc tempus
          facilisis pretium. Vivamus eget nisi sit amet purus condimentum
          posuere quis in nibh. Proin commodo elementum arcu, ac volutpat nisl
          posuere quis. Sed accumsan nulla mi. Cras dolor purus, ultricies sed
          sollicitudin ac, ultrices vel tellus. Proin molestie sem enim, in
          fermentum nisi aliquam eget. Vivamus quis quam augue. Phasellus luctus
          sollicitudin nisi, vitae luctus risus faucibus a. Cras cursus a lectus
          sit amet finibus. Aliquam venenatis ullamcorper scelerisque. Lorem
          ipsum dolor sit amet, consectetur adipiscing elit. In viverra lacus
          vel mi aliquam, eget porta eros suscipit. Nulla a ante tincidunt,
          imperdiet ex molestie, imperdiet augue.
        </p>
      </Section>
      <Section title="Section Title A">Some content A</Section>
      <Section title="Section Title B" color="secondary">
        Some content B
      </Section>
      <Section title="Section Title C">Some content C</Section>
    </>
  )
}
