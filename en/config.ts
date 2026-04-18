import { defineAdditionalConfig, type DefaultTheme } from 'vitepress'

export default defineAdditionalConfig({
  description: 'All mods documentation by Yanbwe',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/en/' },
      { text: 'SearchCarefully', link: '/en/scwiki/', activeMatch: '/en/scwiki' },
      { text: 'RarityCore', link: '/en/raritycore/', activeMatch: '/en/raritycore' }
    ],

    sidebar: [
      {
        text: 'SearchCarefully',
        collapsed: false,
        items: [
          { text: 'Home', link: '/en/scwiki/' },
          { text: 'Comprehensive Guide', link: '/en/scwiki/ComprehensiveGuide' },
          { text: 'Config Guide', link: '/en/scwiki/ConfigGuide' },
          { text: 'Resource Pack Guide', link: '/en/scwiki/ResourcePackGuide' },
          { text: 'API', link: '/en/scwiki/API' }
        ]
      },
      {
        text: 'RarityCore',
        collapsed: false,
        items: [
          { text: 'Home', link: '/en/raritycore/' },
          { text: 'Rarity Configuration', link: '/en/raritycore/RarityConfiguration' },
          { text: 'Client Configuration', link: '/en/raritycore/ClientConfiguration' },
          { text: 'Server Configuration', link: '/en/raritycore/ServerConfiguration' },
          {
            text: 'Matching Configuration',
            collapsed: false,
            items: [
              { text: 'NBT Matching', link: '/en/raritycore/matching-config/NBTMatching' },
              { text: 'Item Component Matching', link: '/en/raritycore/matching-config/ItemComponentMatching' }
            ]
          },
          { text: 'API', link: '/en/raritycore/API' },
          { text: 'Compatibility', link: '/en/raritycore/Compatibility' },
          { text: 'Supported Mods', link: '/en/raritycore/SupportedMods' }
        ]
      }
    ],

    editLink: {
      pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      message: 'Released under the MIT License',
      copyright: 'Copyright © 2019-present Evan You'
    },

    docFooter: {
      prev: 'Previous page',
      next: 'Next page'
    },

    outline: {
      label: 'On this page'
    },

    lastUpdated: {
      text: 'Last updated'
    },

    langMenuLabel: 'Languages',
    returnToTopLabel: 'Return to top',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Theme',
    lightModeSwitchTitle: 'Switch to light mode',
    darkModeSwitchTitle: 'Switch to dark mode',
    skipToContentLabel: 'Skip to content'
  }
})