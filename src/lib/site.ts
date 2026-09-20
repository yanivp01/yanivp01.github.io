export const NAV = [
  { label: 'Speaking', href: '/speaking' },
  { label: 'Teaching', href: '/teaching' },
  { label: 'Research', href: '/research' },
  { label: 'Essays', href: '/essays' },
  { label: 'Model', href: '/model' },
  { label: 'About', href: '/about' },
] as const;

export const SITE = {
  name: 'Dr. Yaniv Proselkov',
  shortName: 'Yaniv Proselkov',
  url: 'https://www.yapros.co.uk',
  email: 'yanivproselkov@gmail.com',
  mailto(subject: string) {
    return `mailto:${this.email}?subject=${encodeURIComponent(subject)}`;
  },
  linkedin: 'https://www.linkedin.com/in/yaniv-proselkov/',
  scholar: 'https://scholar.google.com/citations?user=ePHr-8wAAAAJ&hl=en',
  researchgate: 'https://www.researchgate.net/profile/Yaniv-Proselkov',
  defaultOgImage: '/pictures/yaniv standing.jpg',
  description:
    'Researcher, AI engineer and public speaker on how things spread through networks — money, risk, ideas — across AI, supply-chain finance and innovation ecosystems.',
} as const;

export const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE.url}/#person`,
      name: 'Yaniv Proselkov',
      givenName: 'Yaniv',
      familyName: 'Proselkov',
      honorificPrefix: 'Dr.',
      url: `${SITE.url}/`,
      image: `${SITE.url}${SITE.defaultOgImage}`,
      jobTitle: ['AI Engineer', 'Researcher', 'Public Speaker'],
      description: SITE.description,
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Cambridge', sameAs: 'https://www.cam.ac.uk/' },
      worksFor: [
        { '@type': 'Organization', name: 'AIOS' },
        { '@type': 'Organization', name: 'Global Cambridge' },
      ],
      knowsAbout: ['Artificial Intelligence', 'Supply Chain Finance', 'Venture Capital', 'Innovation Ecosystems', 'Distributed Systems', 'Network Science'],
      sameAs: [SITE.linkedin, SITE.scholar, SITE.researchgate],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: `${SITE.url}/`,
      name: SITE.name,
      publisher: { '@id': `${SITE.url}/#person` },
      inLanguage: 'en-GB',
    },
  ],
};
