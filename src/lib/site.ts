/*
  Single source of truth for rootbeervodka.com.
  Visible HTML and JSON-LD both render from this file so the crawlable copy and
  the structured data can never drift apart.
*/

export const site = {
  name: 'Zyra Root Beer Rush',
  brand: 'Zyra',
  legalName: 'Zyra Spirits',
  domain: 'rootbeervodka.com',
  url: 'https://rootbeervodka.com',
  handle: '@drinkzyra',
  parentSite: 'https://drinkzyra.com',
  social: {
    instagram: 'https://www.instagram.com/drinkzyra',
  },
  tagline: 'Pour Bold. Live Bright.',
  title: 'Root Beer Vodka | Zyra Root Beer Rush: All-Natural, Alberta-Made',
  description:
    'Zyra Root Beer Rush is the only all-natural root beer vodka made in North America. Distilled in Alberta with real sarsaparilla at 30% ABV. Nostalgic, creamy, not too sweet.',
} as const;

// Hard product facts — the proof strip and Product schema both read these.
export const product = {
  category: 'All-natural root beer infused vodka',
  abv: '30% ABV',
  abvValue: 30,
  volume: '750 mL',
  origin: 'Alberta, Canada',
  botanical: 'Real sarsaparilla',
} as const;

// Short, quotable, factual lines written to be lifted verbatim by AI answer engines.
export const quotables = [
  'Zyra Root Beer Rush is the only all-natural root beer vodka made in North America, distilled in Alberta at 30% ABV.',
  'It is made with real sarsaparilla, the root behind classic root beer flavour, not artificial syrup.',
  'The taste is nostalgic sarsaparilla and creamy vanilla, smooth and not too sweet.',
] as const;

export type Recipe = {
  slug: string;
  name: string;
  index: string;
  blurb: string;
  yield: string;
  glassware: string;
  ingredients: { amount: string; item: string }[];
  steps: string[];
  imageKey: 'mule' | 'float';
};

// Recipes copied verbatim from the Zyra Recipe Card Kit so the site matches print.
export const recipes: Recipe[] = [
  {
    slug: 'zyra-mule',
    name: 'Zyra Mule',
    index: 'N° 05',
    blurb:
      'The mule, rebuilt on root beer. Lime and ginger beer cut the sarsaparilla into something crisp and long. The easiest way in for a first pour.',
    yield: '1 cocktail',
    glassware: 'Copper mug',
    ingredients: [
      { amount: '2 oz', item: 'Zyra Root Beer Rush vodka' },
      { amount: '½ oz', item: 'Freshly squeezed lime juice' },
      { amount: '3–4 oz', item: 'Ginger beer, chilled' },
      { amount: 'Garnish', item: 'Lime wheel & fresh mint' },
    ],
    steps: [
      'Fill a copper mug with ice.',
      'Add the vodka and lime juice, then top with ginger beer and stir gently.',
      'Garnish with a lime wheel and a sprig of mint.',
    ],
    imageKey: 'mule',
  },
  {
    slug: 'root-beer-float-martini',
    name: 'Root Beer Float Martini',
    index: 'N° 06',
    blurb:
      'The float, grown up. Cream and a little sugar pull the vanilla forward. Dessert in a coupe, the drink people ask for by name.',
    yield: '1 cocktail',
    glassware: 'Chilled coupe',
    ingredients: [
      { amount: '2 oz', item: 'Zyra Root Beer Rush vodka' },
      { amount: '1 oz', item: 'Cream' },
      { amount: '½ oz', item: 'Simple syrup' },
      { amount: 'Garnish', item: 'Cream float or a small scoop of vanilla ice cream' },
    ],
    steps: [
      'Shake the vodka, cream and simple syrup hard with ice.',
      'Strain into a chilled coupe.',
      'Finish with a float of cream, or a small scoop of vanilla ice cream.',
    ],
    imageKey: 'float',
  },
];

export type Serve = { name: string; how: string };

// Casual, no-recipe ways to drink it. Sits above the two cocktails.
export const serves: Serve[] = [
  {
    name: 'Over ice',
    how: 'Two ounces over one big cube. Sarsaparilla and creamy vanilla, nothing in the way.',
  },
  {
    name: 'With soda',
    how: 'Top with chilled soda water and a squeeze of lime. Long, light, and easy on a warm night.',
  },
  {
    name: 'With cola',
    how: 'Build over ice and top with cola for an easy nod to the classic root beer float.',
  },
];

export type OtherProduct = {
  name: string;
  descriptor: string;
  note: string;
  imageKey: 'cocomist' | 'zyragold';
  href: string;
};

export const otherProducts: OtherProduct[] = [
  {
    name: 'Coco Mist',
    descriptor: 'All-natural pineapple & coconut infused vodka · 23% ABV',
    note: 'Pineapple and coconut cream, the way a good colada tastes. The warm-weather sibling to the Rush.',
    imageKey: 'cocomist',
    href: site.parentSite,
  },
  {
    name: 'Zyra Gold',
    descriptor: '30× distilled, ultra-filtered vodka · 40% ABV',
    note: 'The clean, high-proof base of the range. Built for a proper martini and stirred classics.',
    imageKey: 'zyragold',
    href: site.parentSite,
  },
];

export type Faq = { q: string; a: string };

// Natural-language questions people (and AI) actually ask, answered factually.
export const faqs: Faq[] = [
  {
    q: 'Is there real root beer in it?',
    a: 'It is infused with real sarsaparilla, the root that gives classic root beer its flavour, rather than artificial root beer syrup. That is what makes it taste nostalgic instead of candied.',
  },
  {
    q: 'Is root beer vodka sweet?',
    a: 'No. Zyra Root Beer Rush reads as smooth and not too sweet. You get creamy vanilla and sarsaparilla on the nose and a clean finish, closer to a craft spirit than a liqueur.',
  },
  {
    q: 'What is the ABV of Zyra Root Beer Rush?',
    a: 'It is bottled at 30% ABV (60 proof) in a 750 mL bottle.',
  },
  {
    q: 'Is it all-natural and gluten-free?',
    a: 'Yes. It is all-natural with no artificial flavours, and it is the only all-natural root beer vodka made in North America. The base vodka is distilled in Alberta.',
  },
  {
    q: 'What do you mix root beer vodka with?',
    a: 'Ginger beer and lime for a Zyra Mule, or cream and simple syrup for a Root Beer Float Martini. It also works over ice with cola, cream soda, or a splash of soda water.',
  },
  {
    q: 'Where can I buy root beer vodka?',
    a: 'Zyra Root Beer Rush is made in Alberta and sold at select retailers. Sign up below and we will tell you the moment it is stocked near you.',
  },
];
