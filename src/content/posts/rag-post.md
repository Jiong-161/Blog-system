---
title: "用 Python 从零搭建 RAG 系统：让大模型不再「幻觉」"
description: "深入理解 RAG（检索增强生成）原理，用 Python + LangChain 从零搭建一套可落地的知识问答系统。"
pubDate: 2026-07-07
category: "前端"
tags: ["Python", "RAG", "LLM", "LangChain"]
coverImage: "src/assets/a1.jpg"
draft: false
---

## 什么是 RAG？

**RAG（Retrieval-Augmented Generation，检索增强生成）** 是一种将**信息检索**与**大语言模型生成**相结合的技术架构。简单来说：

> 先从知识库中「检索」出与用户问题最相关的文档片段，再把这些片段作为上下文「喂」给大模型，让大模型基于真实资料生成回答。

这样做的好处是显而易见的：

- **减少幻觉**：模型基于检索到的真实文档回答，而非凭空编造
- **知识可更新**：只需更新知识库，无需重新训练模型
- **领域可定制**：接入企业内部文档、私有数据
- **可溯源**：每个回答都能追溯到具体文档来源

### RAG 与微调的对比

| 特性 | RAG | 微调（Fine-tuning） |
|------|-----|-------------------|
| 知识更新成本 | 低（更新文档即可） | 高（需重新训练） |
| 回答可溯源性 | ✅ 支持溯源 | ❌ 无法溯源 |
| 领域适应性 | 强 | 强 |
| 硬件需求 | 低（仅推理） | 高（需 GPU 训练） |
| 适合场景 | 知识密集型问答 | 风格/格式定制 |

---

## RAG 的核心流程

一个完整的 RAG 系统分为两个阶段：

```
┌─────────────────────────────────────────────────────┐
│                   离线索引阶段                        │
│                                                     │
│  原始文档 → 文档分块 → 向量化(Embedding) → 向量数据库  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   在线查询阶段                        │
│                                                     │
│  用户提问 → 向量化 → 向量检索 → 拼接Prompt → LLM生成   │
└─────────────────────────────────────────────────────┘
```

---

## 环境准备

我们需要以下核心依赖：

```bash
pip install langchain langchain-openai langchain-community
pip install chromadb          # 向量数据库
pip install tiktoken          # 分词器
pip install pypdf             # PDF 解析
```

同时需要一个 OpenAI API Key（或其他兼容的 LLM 服务）：

```python
import os
os.environ["OPENAI_API_KEY"] = "sk-your-api-key-here"
```

---

## 第一步：文档加载与分块

### 1.1 加载文档

LangChain 提供了丰富的文档加载器，支持 PDF、Markdown、网页等格式：

```python
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    DirectoryLoader,
    WebBaseLoader,
)

# 加载单个 PDF
loader = PyPDFLoader("knowledge_base.pdf")
pages = loader.load()

# 批量加载目录下所有 .txt 文件
loader = DirectoryLoader(
    "./docs",
    glob="**/*.txt",
    loader_cls=TextLoader,
)
documents = loader.load()

# 加载网页内容
loader = WebBaseLoader("https://docs.example.com/guide")
web_docs = loader.load()

print(f"共加载 {len(documents)} 篇文档")
```

### 1.2 文档分块（Chunking）

大模型的上下文窗口有限，必须将长文档切分为合理大小的块。分块策略直接影响检索质量：

```python
