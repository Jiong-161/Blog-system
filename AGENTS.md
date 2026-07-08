# Morandi Tech Blog - Agent 开发指南

## 项目概述

这是一个基于 **Astro 7 + Tailwind CSS v4** 构建的个人技术博客，采用莫兰迪配色 + 磨砂玻璃设计风格。

**核心特性：**

- 🎨 莫兰迪冷灰调配色系统 + 磨砂玻璃质感
- 🌊 Canvas 水波纹 & 樱花粒子特效
- 🖼️ 多模式壁纸背景（横幅/全屏/透明/纯色）
- ⚙️ 可自定义主题设置面板（本地存储持久化）
- 📝 Markdown 内容集合 + 分类/标签/归档
- 🌐 视图过渡动画（View Transitions）
- 📱 响应式设计，移动端友好

***

## 技术栈

| 类别   | 技术                                | 版本                |
| ---- | --------------------------------- | ----------------- |
| 框架   | Astro                             | ^7.0.6            |
| 样式   | Tailwind CSS                      | ^4.3.2 (v4 零配置模式) |
| 图标   | astro-icon + @iconify-json/lucide | ^1.1.5            |
| 图片处理 | sharp (astro:assets 内置)           | -                 |
| 语言   | TypeScript                        | strict 模式         |

***

## 项目结构

```
src/
├── assets/              # 静态资源（图片等，会被 Astro 优化）
│   ├── a1.jpg          # 壁纸 1
│   ├── a2.jpg          # 壁纸 2
│   ├── a3.jpg          # 壁纸 3
│   └── logo.jpg        # Logo
├── components/          # 可复用组件
│   ├── BlogCard.astro          # 博客卡片
│   ├── Footer.astro            # 页脚
│   ├── Header.astro            # 顶部导航
│   ├── SettingsPanel.astro     # 设置面板抽屉
│   └── WallpaperBackground.astro # 壁纸背景 + Canvas 特效
├── content/             # 内容集合
│   └── posts/           # 博客文章（Markdown）
├── layouts/             # 布局组件
│   └── Layout.astro     # 全局布局
├── lib/                 # 工具函数
│   ├── category-config.ts # 分类颜色配置
│   └── utils.ts         # 通用工具函数
├── pages/               # 页面路由（文件即路由）
│   ├── blog/
│   │   ├── [slug].astro # 文章详情页（动态路由）
│   │   └── index.astro  # 博客列表页
│   ├── about.astro      # 关于页
│   ├── archive.astro    # 归档页
│   ├── guestbook.astro  # 留言页
│   ├── index.astro      # 首页
│   └── stats.astro      # 统计页
├── styles/              # 全局样式
│   ├── animations.css   # 高级动画系统
│   └── global.css       # 全局样式 + 设计系统 Token
└── content.config.ts    # 内容集合配置
```

***

## 设计系统

### 配色（莫兰迪冷灰调）

在 [global.css](file:///g:/Users/blog/wretched-wavelength/src/styles/global.css#L4-L37) 中通过 `@theme` 定义：

| 变量名                    | 值         | 用途        |
| ---------------------- | --------- | --------- |
| `--color-primary`      | `#8AA1B1` | 主色调（灰蓝）   |
| `--color-accent-green` | `#A8B5A0` | 辅助色（莫兰迪绿） |
| `--color-accent-pink`  | `#C9A9A6` | 辅助色（莫兰迪粉） |
| `--color-bg-base`      | `#E8E4DE` | 页面底色      |
| `--color-bg-main`      | `#F5F2ED` | 内容区底色     |
| `--color-text-main`    | `#3D3A36` | 主要文字      |
| `--color-text-sub`     | `#7A756E` | 次要文字      |

### 磨砂玻璃

两种玻璃质感工具类：

- `.glass` - 半透明 + 20px 模糊（用于 Header/Footer）
- `.glass-card` - 更白更实 + 16px 模糊（用于卡片）

### 动画系统

在 [animations.css](file:///g:/Users/blog/wretched-wavelength/src/styles/animations.css) 中定义：

- `.reveal` - 基础淡入上移
- `.mask-reveal` - 横向遮罩扫入
- `.stagger-children` - 子元素依次入场
- `.section-intro` - 章节标题入场（英文字幕滑动 + 中文标题淡入）
- `.img-zoom-reveal` - 图片缩放揭示

所有动画支持 `prefers-reduced-motion: reduce` 无障碍适配。

***

## 核心组件说明

### WallpaperBackground.astro

壁纸背景 + Canvas 特效组件。包含：

- 3 张壁纸轮播（15 秒间隔，可配置开关）
- 水波纹 Canvas 动画（默认开启）
- 樱花粒子特效（默认关闭）
- 4 种壁纸模式：banner / fullscreen / transparent / solid
- 页面可见性 API：标签页不可见时自动暂停 Canvas 动画

**设置通过** **`localStorage`** **的** **`blog-settings`** **键持久化。**

### SettingsPanel.astro

右侧抽屉设置面板。通过自定义事件与其他组件通信：

- `setting-change` - 单个开关变化
- `wallpaper-change` - 壁纸模式/索引变化

### Header.astro

顶部导航，滚动超过 20px 时增强阴影和模糊。

***

## 内容集合

### 文章 Schema

在 [content.config.ts](file:///g:/Users/blog/wretched-wavelength/src/content.config.ts) 中定义：

```typescript
{
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  category: string;
  tags: string[];       // 默认 []
  draft: boolean;       // 默认 false
  coverImage?: string;  // 封面图 URL
}
```

### 分类颜色配置

在 [category-config.ts](file:///g:/Users/blog/wretched-wavelength/src/lib/category-config.ts) 中维护，添加新分类时需同步更新。

***

## 开发规范

### 开发服务器

**必须使用后台模式启动：**

```bash
astro dev --background
```

管理命令：

- `astro dev stop` - 停止
- `astro dev status` - 查看状态
- `astro dev logs` - 查看日志

### 常用命令

| 命令                | 说明      |
| ----------------- | ------- |
| `npm install`     | 安装依赖    |
| `npm run dev`     | 启动开发服务器 |
| `npm run build`   | 构建生产版本  |
| `npm run preview` | 预览构建结果  |

### 代码规范

1. **组件优先**：优先使用 Astro 组件（`.astro`），无需交互时不用 JS 框架
2. **样式**：优先使用 Tailwind 工具类，自定义样式放 `src/styles/`
3. **图片**：放在 `src/assets/` 目录下，使用 `astro:assets` 的 `getImage()` 或 `<Image />` 组件自动优化
4. **动画**：
   - 优先使用 CSS transform / opacity（GPU 加速）
   - 为动画元素合理使用 `will-change`
   - 必须适配 `prefers-reduced-motion`
5. **Canvas 动画**：
   - 必须实现 Page Visibility API 暂停机制
   - DPR 限制在 1.5 以内
   - 60fps 时间差过滤
6. **滚动监听**：
   - 优先使用 IntersectionObserver
   - 必须用 scroll 事件时加 rAF 节流
   - 添加 `{ passive: true }`
7. **无障碍**：
   - 图片必须有 alt 文本（装饰性用 `alt=""`）
   - 交互元素必须可键盘访问
   - 尊重系统的减少动画偏好

### 性能优化检查清单

修改代码后确认：

- [ ] 图片是否经过优化（WebP 格式、合理尺寸）
- [ ] Canvas 动画是否支持页面可见性暂停
- [ ] 滚动事件是否节流
- [ ] 动画是否使用 GPU 加速属性
- [ ] 是否引入了不必要的第三方库
- [ ] 首屏关键资源是否预加载

***

## 部署

- **部署平台**：Netlify（配置见 `netlify.toml`）
- **站点 URL**：[首页 | Morandi Tech Blog](https://jiongblog.netlify.app/)
- **构建命令**：`npm run build`
- **输出目录**：`dist/`

***

## 相关文档

- [Astro 官方文档](https://docs.astro.build)
- [Tailwind CSS v4 文档](https://tailwindcss.com/docs)
- [路由与动态页面](https://docs.astro.build/en/guides/routing/)
- [Astro 组件](https://docs.astro.build/en/basics/astro-components/)
- [内容集合](https://docs.astro.build/en/guides/content-collections/)
- [图片优化 (astro:assets)](https://docs.astro.build/en/guides/images/)
- [样式与 Tailwind](https://docs.astro.build/en/guides/styling/)
- [视图过渡](https://docs.astro.build/en/guides/view-transitions/)

