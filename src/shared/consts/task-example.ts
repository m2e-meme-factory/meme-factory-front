export interface Task {
  id: number;
  authorId: number;
  title: string;
  description: string; // Markdown string
  bannerUrl?: string;
  files?: {
    filename: string;
    url: string;
  }[];
  tags: string[];
  category: string;
  subtasks: {
    id: number;
    title: string;
    description: string;
    price: number;
  }[];
  price:
    | {
        min: number;
        max: number;
      }
    | number;
}

export const task: Task = {
  id: 1,
  authorId: 123,
  title: 'Design a Landing Page',
  description: `
    Requirements
    - Use the company's color palette
    - Include a call-to-action button
    - Showcase the product features with icons and images
    - Design should be responsive and mobile-friendly
    `,
  bannerUrl: 'https://example.com/path-to-banner-image.jpg',
  files: [
    {
      filename: 'logo.png',
      url: 'https://example.com/files/logo.png',
    },
    {
      filename: 'product-images.zip',
      url: 'https://example.com/files/product-images.zip',
    },
  ],
  tags: ['design', 'landing page', 'UI/UX'],
  category: 'Design',
  subtasks: [
    {
      id: 1,
      title: 'Create Wireframes',
      description:
        'Create low-fidelity wireframes to outline the basic structure of the landing page.',
      price: 50,
    },
    {
      id: 2,
      title: 'Design Mockups',
      description:
        'Design high-fidelity mockups in Figma, incorporating feedback from the wireframe stage.',
      price: 100,
    },
    {
      id: 3,
      title: 'Export Assets',
      description: 'Export all necessary assets (images, icons) and compile a style guide.',
      price: 50,
    },
  ],
  price: 200,
};
