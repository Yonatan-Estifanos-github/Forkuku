export interface JourneyItem {
  year: string;
  title: string;
  description: string;
  image?: string;
}

const CDN_BASE =
  'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui';

export const JOURNEY_DATA: JourneyItem[] = [
  {
    year: '2018',
    title: 'The First Hello',
    description:
      'A chance meeting that started it all. Coffee shops and shy smiles.',
    image: `${CDN_BASE}/engagement_photo_1.jpeg`,
  },
  {
    year: '2019',
    title: 'Building Bridges',
    description:
      'Long walks and endless conversations. We realized we shared the same dreams.',
  },
  {
    year: '2020',
    title: 'Growing Together',
    description:
      'Supporting each other through challenges and celebrating small wins.',
    image: `${CDN_BASE}/engagement_photo_2.jpeg`,
  },
  {
    year: '2021',
    title: 'The Adventure Begins',
    description:
      'Our first road trip together. Discovering new places and new parts of ourselves.',
  },
  {
    year: '2022',
    title: 'A Promise Made',
    description:
      'Understanding that this was forever. A quiet commitment in our hearts.',
    image: `${CDN_BASE}/engagement_photo_3.jpeg`,
  },
  {
    year: '2023',
    title: 'The Proposal',
    description:
      'Under a canopy of stars, he asked. With joy in her heart, she said yes.',
  },
  {
    year: '2024',
    title: 'Planning Our Future',
    description:
      'Dreaming of a home, a family, and a lifetime of serving God together.',
    image: `${CDN_BASE}/engagement_photo_4.jpeg`,
  },
  {
    year: '2026',
    title: 'The Wedding Day',
    description:
      'Two hearts become one. The beginning of our greatest chapter yet.',
  },
];
