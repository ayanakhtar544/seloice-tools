import type { ToolFAQ, ToolRecord } from './tools-registry';

const SITE = 'https://seloice.com';

export function buildSoftwareApplicationSchema(tool: ToolRecord) {
  return {
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: `${SITE}/tools/${tool.slug}`,
    operatingSystem: 'Web Browser',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: tool.features.join(', '),
  };
}

export function buildBreadcrumbSchema(tool: ToolRecord) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE}/tools` },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.shortTitle,
        item: `${SITE}/tools/${tool.slug}`,
      },
    ],
  };
}

export function buildFAQSchema(faqs: ToolFAQ[]) {
  if (!faqs.length) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function buildHowToSchema(tool: ToolRecord) {
  if (!tool.howToSteps.length) return null;
  return {
    '@type': 'HowTo',
    name: `How to use ${tool.name}`,
    description: tool.description,
    step: tool.howToSteps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.desc,
    })),
  };
}

export function buildWebPageSchema(tool: ToolRecord) {
  return {
    '@type': 'WebPage',
    '@id': `${SITE}/tools/${tool.slug}#webpage`,
    url: `${SITE}/tools/${tool.slug}`,
    name: tool.seoTitle,
    description: tool.metaDescription,
    isPartOf: { '@id': `${SITE}/#website` },
    about: { '@type': 'Thing', name: tool.primaryKeyword },
  };
}

export function buildToolJsonLd(tool: ToolRecord) {
  const graph = [
    buildWebPageSchema(tool),
    buildSoftwareApplicationSchema(tool),
    buildBreadcrumbSchema(tool),
    buildFAQSchema(tool.faqs),
    buildHowToSchema(tool),
  ].filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function buildWebSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: `${SITE}/`,
    name: 'Seloice Tools',
    description: 'Free AI creator tools — video editor, downloaders, captions & growth utilities.',
    publisher: { '@id': `${SITE}/#organization` },
  };
}

export function buildOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE}/#organization`,
    name: 'Seloice Tools',
    url: SITE,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE}/favicon.png`,
    },
  };
}

export function buildItemListSchema(tools: ToolRecord[], listName: string) {
  return {
    '@type': 'ItemList',
    name: listName,
    itemListElement: tools.map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: tool.name,
      url: `${SITE}/tools/${tool.slug}`,
    })),
  };
}
