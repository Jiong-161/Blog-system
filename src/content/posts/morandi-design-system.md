---
title: "莫兰迪色系在前端设计系统中的实践"
description: "如何将莫兰迪色系系统化地融入前端设计系统？从色彩比例、对比度到组件映射，本文分享一套可落地的方案。"
pubDate: 2026-06-28
category: "设计系统"
tags: ["设计系统", "色彩", "CSS", "Tailwind"]
draft: false
---

## 为什么是莫兰迪色系？

莫兰迪色系以意大利画家乔治·莫兰迪命名，其核心特征是 **低饱和度、高明度、灰度调和**。这种配色在视觉上给人以宁静、治愈的感受。

## 设计 Token 的层次

在构建设计系统时，我们将色彩分为三个层次：

### 1. 语义色 (Semantic Colors)

`
primary    → 交互/导航 #8FAABE
secondary  → 卡片/背景  #F2E9DC
accent     → 高亮/状态  #A8B5A0 / #C9A9A6
`

### 2. 功能色 (Functional Colors)

- bg-main: 页面背景
- text-main: 正文
- text-sub: 次要文字

### 3. 状态色 (State Colors)

通过调整透明度实现 hover、active 等状态，而不是引入新的色值。

## Tailwind v4 中的实现

在 Tailwind v4 中，使用 @theme 指令定义自定义色板：

`css
@theme {
  --color-primary: #8FAABE;
  --color-secondary: #F2E9DC;
  --color-accent-green: #A8B5A0;
  --color-accent-pink: #C9A9A6;
}
`

## 可访问性考量

莫兰迪色系天然对比度较低，设计时需要注意：
- 正文与背景至少满足 WCAG AA 标准 (4.5:1)
- 使用更大的字号和字重补偿低对比度
- 不要仅靠颜色区分信息（辅以图标或文字）

## 结语

莫兰迪色系不是一种"偷懒的审美"，它需要精心计算灰度比例和色彩温度。用对了一套好色板，产品会说话。
