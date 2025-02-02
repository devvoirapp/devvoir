import { Metadata } from 'next'
import { defaultMetadata } from '../seo.config'
import { URL } from 'url'

interface PageMetadataProps {
  title?: string
  description?: string
  path?: string
}

export function generateMetadata({ 
  title, 
  description, 
  path = '' 
}: PageMetadataProps): Metadata {
  const pageTitle = title 
    ? `${title} | ${defaultMetadata.title}`
    : defaultMetadata.title

  const pageDescription = description || defaultMetadata.description
  const url = `${defaultMetadata.openGraph.url}${path}`

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: defaultMetadata.keywords,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: pageTitle,
      description: pageDescription,
      url,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: pageTitle,
      description: pageDescription,
    },
    alternates: {
      canonical: url,
    },
    metadataBase: new URL(defaultMetadata.openGraph.url),
  }
}
