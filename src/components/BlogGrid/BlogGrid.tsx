'use client'

import { ReactNode } from 'react'

import Section from '@/components/Section'
import BlogCard, { PostItem } from '@/components/BlogCard'

import { BlogGridFooter, CardWrapper } from './BlogGrid.styles'

interface BlogGridProps {
  title?: string
  header?: ReactNode
  footer?: ReactNode
  posts?: PostItem[]
  nbPost?: number
  isLoading?: boolean
  isVisible?: boolean
}

function BlogGrid({ title, header, footer, posts, nbPost, isLoading, isVisible }: BlogGridProps) {
  const loading = posts && posts.length ? false : (isLoading ?? true)

  return (
    <Section title={title} isVisible={isVisible}>
      {header}

      <CardWrapper $loading={loading}>
        {
          !posts || loading
            ? 'Chargement en cours...'
            : posts.slice(0, nbPost).map(post =>
              <BlogCard key={post.title} post={post} />
            )
        }
      </CardWrapper>

      {footer && (
        <BlogGridFooter>{footer}</BlogGridFooter>
      )}
    </Section>
  )
}

export default BlogGrid
