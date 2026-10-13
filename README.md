# Nuvio Ultra HD (1080P / 4K) 插件库

专为 **Nuvio** 流媒体播放器打造的高清视频源聚合插件。

本插件深度筛选了主流视频源站及 [Nuvio 社区插件库](https://nuvio-plugin-library.vercel.app/)，**严格剔除所有低于 1080P 的低画质视频源**，并具备全自动多维去重引擎，只提供 1080P、1440P 与 4K (2160P) 超清极速流媒体。

---

## 🚀 在 Nuvio 中快速安装

1. 打开 **Nuvio** 客户端（支持 Android TV、WebOS、Tizen、Desktop、Mobile）。
2. 进入 **Settings (设置)** -> **Plugins (插件管理)**。
3. 添加本仓库地址：
   ```text
   https://raw.githubusercontent.com/kanpianer/Nuvio/main
   ```
4. 刷新插件列表，启用 **🌟 HD Master (全网 1080P/4K 聚合)** 即可立即使用。

---

## ✨ 核心特性

- **严格 1080P+ 画质准入**：自动拦截丢弃 720P、480P、360P、CAM 等一切低画质源。
- **全网智能去重**：清除相同视频 URL 与相同存储文件的冗余源。
- **画质降序排列**：自动将 4K (2160P) 与 1080P 高速流排在最前。
- **高可用直连源聚合**：
  - **VidRock (Orion / Luna)**：1920x1080 原画 HLS 直链，秒开播放。
  - **Castle**：极速 CDN 1080P 认证多音轨流。
  - **4KHDHub**：精选 Cloudflare R2 及 HubCloud 10Gbps 4K/1080P 直链。
  - **StreamFlix**：Wasabi S3 1080P 高清源。
- **完全兼容官方标准**：遵循 React Native (Hermes) 执行规范，使用 esbuild 自动转译编译。

---

## 🛠 本地开发与构建

```bash
# 1. 安装依赖
npm install

# 2. 编译插件 (生成 ES2016 规范的 Hermes 兼容单文件)
npm run build

# 3. 运行自动化端到端测试
npm test
```

---

## 📄 许可证

GPL-3.0 License
