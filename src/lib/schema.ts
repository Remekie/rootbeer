/*
  Builds the JSON-LD @graph from the same data the page renders.
  Product, Recipe (per cocktail) and FAQPage are all present and cross-linked.
*/
import { site, product, recipes, faqs } from './site';

const abs = (path: string) => new URL(path, site.url).href;

const orgId = `${site.url}/#org`;
const productId = `${site.url}/#product`;

export function buildGraph() {
  const organization = {
    '@type': 'Organization',
    '@id': orgId,
    name: site.legalName,
    url: site.parentSite,
    logo: {
      '@type': 'ImageObject',
      url: abs('/logo.png'),
      width: 900,
      height: 268,
    },
    sameAs: [site.social.instagram],
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: site.url,
    name: site.name,
    description: site.description,
    publisher: { '@id': orgId },
    inLanguage: 'en',
  };

  const productNode = {
    '@type': 'Product',
    '@id': productId,
    name: site.name,
    brand: { '@type': 'Brand', name: site.brand },
    category: product.category,
    description: site.description,
    image: abs('/og-image.png'),
    url: site.url,
    countryOfOrigin: 'CA',
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Alcohol by volume', value: `${product.abvValue}%` },
      { '@type': 'PropertyValue', name: 'Volume', value: product.volume },
      { '@type': 'PropertyValue', name: 'Botanical', value: product.botanical },
    ],
  };

  const recipeNodes = recipes.map((r) => ({
    '@type': 'Recipe',
    '@id': `${site.url}/#recipe-${r.slug}`,
    name: r.name,
    description: r.blurb,
    image: abs(`/recipes/${r.slug}.png`),
    author: { '@id': orgId },
    recipeCategory: 'Cocktail',
    recipeCuisine: 'Cocktail',
    recipeYield: r.yield,
    keywords: `root beer vodka, ${r.name}, Zyra Root Beer Rush`,
    recipeIngredient: r.ingredients.map((i) => `${i.amount} ${i.item}`.trim()),
    recipeInstructions: r.steps.map((text, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text,
    })),
    isBasedOn: { '@id': productId },
  }));

  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${site.url}/#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [website, organization, productNode, ...recipeNodes, faqPage],
  };
}
