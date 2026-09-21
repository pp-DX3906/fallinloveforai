# BedVortex · 床与漩涡

一个以 3D 床、星空背景和漩涡动画组成的交互网页。默认背景为项目内的 `background-stars.png`。

## 本地运行

安装 Python 3 后，在项目文件夹运行：

```sh
python3 server.py
```

浏览器打开 http://localhost:8901 。Three.js 和模型加载器已包含在 vendor 中。

## 交互

- 按住画面不移动：摄影机缓慢推进，漩涡加强；松开后退回。
- 按住拖动：环绕床观察，带动背景扭动，松手后逐渐平复。
- 触控板双指上下滑动或鼠标滚轮：摄影机推近、拉远。
- 双击：平滑恢复默认视角。
- 空格：暂停或继续动画；R：重置时间和摄影机；F：全屏。
- 右下角参数：调整床、背景和扭曲效果。

床默认水平放置，绕竖直轴旋转。拖动时暂停自转，松手后逐渐恢复。
背景仍经过彩虹染色和漩涡合成，显示色彩会受参数影响。
页面临时上传的其他背景不会自动写入项目；默认背景已作为文件随项目保存。

## 文件

- index.html：主页面
- background-stars.png：用户提供的星空背景
- bed.glb：床模型
- vendor/：本地渲染依赖
- flock.html：保留的羊群版本
- bg.jpg、sheep.png、nyan.png：原版资源
- server.py：本地预览服务器

## 来源

改编自 thenumbernine 的 [NyanCatHypnotic](https://www.shadertoy.com/view/Msl3WM)，原作标注 CC BY-NC-SA 3.0。保留源代码中的署名与第三方依赖许可声明。新背景由用户提供；本项目说明不对背景和模型另行授予许可。
