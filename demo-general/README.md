[TOC]

# 启动
`npm run start`

# 项目介绍
## ！重要文件
1. 工程化配置文件：`build.pulgin.js`、`build.json`
2. 入口文件：`index.tsx`
3. 初始化文件：`init.ts`
4. 官方扩展入口：`appHelper.ts`
5. 预览【通过这个我们可以了解它的解析和渲染流程】：`preview`【推荐看业务项目的低代码渲染相关文件】

## 目录
1. `hooks`
2. `plugins` 低代码插件
3. `services` 关注其中的`assets.json`文件，每次发布新物料需要修改
4. `stters` 自定义设置器【不推荐做这个，比较扩展】
5. `utils` 工具方法

# 发布
0. 如果涉及物料库更新，需要修改`assets.json`文件的相关版本
1. 编译 `npm run build`
2. 把包给后端，让他部署【张永吉】