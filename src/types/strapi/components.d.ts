import type { Schema, Attribute } from '@strapi/strapi'

export interface NavigationLink extends Schema.Component {
  collectionName: 'components_navigation_links'
  info: {
    displayName: 'Link'
    description: ''
  }
  attributes: {
    text: Attribute.String
    linkProps: Attribute.Component<'navigation.link-props'>
  }
}

export interface NavigationLinkProps extends Schema.Component {
  collectionName: 'components_navigation_link_props'
  info: {
    displayName: 'linkProps'
    description: ''
  }
  attributes: {
    target: Attribute.Enumeration<['_self', '_blank']> &
    Attribute.DefaultTo<'_self'>
    href: Attribute.String & Attribute.Required
  }
}

export interface BlocksImage extends Schema.Component {
  collectionName: 'components_blocks_images'
  info: {
    displayName: 'image'
  }
  attributes: {
    src: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>
  }
}

export interface BlocksIconCard extends Schema.Component {
  collectionName: 'components_blocks_icon_cards'
  info: {
    displayName: 'Icon card'
    description: ''
  }
  attributes: {
    icon: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>
    text: Attribute.String
    title: Attribute.String
  }
}

export interface BlocksButton extends Schema.Component {
  collectionName: 'components_blocks_buttons'
  info: {
    displayName: 'Button'
    description: ''
  }
  attributes: {
    text: Attribute.String
    linkProps: Attribute.Component<'navigation.link-props'>
    priority: Attribute.Enumeration<['primary', 'secondary', 'tertiary']>
  }
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'navigation.link': NavigationLink
      'navigation.link-props': NavigationLinkProps
      'blocks.image': BlocksImage
      'blocks.icon-card': BlocksIconCard
      'blocks.button': BlocksButton
    }
  }
}
