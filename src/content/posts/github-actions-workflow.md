---
title: "使用 GitHub Actions 构建自动化前端工作流"
description: "从 CI/CD 到自动化发布，用 GitHub Actions 搭建一套完整的前端工程化流水线。"
pubDate: 2026-06-20
category: "工程化"
tags: ["GitHub Actions", "CI/CD", "自动化", "DevOps"]
draft: false
---

## 为什么需要自动化？

前端工程化不仅关乎打包工具的选择，更关乎**从代码提交到上线的全链路效率**。

## 流水线设计

一个标准的前端 CI/CD 流水线包含以下阶段：

### 1. Lint & Type Check

```yaml
lint:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: npm ci
    - run: npm run lint
    - run: npm run typecheck
```

### 2. 单元测试 + 快照测试

使用 Vitest 配合 Playwright 做组件级别的测试覆盖。

### 3. 构建与预览部署

在 PR 阶段自动生成预览部署链接，方便 Reviewer 直接查看效果。

### 4. 生产部署

合并到 main 分支后触发 Netlify 部署：

```yaml
deploy:
  needs: [lint, test, build]
  runs-on: ubuntu-latest
  steps:
    - name: Deploy to Netlify
      run: npx netlify-cli deploy --prod --dir=dist
```

## 缓存策略

合理的缓存可以大幅缩短流水线时间：

```yaml
- name: Cache node_modules
  uses: actions/cache@v4
  with:
    path: node_modules
    key: runner.os-node-hashFiles('package-lock.json')
```

## 总结

好的 CI/CD 流水线是团队工程文化的体现。它不应该成为瓶颈，而是让开发者专注于写代码的底气。
