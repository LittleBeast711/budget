# 📊 Budget Manager App

一个使用 **React Native + TypeScript** 开发的跨平台账单管理应用，支持分类管理、收支记录、数据筛选等功能，适配 Android 和 iOS。

## 🚀 功能特性

- 添加账单：支持收入/支出记录
- 分类管理：可自定义分类并在添加账单时选择
- 筛选功能：可按日期筛选账单数据
- 本地存储：使用 AsyncStorage 持久化数据
- 移动端优先：为手机端优化的界面布局
- 多页面导航：基于 React Navigation 实现页面跳转和底部导航

## 📱 技术栈

- React Native (Expo)
- TypeScript
- React Navigation
- AsyncStorage
- EAS 构建与部署

## 🛠 安装与运行

```bash
git clone https://github.com/LittleBeast711/budget.git
cd budget
npm install
npx epxo start


## 📦 打包发布（EAS）

eas build -p android
eas build -p ios
需要提前登录并配置好 eas.json 与 Apple/Google 账号。

## 📁 项目结构简述

├── App.tsx                // 项目入口
├── screens/               // 页面组件
│   ├── HomeScreen.tsx
│   ├── AddBillScreen.tsx
│   ├── CategoryScreen.tsx
│   └── SettingsScreen.tsx
├── types/                 // 类型定义
│   └── type.ts
└── ...

##💡 TODO

 - 图表展示支出趋势

 - 切换主题色？

 - 多语言支持

### 注：如果要在ios测试，需在App Store安装Expo Go