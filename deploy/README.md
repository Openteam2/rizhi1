# 日知服务器部署

目标域名：`rizhi.top`、`www.rizhi.top`  
服务器 IP：`123.207.72.210`  
推荐结构：Nginx → localhost:4173 → 日知 Node 服务

## 1. 先修复 DNS

在腾讯云 DNSPod 或轻量应用服务器域名解析中检查：

| 主机记录 | 类型 | 记录值 |
| --- | --- | --- |
| `@` | A | `123.207.72.210` |
| `www` | A | `123.207.72.210` |

同时确认：

- 域名已完成实名认证。
- 域名 NS 已使用云厂商分配的 DNS 服务器。
- `rizhi.top` 和 `www.rizhi.top` 在全球 DNS 查询中能返回该 IP。
- 中国大陆服务器的网站域名应完成 ICP 备案，否则 80/443 访问可能被拦截。

检查：

```powershell
Resolve-DnsName rizhi.top -Type A
Resolve-DnsName www.rizhi.top -Type A
```

当前检查结果为 `DNS 名称不存在`。解析生效前无法申请 HTTPS 证书。

## 2. 开放端口

在腾讯云防火墙和服务器系统防火墙中开放：

- TCP 80
- TCP 443
- SSH 端口只对管理来源开放

不要向公网开放 4173。Node 服务只监听 `127.0.0.1`。

## 3. 安装运行环境

以下命令以 Ubuntu/Debian 为例：

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx curl
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
node --version
```

Node.js 必须为 24 或更高版本。

## 4. 上传代码

在 Windows 项目目录运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy\upload.ps1 `
  -SshUser root `
  -ServerHost 123.207.72.210 `
  -RemotePath /opt/rizhi `
  -IdentityFile C:\path\to\your-key.pem
```

如果没有指定私钥，脚本会使用系统 SSH 默认凭据。

如果要从本地迁移正式数据，先停止本地写入，再单独复制数据库、附件和密钥：

```bash
sudo mkdir -p /opt/rizhi/data
sudo chown -R rizhi:rizhi /opt/rizhi/data
```

只复制需要迁移的 `study.db`、`assets/` 和 `ai-secret.key`。不要把本地 `.env` 直接提交到 Git。

## 5. 配置环境变量

在服务器执行：

```bash
cd /opt/rizhi
sudo cp .env.example .env
sudo nano .env
```

生产配置至少包含：

```text
HOST=127.0.0.1
PORT=4173
NODE_ENV=production
GITHUB_REPOSITORY=Openteam2/rizhi1
GITHUB_DEFAULT_BRANCH=main
GITHUB_TOKEN=可选令牌
```

DeepSeek Key 可写入 `.env`，也可以启动后在设置页保存。`.env` 权限建议为 `600`。

## 6. 创建系统用户与数据目录

```bash
sudo useradd --system --home /opt/rizhi --shell /usr/sbin/nologin rizhi
sudo mkdir -p /opt/rizhi/data
sudo chown -R rizhi:rizhi /opt/rizhi
sudo chmod 600 /opt/rizhi/.env
```

## 7. 启用 Node 服务

```bash
sudo cp /opt/rizhi/deploy/rizhi.service /etc/systemd/system/rizhi.service
sudo systemctl daemon-reload
sudo systemctl enable --now rizhi
sudo systemctl status rizhi
curl http://127.0.0.1:4173/api/health
```

## 8. 配置 Nginx

```bash
sudo cp /opt/rizhi/deploy/nginx-rizhi.conf /etc/nginx/sites-available/rizhi.conf
sudo ln -s /etc/nginx/sites-available/rizhi.conf /etc/nginx/sites-enabled/rizhi.conf
sudo nginx -t
sudo systemctl reload nginx
```

测试：

```bash
curl -I http://rizhi.top
```

## 9. 申请 HTTPS

DNS 生效且 80 端口可访问后：

```bash
sudo certbot --nginx -d rizhi.top -d www.rizhi.top --redirect
sudo certbot renew --dry-run
```

最终检查：

```bash
curl -I https://rizhi.top
curl https://rizhi.top/api/health
```

## 10. 当前诊断

截至本轮检查：

- `rizhi.top` 与 `www.rizhi.top` 在本机 DNS 均返回不存在。
- `123.207.72.210` 的 22、80、443、4173 端口均不可连接。
- 因此当前无法远程安装服务或申请证书。

DNS 记录生效并开放 SSH 后，才能继续实际部署。
