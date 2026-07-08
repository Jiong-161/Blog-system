---
title: "Git & GitHub 实战操作手册"
description: "从零掌握Git分布式版本控制，覆盖环境配置、仓库上传、分支管理、提交规范、团队协作与踩坑避坑完整实战教程"
pubDate: 2026-07-08
category: "开发工具"
tags: ["Git", "GitHub", "版本控制", "代码协作", "前端工程化"]
coverImage: "/images/uploads/a3.jpg"
draft: false
---
# Git \& GitHub 实战操作手册

# 一、基础概念与环境配置

## 1\.1 核心概念

**Git** 是一款分布式版本控制系统，用于追踪文件变化、管理代码历史、支持多人协作开发。每个开发者本地都有一份完整的仓库副本。

**GitHub** 是基于 Git 的代码托管平台，提供远程仓库存储、Issue 追踪、Pull Request 协作等功能。

|概念|说明|
|---|---|
|工作区（Working Directory）|你正在编辑的文件目录|
|暂存区（Staging Area）|git add 后的临时存储区，准备提交|
|本地仓库（Local Repository）|git commit 后存入 \.git 目录的历史记录|
|远程仓库（Remote Repository）|GitHub 等平台上的服务器端仓库|

## 1\.2 安装与初始配置

下载安装 Git 后，首先配置用户名和邮箱，这会出现在每一次提交记录中：

```bash
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱地址"
```

查看配置是否生效：

```bash
git config --list
```

**建议：**邮箱使用 GitHub 注册邮箱，这样提交记录会自动关联到你的 GitHub 账号头像。

## 1\.3 SSH 密钥配置（推荐）

使用 SSH 方式连接 GitHub 无需每次输入密码，是开发者首选方式。

**第一步：生成密钥**

```bash
ssh-keygen -t ed25519 -C "你的GitHub邮箱"
```

一路回车即可，默认保存在 \~/\.ssh/ 目录下。

**第二步：查看并复制公钥**

```bash
cat ~/.ssh/id_ed25519.pub
```

**第三步：添加到 GitHub**

进入 GitHub → Settings → SSH and GPG keys → New SSH key，粘贴公钥内容保存。

**第四步：测试连接**

```bash
ssh -T git@github.com
```

出现 Hi 用户名\! You've successfully authenticated 即为配置成功。

# 二、本地项目首次上传 GitHub 完整流程

## 2\.1 标准九步流程

1. **进入项目目录**

    ```bash
    cd /path/to/your/project
    ```

2. **初始化 Git 仓库**

    ```bash
    git init
    ```

3. **创建 \.gitignore 文件**新建 \.gitignore 文件，填写需要忽略的文件规则（详见第五章）。**务必在 git add 之前创建**，避免误提交缓存文件。

4. **添加文件到暂存区**

    ```bash
    git add .
    ```

5. **执行首次提交**

    ```bash
    git commit -m "feat: 初始化项目"
    ```

6. **重命名主分支为 main**

    ```bash
    git branch -M main
    ```

7. **关联远程仓库**

    ```bash
    git remote add origin git@github.com:用户名/仓库名.git
    ```

8. **推送到远程**

    ```bash
    git push -u origin main
    ```

## 2\.2 常见异常处理

### 异常一：推送被拒，提示 fetch first

**原因：**创建 GitHub 仓库时勾选了自动生成 README / LICENSE / \.gitignore，远程已有初始提交，和本地无共同祖先。

**解决：**先拉取合并再推送

```bash
git pull --rebase origin main --allow-unrelated-histories
git push -u origin main
```

### 异常二：推送被拒，提示 must be made through a pull request

**原因：**仓库开启了 main 分支保护规则，不允许直接推送，必须通过 Pull Request 合并。

**解决：**新建分支推送，再提 PR 合并

```bash
# 新建开发分支
git checkout -b init-project

# 推送到新分支
git push -u origin init-project
```

然后到 GitHub 页面创建 Pull Request，审核通过后合并到 main。

# 三、日常开发常用命令

## 3\.1 基础操作

|命令|作用|
|---|---|
|`git status`|查看当前仓库状态（哪些文件被修改、哪些在暂存区）|
|`git add 文件名`|添加指定文件到暂存区|
|`git add .`|添加当前目录所有变更到暂存区|
|`git add -p`|交互式选择要添加的代码片段（推荐精细提交）|
|`git commit -m "描述"`|提交暂存区内容到本地仓库|
|`git commit --amend`|修改上一次提交（还没 push 时使用）|
|`git push`|推送当前分支到远程|
|`git pull`|拉取远程最新代码并合并到当前分支|
|`git pull --rebase`|拉取并以变基方式合并（提交历史更整洁）|

## 3\.2 查看历史与差异

|命令|作用|
|---|---|
|`git log`|查看完整提交历史|
|`git log --oneline`|精简模式，每条提交一行显示|
|`git log --graph`|图形化显示分支合并历史|
|`git diff`|查看工作区与暂存区的差异|
|`git diff --staged`|查看暂存区与上次提交的差异|
|`git show 提交ID`|查看某次提交的具体改动|

## 3\.3 撤销与回退

|场景|命令|
|---|---|
|撤销工作区修改（未 add）|`git checkout -- 文件名` 或 `git restore 文件名`|
|从暂存区撤回（已 add 未 commit）|`git reset HEAD 文件名` 或 `git restore --staged 文件名`|
|撤销最近一次提交（已 commit 未 push）|`git reset --soft HEAD~1`（保留改动）|
|回退到指定提交并丢弃改动|`git reset --hard 提交ID`|
|新建一次反向提交（已 push 安全回退）|`git revert 提交ID`|

**危险操作：**`git reset --hard` 会永久丢弃未提交的改动，且已推送到远程的提交不要用 reset，应用 revert 生成反向提交。

# 四、分支管理

## 4\.1 分支基础操作

|命令|作用|
|---|---|
|`git branch`|列出所有本地分支，当前分支带 \* 标记|
|`git branch -a`|列出所有分支（含远程）|
|`git branch 分支名`|创建新分支（不切换）|
|`git checkout 分支名`|切换到指定分支|
|`git checkout -b 分支名`|创建并切换到新分支（最常用）|
|`git switch 分支名`|切换分支（Git 2\.23\+ 新命令，语义更清晰）|
|`git branch -d 分支名`|删除已合并的分支|
|`git branch -D 分支名`|强制删除分支（未合并也删）|

## 4\.2 合并与变基

### merge 合并

```bash
# 切回主分支
git checkout main

# 合并功能分支
git merge feature-login
```

特点：保留完整分支历史，会生成一次 merge commit，历史呈网状结构。适合公共主分支合并。

### rebase 变基

```bash
# 在功能分支上执行
git checkout feature-login
git rebase main
```

特点：将当前分支的提交搬运到目标分支最新提交之后，提交历史呈一条直线，更整洁。适合个人功能分支同步主分支。

**黄金法则：**不要在多人共享的公共分支上执行 rebase，只在自己的私有功能分支使用。

### 解决冲突

合并或变基时如果同一文件同一行被两边都修改了，就会产生冲突。Git 会标记冲突位置：

```text
<<<<<<< HEAD
当前分支的内容
=======
合并进来的内容
>>>>>>> feature-branch
```

手动编辑保留正确内容，删除标记符号，然后：

```bash
git add 冲突文件
git commit   # merge 场景
# 或
git rebase --continue   # rebase 场景
```

## 4\.3 常用分支命名规范

|前缀|用途|示例|
|---|---|---|
|feature/|新功能开发|feature/user\-login|
|fix/|修复 bug|fix/login\-crash|
|hotfix/|线上紧急修复|hotfix/payment\-error|
|docs/|文档更新|docs/readme\-update|
|refactor/|代码重构|refactor/db\-layer|
|chore/|构建/工具变动|chore/upgrade\-deps|

# 五、\.gitignore 配置指南

## 5\.1 配置规则

\.gitignore 文件用于指定哪些文件不需要 Git 追踪，每行一条规则。

|语法|含义|示例|
|---|---|---|
|\# 注释|注释行，不生效|\# 忽略日志文件|
|文件名|忽略所有同名文件/目录|\*\.log|
|/目录名|仅忽略根目录下的该目录|/dist|
|目录名/|忽略所有同名目录|\_\_pycache\_\_/|
|\* 通配符|匹配任意字符|\*\.pyc|
|\! 例外规则|不忽略该文件|\!important\.log|

## 5\.2 Python 项目标准模板

```gitignore
# ===== Python 字节码 =====
__pycache__/
*.py[cod]
*$py.class
*.so

# ===== 打包构建产物 =====
build/
dist/
*.egg-info/
*.egg
*.spec

# ===== 虚拟环境 =====
venv/
env/
.venv/
ENV/

# ===== IDE / 编辑器 =====
.idea/
.vscode/
*.iml
*.swp
.DS_Store

# ===== 日志 & 临时文件 =====
*.log
*.tmp
*.bak

# ===== 环境变量 & 密钥 =====
.env
.env.local
*.pem
*.key
```

## 5\.3 清除已误提交的忽略文件

如果文件已经被 Git 追踪了，再添加 \.gitignore 不会自动生效，需要手动从缓存中移除：

```bash
# 从 Git 缓存中移除（保留本地文件）
git rm -r --cached __pycache__ .idea dist

# 提交变更
git commit -m "chore: 清理已跟踪的忽略文件"
```

# 六、Conventional Commits 提交规范

## 6\.1 规范格式

```text
<类型>(<可选作用域>): <描述>

<可选正文>

<可选页脚>
```

核心规则：

- 类型小写，冒号后必须有一个空格

- 描述用动词开头，不超过 50 字符，不加句号

- 正文可选，用于详细说明改动原因和内容

## 6\.2 常用类型

|类型|说明|示例|
|---|---|---|
|**feat**|新功能|feat: 添加用户登录功能|
|**fix**|修复 bug|fix: 修复登录超时崩溃问题|
|**docs**|文档变更|docs: 更新 README 安装说明|
|**style**|代码格式（不影响逻辑）|style: 统一缩进为 4 空格|
|**refactor**|代码重构（非新增也非修 bug）|refactor: 抽离数据库操作层|
|**perf**|性能优化|perf: 优化列表查询速度|
|**test**|测试相关|test: 补充登录接口单元测试|
|**chore**|构建/工具/依赖变动|chore: 升级 Python 版本到 3\.11|
|**ci**|CI/CD 配置|ci: 添加 GitHub Actions 自动部署|

## 6\.3 带作用域和正文的完整示例

```text
feat(auth): 支持手机号验证码登录

- 新增短信验证码发送接口
- 新增手机号注册与登录逻辑
- 增加图形验证码防刷机制

Closes #123
```

# 七、新手常见坑与避坑指南

## 坑 1：把敏感文件和大文件提交到仓库

**表现：**密钥、密码、数据库文件、node\_modules、编译产物被提交，仓库臃肿且有安全风险。

**规避方法：**

- 项目初始化第一件事就是创建 \.gitignore

- 密钥、Token 一律放入 \.env 文件并加入忽略规则

- 大文件（超过 100MB）不要用 Git 管理，使用 Git LFS 或对象存储

## 坑 2：直接在 main 分支开发，导致提交混乱

**表现：**所有改动都堆在 main 上，功能回退困难，多人协作冲突频繁。

**规避方法：**

- 永远从 main 拉新分支开发：`git checkout -b feature/xxx`

- 功能完成后通过 Pull Request 合并回 main

- 合并后及时删除已完成的功能分支

## 坑 3：强制推送覆盖他人代码

**表现：**使用 `git push -f` 强制推送，导致远程仓库上别人的提交丢失。

**规避方法：**

- 公共分支（main / develop）绝对不要 force push

- 自己的私有功能分支可以用 `git push --force-with-lease` 替代 \-f，更安全

- 推送前先 `git pull --rebase` 同步远程最新代码

## 坑 4：提交信息乱写，后期无法追溯

**表现：**提交信息全是 update、fix、修改，看历史完全不知道改了什么。

**规避方法：**

- 遵循 Conventional Commits 规范（见第六章）

- 一条提交只做一件事，避免大杂烩提交

- 描述要说清楚做了什么，而不是改了文件

# 八、远程协作与 Pull Request 流程

## 8\.1 标准 PR 协作流程

1. **同步主分支最新代码**

    ```bash
    git checkout main
    git pull origin main
    ```

2. **创建功能分支**

    ```bash
    git checkout -b feature/your-feature
    ```

3. **开发并提交**

    ```bash
    git add .
    git commit -m "feat: 实现某个功能"
    ```

4. **推送分支到远程**

    ```bash
    git push -u origin feature/your-feature
    ```

5. **GitHub 上创建 Pull Request**打开仓库页面，点击 Compare \& pull request，填写标题和描述，指定 Reviewer。

6. **代码评审与修改**根据评审意见在同一分支继续提交并推送，PR 会自动更新。

7. **合并到 main**评审通过后点击 Merge pull request，推荐选择 Squash and merge 将多个提交压缩成一个。

8. **本地同步并清理**

    ```bash
    git checkout main
    git pull origin main
    git branch -d feature/your-feature
    ```

## 8\.2 同步他人仓库（Fork 工作流）

参与开源项目通常需要 Fork 后提交 PR，此时需要配置上游仓库：

```bash
# 添加上游远程仓库
git remote add upstream git@github.com:原作者/仓库.git

# 同步上游最新代码
git fetch upstream
git checkout main
git merge upstream/main
```

---

**附录：速查命令清单**

```bash
# 初始化 & 配置
git init
git config --global user.name "名称"
git config --global user.email "邮箱"

# 日常操作
git status
git add .
git commit -m "描述"
git push
git pull --rebase

# 分支操作
git checkout -b 分支名
git checkout main
git merge 分支名
git branch -d 分支名

# 查看历史
git log --oneline --graph
git diff
git show 提交ID

# 撤销操作
git restore 文件名          # 撤销工作区修改
git restore --staged 文件名  # 撤回暂存区
git reset --soft HEAD~1      # 撤销最近一次提交（保留改动）
```