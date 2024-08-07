import type { StoryObj } from '@storybook/react'
import Section from './Section'

const meta = {
  title: 'Layout-Components/Section',
  component: Section,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    theme: {
      control: 'radio',
      options: [null, 'primary', 'secondary'],
      description: 'Thème graphique de la section. Cette propriété déterminera notamment la couleur de fond',
    },
    pageTitle: {
      control: 'text',
      description: 'Titre de la page (Il ne devrait y en avoir qu\'un seul par page)',
    },
    title: {
      control: 'text',
      description: 'Titre de la section',
    },
    classNameWrapper: {
      control: 'text',
      description: 'Classe CSS à ajouter au wrapper',
    },
    className: {
      control: 'text',
      description: 'Classe CSS à ajouter à la section',
    },
  },
  args: {
    children: (
      <div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Praesent maximus vel sapien ut rhoncus. Pellentesque congue
          erat non magna porta, nec sodales leo tempus. Vivamus sit
          amet faucibus justo. Mauris aliquam aliquet elit a rhoncus.
          Maecenas ex lorem, porttitor eu massa id, iaculis pharetra ipsum.
          Etiam vel pulvinar metus. Maecenas accumsan ac lectus at pulvinar.
          Pellentesque a sapien sed tellus varius imperdiet.
        </p>

        <p>Maecenas interdum sem nec dolor auctor tempor. Donec tincidunt lobortis
          elit, vel aliquet quam convallis sed. Aliquam ut vehicula neque.
          Aenean hendrerit molestie dui, ut pellentesque nisl vulputate at.
          Suspendisse egestas finibus fermentum. Proin vitae ultricies enim.
          Aliquam vel justo suscipit, vehicula nunc eget, maximus tellus. Suspendisse
          nec dolor dapibus, tristique mauris in, pellentesque sem. Donec a
          libero mollis, viverra risus non, laoreet neque.
        </p>
      </div>
    ),
    theme: undefined,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    pageTitle: 'Titre de la page',
    title: 'Titre de la section',
  },
}
