import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const repoUrl = 'https://github.com/lauvivans/yoko';

const config: Config = {
  title: 'Yoko!',
  tagline:
    'Self-management for your recurring actions, events, tasks, notes and mood.',
  favicon: 'img/mascot.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  url: 'https://yoko-docs.arualvivan.com',
  baseUrl: '/',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'overview',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          editUrl: `${repoUrl}/tree/develop/docs/`,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'dev-docs',
        path: 'dev-docs',
        routeBasePath: 'dev-docs',
        editUrl: `${repoUrl}/tree/develop/docs/`,
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Yoko!',
      logo: {
        alt: 'Yoko! mascot',
        src: 'img/mascot.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        { to: '/dev-docs', label: 'Dev docs', position: 'left' },
        {
          href: 'https://yoko.arualvivan.com',
          label: 'App',
          position: 'right',
        },
        {
          href: repoUrl,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'What is Yoko', to: '/docs/intro' },
            { label: 'Dev docs', to: '/dev-docs' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'App', href: 'https://yoko.arualvivan.com' },
            { label: 'GitHub', href: repoUrl },
          ],
        },
      ],
      copyright: `Copyright © 2024–${new Date().getFullYear()} Laura Vivan Gonçalves. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
