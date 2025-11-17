'use client'

import { useCallback, useEffect, useState, useMemo, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { Pagination } from '@codegouvfr/react-dsfr/Pagination'
import Tag from '@codegouvfr/react-dsfr/Tag'

import BlogGrid from '@/components/BlogGrid'
import { getPosts, getTags } from '@/lib/blog'

import { TagsWrapper, TagWrapper } from './page.styled'

interface PostMeta {
  pagination?: {
    page: number
    limit: number
    pages: number
    total: number
  }
}

function BlogView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [allTags, setAllTags] = useState(new Set())
  const [highlightedPosts, setHighlightedPosts] = useState([])
  const [posts, setPosts] = useState([])
  const [meta, setMeta] = useState<PostMeta>({})
  const [loading, setLoading] = useState(false)
  const [intialLoading, setIntialLoading] = useState(true)

  const nbHighlightedPosts = 3
  const nbPost = 15
  const page: number = useMemo(() => Number(searchParams?.get('page') || 1), [searchParams])
  const tags: Set<string> = useMemo(() => new Set(decodeURI(searchParams?.get('tags') || '')?.split(',').filter(t => t).sort() || []), [searchParams])

  const getPageLink = useCallback(({ page, tags: _tags }: { page?: number, tags?: string[] }) => {
    const urlSearchParams = searchParams?.entries() as unknown as string[][]
    const linkSearchParams = new URLSearchParams(urlSearchParams)
    if (_tags) {
      if (_tags.length) {
        linkSearchParams.set('tags', _tags.filter(t => t).join(','))
      }
      else {
        linkSearchParams.delete('tags')
      }
    }

    if (page) {
      linkSearchParams.set('page', page.toString())
    }
    const link = `${pathname}?${linkSearchParams.toString()}`
    return link
  }, [searchParams, pathname])

  useEffect(() => {
    getPosts({
      limit: nbHighlightedPosts,
    }).then((data) => {
      setHighlightedPosts(data.posts)
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    getPosts({
      page,
      limit: nbPost,
      tags: tags.size ? [...tags].join(',') : undefined,
    }).then((data) => {
      setPosts(data.posts)
      setMeta(data.meta)
      setIntialLoading(false)
      setLoading(false)
    })
    getTags().then((tags) => {
      setAllTags(new Set(tags))
    })
  }, [page, tags])

  return (
    <>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <BlogGrid
<<<<<<< HEAD
        title="Le blog : Nos articles et témoignages"
=======
        title="Le blog : articles et témoignages"
>>>>>>> 12610c65 (Mise en valeur du terme Blog sur le site adresse)
        posts={highlightedPosts}
        nbPost={3}
        isVisible={page === 1 && !tags.size}
      />
      {/* </Suspense> */}

      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <BlogGrid
        title="Tous les articles"
        header={(
          <TagsWrapper>
            {allTags.size > 1 && (
              <TagWrapper>
                <Tag
                  nativeButtonProps={{
                    onClick: () => {
                      if (tags.size) {
                        const pageLink = getPageLink({ page: 1, tags: [] })
                        router.push(pageLink, { scroll: false })
                      }
                    },
                  }}
                  pressed={Boolean(!tags.size)}
                >
                  Tous les articles
                </Tag>
              </TagWrapper>
            )}
            {
              (Array.from(allTags) as { name: string, slug: string }[])
                .map(({ name, slug }) => (
                  <TagWrapper key={name}>
                    <Tag
                      nativeButtonProps={{
                        onClick: (...args) => {
                          const newTags = new Set(tags.has(slug)
                            ? [...tags].filter(tag => tag !== slug)
                            : [...tags, slug])
                          const pageLink = getPageLink({ page: 1, tags: [...newTags] })
                          router.push(pageLink, { scroll: true })
                        },
                      }}
                      pressed={tags.has(slug)}
                    >{name}
                    </Tag>
                  </TagWrapper>
                ))
            }
          </TagsWrapper>
        )}
        footer={(
          <>
            {meta.pagination && (
              <Pagination
                count={meta.pagination?.pages}
                defaultPage={meta.pagination?.page}
                getPageLinkProps={pageNumber => ({ href: getPageLink({ page: pageNumber }) })}
                showFirstLast
              />
            )}
          </>
        )}
        posts={
          posts && posts.length
            ? (posts.slice((!page || page === 1) && tags.size === 0 ? 3 : 0, nbPost))
            : undefined
        }
        isLoading={loading && !intialLoading}
      />
      {/* </Suspense> */}
    </>
  )
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <BlogView />
    </Suspense>
  )
}
