import Section from '../section'
import Button from '../button'

import theme from '../../styles/theme'

export default () => (
  <Section background='grey'>
    <form action='https://gouv.us15.list-manage.com/subscribe/post?u=f4e80584578b65fde5aadffb6&amp;id=d33ef3dd55' method='post'name='mc-embedded-subscribe-form' target='_blank' noValidate>
      <h2>Pour être informé des nouveautés, inscrivez-vous à notre newsletter :</h2>
      <input type='email' name='EMAIL' placeholder='Votre adresse email' />

      <Button type='' name='subscribe' style={{
        width: '100%',
        textTransform: 'uppercase'
      }}>
        Inscription
      </Button>
    </form>

    <style jsx>{`
      form {
        max-width: 640px;
        margin: auto;
      }

      h2 {
        margin: 0 auto 2em;
        max-width: 640px;
        font-size: 1.3em;
        font-style: italic;
        text-align: center;
        color: ${theme.secondaryDarken};
      }

      input {
        display: block;
        width: 100%;
        border: none;
        outline: none;
        padding: 16px 20px;
        font: inherit;
        line-height: 1.6;
        font-size: 1.3em;
        border-radius: 2px;
        margin-bottom: 1em;
      }
    `}</style>
  </Section>
)
