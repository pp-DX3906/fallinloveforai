#!/bin/bash
# 澎湃睡觉 · Flames 场景 本地启动脚本
# 双击运行：启动本地服务并打开浏览器
cd "$(dirname "$0")"

# 若 8642 端口已有服务在跑则直接打开
if ! curl -s -o /dev/null --max-time 1 "http://127.0.0.1:8642/"; then
  python3 -m http.server 8642 --bind 127.0.0.1 >/dev/null 2>&1 &
  sleep 0.6
fi
open "http://127.0.0.1:8642/"
