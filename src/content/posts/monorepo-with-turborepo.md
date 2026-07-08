---
title: "从零搭建 Monorepo：Turborepo 与 pnpm 实践"
description: "为什么选择 Monorepo？如何用 pnpm workspace + Turborepo 搭建一个可维护的前端 Monorepo 项目。"
pubDate: 2026-06-12
category: "其他"
tags: ["Monorepo", "Turborepo", "pnpm", "工程化"]
draft: false
---

## Monorepo 的利与弊

### 优势
- 代码共享：类型定义、工具函数、UI 组件可在多个项目间复用
- 统一脚本：一次配置，全局生效
- 原子提交：跨包改动在一个 PR 中完成

### 挑战
- 权限管理
- 构建编排
- 仓库膨胀

## 技术选型

`
pnpm workspace  → 包管理 + 依赖链接
Turborepo       → 构建编排 + 缓存
Changesets      → 版本管理与发布
`

## 目录结构

`
apps/
  web/          # 主应用
  docs/         # 文档站
packages/
  ui/           # UI 组件库
  utils/        # 工具函数
  tsconfig/     # 共享 TS 配置
`

## Turborepo 核心配置

Turborepo 通过 	urbo.json 定义流水线：

`json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "lint": {}
  }
}
`

关键概念是 ^build —— 先构建依赖，再构建自身。

## 缓存策略

Turborepo 的本地缓存 + 远程缓存（Vercel Remote Caching）让二次构建几乎瞬间完成。

## 推荐实践

1. 每个包保持小粒度、单一职责
2. 共享的 tsconfig 和 ESLint 配置放在 packages 中
3. 使用 .npmrc 配置 strict peer dependencies
