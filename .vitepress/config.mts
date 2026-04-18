import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Yanbwe's Wiki",
  description: '这里有Yanbwe的所有mod的指南',

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '仔细搜刮', link: '/scwiki/', activeMatch: '/scwiki' },
      { text: '稀有度核心', link: '/raritycore/', activeMatch: '/raritycore' }
    ],

    sidebar: [
      {
        text: '仔细搜刮',
        collapsed: false,
        items: [
          { text: '首页', link: '/scwiki/' },
          { text: '综合指南', link: '/scwiki/ComprehensiveGuide' },
          { text: '配置指南', link: '/scwiki/ConfigGuide' },
          { text: '资源包指南', link: '/scwiki/ResourcePackGuide' },
          { text: 'API', link: '/scwiki/API' }
        ]
      },
      {
        text: '稀有度核心',
        collapsed: false,
        items: [
          { text: '首页', link: '/raritycore/' },
          { text: '稀有度配置指南', link: '/raritycore/RarityConfiguration' },
          { text: '客户端配置', link: '/raritycore/ClientConfiguration' },
          { text: '服务端配置', link: '/raritycore/ServerConfiguration' },
          {
            text: '匹配配置',
            collapsed: false,
            items: [
              { text: 'NBT匹配', link: '/raritycore/matching-config/NBTMatching' },
              { text: '物品组件匹配', link: '/raritycore/matching-config/ItemComponentMatching' }
            ]
          },
          { text: 'API', link: '/raritycore/API' },
          { text: '兼容性问题', link: '/raritycore/Compatibility' },
          { text: '支持模组', link: '/raritycore/SupportedMods' }
        ]
      }
    ],

    editLink: {
      pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },

    footer: {
      message: '基于 MIT 许可发布',
      copyright: '版权所有 © 2019-至今 尤雨溪'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面导航'
    },

    lastUpdated: {
      text: '最后更新于'
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳转到内容'
  },

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/'
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/'
    }
  }
})