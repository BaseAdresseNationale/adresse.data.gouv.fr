import { join } from 'node:path'
import * as fs from 'node:fs/promises'
import { remark } from 'remark'
import remarkHeadingId from 'remark-heading-id'

import html from 'remark-html'
import matter from 'gray-matter'
import { env } from 'next-runtime-env'
const NODE_ENV = env('NODE_ENV')
const NEXT_PUBLIC_ADRESSE_URL = env('NEXT_PUBLIC_ADRESSE_URL')
// fix unknown property on matter.GrayMatterFile
// https://github.com/jonschlinkert/gray-matter/issues/160
interface GreyMatter extends matter.GrayMatterFile<string> {
  isEmpty?: boolean
}

export type DataType = {
  title?: string
  aside?: Array<{ data: { contentHtml: string, data: { title: string } } }>
}

export type MarkdownType = {
  fileName: string
  excerpt?: string
  contentHtml?: string
  data?: DataType
  isEmpty?: boolean
}

const extractMarkdown = async (
  fileContents: string,
  callback: (filename: string, host?: string | undefined) => Promise<{}>,
  filename: string,
  host?: string
): Promise<MarkdownType> => {
  const { content, data = {}, excerpt, isEmpty }: GreyMatter = matter(fileContents)

  const processedContent = await remark()
    .use(remarkHeadingId, { defaults: true, uniqueDefaults: true })
    .use(html)
    .process(content)
  const contentHtml = processedContent.toString()

  let aside
  if (!isEmpty && data?.aside) {
    try {
      const asideContent = data.aside.map(
        (aside: { filename: string | undefined }) => aside?.filename && callback(aside.filename, host)
      )
      aside = (await Promise.all(asideContent)).map((content, i) => ({ ...data.aside[i], data: content }))
    }
    catch (error) {
      if (NODE_ENV === 'development') console.error(error)
    }
  }

  return {
    fileName: filename,
    excerpt,
    contentHtml,
    data: { ...data, ...(aside ? { aside } : {}) },
    isEmpty,
  }
}

export async function getMarkdown(filename: string = 'sample') {
  'use server'

  try {
    const filePath = join(process.cwd(), 'public', 'markdown', `${filename}.md`)
    const fileContents = await fs.readFile(filePath, 'utf8')
    return extractMarkdown(fileContents, getMarkdown, filename)
  }
  catch (error) {
    if (NODE_ENV === 'development') console.error(error)
    return {}
  }
}

export async function fetchMarkdown(filename: string = 'sample', host = NEXT_PUBLIC_ADRESSE_URL) {
  try {
    const fileContents = await fetch(`${host}/markdown/${filename}.md`).then(response => response.text())
    return extractMarkdown(fileContents, fetchMarkdown, filename, host)
  }
  catch (error) {
    if (NODE_ENV === 'development') console.error(error)
    return {}
  }
}
