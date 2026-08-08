import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/Yanbwe-Wiki/',
  title: "Yanbwe's Wiki",
  description: '这里有Yanbwe的所有mod的指南',

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '仔细搜刮', link: '/scwiki/', activeMatch: '/scwiki' },
      { text: '稀有度核心', link: '/raritycore/', activeMatch: '/raritycore' },
      { text: '灵动提示框', link: '/colorTooltips/', activeMatch: '/colorTooltips' },
      { text: '别样的伤害跳字', link: '/stylizeddamage/', activeMatch: '/stylizeddamage' },
      { text: '模块化射击', link: '/modularshoot/', activeMatch: '/modularshoot' },
      { text: '模块化射击弹药', link: '/modularshootammo/', activeMatch: '/modularshootammo' }
    ],

    sidebar: [
      {
        text: '仔细搜刮',
        collapsed: false,
        items: [
          { text: '首页', link: '/scwiki/' },
          { text: '综合指南', link: '/scwiki/ComprehensiveGuide' },
          { text: '配置指南', link: '/scwiki/ConfigGuide' },
          { text: '搜刮音效教学', link: '/scwiki/SearchProgressSoundGuide' },
          { text: '资源包指南', link: '/scwiki/ResourcePackGuide' },
          { text: 'API', link: '/scwiki/API' }
        ]
      },
      {
        text: '稀有度核心',
        collapsed: false,
        items: [
          { text: '首页', link: '/raritycore/' },
          { text: '稀有度配置指南', link: '/raritycore/how-to-config-rarity' },
          { text: 'RarityStyle 配置', link: '/raritycore/RarityStyleConfiguration' },
          { text: '客户端配置（旧版）', link: '/raritycore/old/ClientConfiguration' },
          { text: '客户端稀有度配置（旧版）', link: '/raritycore/old/RarityClientConfig' },
          { text: '服务端配置', link: '/raritycore/ServerConfiguration' },
          { text: 'NBT稀有度控制', link: '/raritycore/NbtRarityControl' },
          { text: '组件稀有度控制 (1.21.1)', link: '/raritycore/ComponentRarityControl' },
          { text: 'KubeJS接口', link: '/raritycore/KubeJS' },
          {
            text: '匹配配置',
            collapsed: false,
            items: [
              { text: 'NBT匹配', link: '/raritycore/matching-config/NBTMatching' },
              { text: '物品组件匹配', link: '/raritycore/matching-config/ItemComponentMatching' }
            ]
          },
          {
            text: 'API',
            collapsed: false,
            items: [
              { text: 'API 1.20.1', link: '/raritycore/API/API1201' },
              { text: 'API 1.20.1（旧版）', link: '/raritycore/API/old/API1201' },
              { text: 'API 1.21.1', link: '/raritycore/API/API1211' }
            ]
          },
          { text: '兼容性问题', link: '/raritycore/Compatibility' },
          { text: '命令参考', link: '/raritycore/CommandReference' }
        ]
      },
      {
        text: '灵动提示框',
        collapsed: false,
        items: [
          { text: '首页', link: '/colorTooltips/' },
          { text: '配置指南', link: '/colorTooltips/ConfigGuide' },
          { text: '样式编写指南', link: '/colorTooltips/StyleGuide' }
        ]
      },
      {
        text: '别样的伤害跳字',
        collapsed: false,
        items: [
          { text: '首页', link: '/stylizeddamage/' },
          { text: '配置文件说明', link: '/stylizeddamage/Configuration' },
          { text: '样式文件说明', link: '/stylizeddamage/StyleConfiguration' },
          { text: '动画配置指南', link: '/stylizeddamage/AnimationGuide' },
          { text: '命令参考', link: '/stylizeddamage/CommandReference' },
          { text: 'API 使用说明', link: '/stylizeddamage/API' }
        ]
      },
      {
        text: '模块化射击',
        collapsed: false,
        items: [
          { text: '首页', link: '/modularshoot/' },
          { text: 'API 参考', link: '/modularshoot/API' },
          { text: '注册指南', link: '/modularshoot/Registry' },
          { text: '数据包格式', link: '/modularshoot/DataPack' },
          { text: '命令参考', link: '/modularshoot/CommandReference' },
          { text: '代码示例', link: '/modularshoot/Examples' }
        ]
      },
      {
        text: '模块化射击弹药',
        collapsed: false,
        items: [
          { text: '首页', link: '/modularshootammo/' },
          { text: '数据包注册', link: '/modularshootammo/DataPack' },
          { text: 'API 参考', link: '/modularshootammo/API' },
          { text: '命令参考', link: '/modularshootammo/CommandReference' },
          { text: '客户端配置', link: '/modularshootammo/Configuration' }
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
    skipToContentLabel: '跳转到内容',

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    }
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
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'SearchCarefully', link: '/en/scwiki/', activeMatch: '/en/scwiki' },
          { text: 'RarityCore', link: '/en/raritycore/', activeMatch: '/en/raritycore' },
          { text: 'ColorTooltips', link: '/en/colorTooltips/', activeMatch: '/en/colorTooltips' },
          { text: 'StylizedDamage', link: '/en/stylizeddamage/', activeMatch: '/en/stylizeddamage' },
          { text: 'ModularShoot', link: '/en/modularshoot/', activeMatch: '/en/modularshoot' },
          { text: 'ModularShootAmmo', link: '/en/modularshootammo/', activeMatch: '/en/modularshootammo' }
        ],

        sidebar: [
          {
            text: 'SearchCarefully',
            collapsed: false,
            items: [
              { text: 'Home', link: '/en/scwiki/' },
              { text: 'Comprehensive Guide', link: '/en/scwiki/ComprehensiveGuide' },
              { text: 'Config Guide', link: '/en/scwiki/ConfigGuide' },
              { text: 'Search Sound Guide', link: '/en/scwiki/SearchProgressSoundGuide' },
              { text: 'Resource Pack Guide', link: '/en/scwiki/ResourcePackGuide' },
              { text: 'API', link: '/en/scwiki/API' }
            ]
          },
          {
            text: 'RarityCore',
            collapsed: false,
            items: [
              { text: 'Home', link: '/en/raritycore/' },
              { text: 'Rarity Configuration', link: '/en/raritycore/how-to-config-rarity' },
              { text: 'RarityStyle Configuration', link: '/en/raritycore/RarityStyleConfiguration' },
              { text: 'Client Configuration (Legacy)', link: '/en/raritycore/old/ClientConfiguration' },
              { text: 'Client Rarity Config (Legacy)', link: '/en/raritycore/old/RarityClientConfig' },
              { text: 'Server Configuration', link: '/en/raritycore/ServerConfiguration' },
              { text: 'NBT Rarity Control', link: '/en/raritycore/NbtRarityControl' },
              { text: 'Component Rarity Control (1.21.1)', link: '/en/raritycore/ComponentRarityControl' },
              { text: 'KubeJS Integration', link: '/en/raritycore/KubeJS' },
              {
                text: 'Matching Configuration',
                collapsed: false,
                items: [
                  { text: 'NBT Matching', link: '/en/raritycore/matching-config/NBTMatching' },
                  { text: 'Item Component Matching', link: '/en/raritycore/matching-config/ItemComponentMatching' }
                ]
              },
              {
                text: 'API',
                collapsed: false,
                items: [
                  { text: 'API 1.20.1', link: '/en/raritycore/API/API1201' },
                  { text: 'API 1.20.1 (Legacy)', link: '/en/raritycore/API/old/API1201' },
                  { text: 'API 1.21.1', link: '/en/raritycore/API/API1211' }
                ]
              },
              { text: 'Compatibility', link: '/en/raritycore/Compatibility' },
              { text: 'Command Reference', link: '/en/raritycore/CommandReference' }
            ]
          },
          {
            text: 'ColorTooltips',
            collapsed: false,
            items: [
              { text: 'Home', link: '/en/colorTooltips/' },
              { text: 'Config Guide', link: '/en/colorTooltips/ConfigGuide' },
              { text: 'Style Guide', link: '/en/colorTooltips/StyleGuide' }
            ]
          },
          {
            text: 'StylizedDamage',
            collapsed: false,
            items: [
              { text: 'Home', link: '/en/stylizeddamage/' },
              { text: 'Configuration', link: '/en/stylizeddamage/Configuration' },
              { text: 'Style Configuration', link: '/en/stylizeddamage/StyleConfiguration' },
              { text: 'Animation Guide', link: '/en/stylizeddamage/AnimationGuide' },
              { text: 'Command Reference', link: '/en/stylizeddamage/CommandReference' },
              { text: 'API Reference', link: '/en/stylizeddamage/API' }
            ]
          },
          {
            text: 'ModularShoot',
            collapsed: false,
            items: [
              { text: 'Home', link: '/en/modularshoot/' },
              { text: 'API Reference', link: '/en/modularshoot/API' },
              { text: 'Registry Guide', link: '/en/modularshoot/Registry' },
              { text: 'Datapack Format', link: '/en/modularshoot/DataPack' },
              { text: 'Command Reference', link: '/en/modularshoot/CommandReference' },
              { text: 'Code Examples', link: '/en/modularshoot/Examples' }
            ]
          },
          {
            text: 'ModularShootAmmo',
            collapsed: false,
            items: [
              { text: 'Home', link: '/en/modularshootammo/' },
              { text: 'Data Pack Registration', link: '/en/modularshootammo/DataPack' },
              { text: 'API Reference', link: '/en/modularshootammo/API' },
              { text: 'Command Reference', link: '/en/modularshootammo/CommandReference' },
              { text: 'Client Configuration', link: '/en/modularshootammo/Configuration' }
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
        skipToContentLabel: 'Skip to content',

        search: {
          provider: 'local',
          options: {
            locales: {
              en: {
                translations: {
                  button: {
                    buttonText: 'Search docs',
                    buttonAriaLabel: 'Search docs'
                  },
                  modal: {
                    noResultsText: 'No results found',
                    resetButtonTitle: 'Clear search query',
                    footer: {
                      selectText: 'select',
                      navigateText: 'navigate',
                      closeText: 'close'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
})