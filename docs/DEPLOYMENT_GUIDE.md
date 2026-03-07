# AWS Deployment Guide

Complete step-by-step guide to deploy CulTour Maharashtra on AWS.

## Prerequisites

- AWS Account
- Domain name (optional but recommended)
- MongoDB Atlas account
- Razorpay account
- OpenAI API key
- Basic knowledge of Linux commands

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Route 53 (DNS)                    │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│              CloudFront (CDN)                       │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│         Application Load Balancer (ALB)             │
└─────┬──────────────────────────────────────┬────────┘
      │                                      │
┌─────▼──────┐                        ┌─────▼──────┐
│  EC2       │                        │  EC2       │
│  Frontend  │                        │  Backend   │
│  (Nginx)   │                        │  (Node.js) │
└────────────┘                        └─────┬──────┘
                                            │
                     ┌──────────────────────┼──────────────────┐
                     │                      │                  │
              ┌──────▼──────┐        ┌─────▼──────┐    ┌─────▼──────┐
              │  MongoDB    │        │    S3      │    │  Secrets   │
              │   Atlas     │        │  (Images)  │    │  Manager   │
              └─────────────┘        └────────────┘    └────────────┘
```

---

## Step 1: Setup MongoDB Atlas

### 1.1 Create Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Log in
3. Click "Build a Database"
4. Choose "Shared" (Free tier) or "Dedicated"
5. Select AWS as cloud provider
6. Choose region closest to your EC2 (e.g., ap-south-1 for Mumbai)
7. Name your cluster: `cultour-maharashtra`
8. Click "Create Cluster"

### 1.2 Configure Network Access

1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add specific EC2 IP later
4. Click "Confirm"

### 1.3 Create Database User

1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `cultour_admin`
5. Generate secure password
6. Set role: "Atlas admin"
7. Click "Add User"

### 1.4 Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy connection string:
```
mongodb+srv://cultour_admin:<password>@cultour-maharashtra.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
4. Replace `<password>` with actual password
5. Add database name: `/cultour-maharashtra`

---

## Step 2: Setup AWS S3

### 2.1 Create S3 Bucket

```bash
aws s3 mb s3://cultour-maharashtra-images --region ap-south-1
```

Or via Console:
1. Go to S3 Console
2. Click "Create bucket"
3. Bucket name: `cultour-maharashtra-images`
4. Region: ap-south-1
5. Uncheck "Block all public access"
6. Click "Create bucket"

### 2.2 Configure Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::cultour-maharashtra-images/*"
    }
  ]
}
```

### 2.3 Enable CORS

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### 2.4 Create IAM User

1. Go to IAM Console
2. Create user: `cultour-s3-user`
3. Attach policy: `AmazonS3FullAccess`
4. Generate access keys
5. Save Access Key ID and Secret Access Key

---

## Step 3: Launch EC2 Instance

### 3.1 Create EC2 Instance

1. Go to EC2 Console
2. Click "Launch Instance"
3. Name: `cultour-maharashtra-server`
4. AMI: Ubuntu Server 22.04 LTS
5. Instance type: t2.medium (or t3.medium)
6. Create new key pair: `cultour-key.pem`
7. Download and save key pair

### 3.2 Configure Security Group

Create security group with these inbound rules:

| Type  | Protocol | Port | Source    | Description        |
|-------|----------|------|-----------|-------------------|
| SSH   | TCP      | 22   | My IP     | SSH access        |
| HTTP  | TCP      | 80   | 0.0.0.0/0 | HTTP traffic      |
| HTTPS | TCP      | 443  | 0.0.0.0/0 | HTTPS traffic     |
| Custom| TCP      | 5000 | 0.0.0.0/0 | Backend API       |
| Custom| TCP      | 3000 | 0.0.0.0/0 | Frontend (dev)    |

### 3.3 Allocate Elastic IP

1. Go to "Elastic IPs"
2. Click "Allocate Elastic IP address"
3. Associate with your EC2 instance
4. Note the IP address

---

## Step 4: Connect to EC2 and Setup Environment

### 4.1 Connect via SSH

```bash
chmod 400 cultour-key.pem
ssh -i cultour-key.pem ubuntu@<ELASTIC_IP>
```

### 4.2 Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### 4.3 Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should show v18.x
npm --version
```

### 4.4 Install PM2

```bash
sudo npm install -g pm2
```

### 4.5 Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 4.6 Install Git

```bash
sudo apt install -y git
```

---

## Step 5: Deploy Backend

### 5.1 Clone Repository

```bash
cd /home/ubuntu
git clone <your-repo-url> cultour-maharashtra
cd cultour-maharashtra/backend
```

### 5.2 Install Dependencies

```bash
npm install --production
```

### 5.3 Create Environment File

```bash
nano .env
```

Add:
```env
NODE_ENV=production
PORT=5000
API_VERSION=v1

# MongoDB Atlas
MONGODB_URI=mongodb+srv://cultour_admin:<password>@cultour-maharashtra.xxxxx.mongodb.net/cultour-maharashtra

# JWT
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# AWS S3
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
AWS_REGION=ap-south-1
AWS_S3_BUCKET=cultour-maharashtra-images

# Razorpay
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>

# OpenAI
OPENAI_API_KEY=<your-openai-key>

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Platform Settings
PLATFORM_COMMISSION=20
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5.4 Start Backend with PM2

```bash
pm2 start src/server.js --name cultour-api
pm2 save
pm2 startup
```

Copy and run the command PM2 outputs.

### 5.5 Verify Backend

```bash
curl http://localhost:5000/health
```

---

## Step 6: Deploy Frontend

### 6.1 Build Frontend

```bash
cd /home/ubuntu/cultour-maharashtra/frontend
npm install
```

Create `.env.production`:
```env
VITE_API_URL=https://api.yourdomain.com/api/v1
```

Build:
```bash
npm run build
```

### 6.2 Setup Nginx

```bash
sudo nano /etc/nginx/sites-available/cultour
```

Add:
```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /home/ubuntu/cultour-maharashtra/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/cultour /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 7: Setup SSL with Let's Encrypt

### 7.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2 Obtain SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

Follow prompts:
- Enter email
- Agree to terms
- Choose redirect HTTP to HTTPS

### 7.3 Auto-renewal

Certbot automatically sets up renewal. Test it:
```bash
sudo certbot renew --dry-run
```

---

## Step 8: Configure Domain (Route 53)

### 8.1 Create Hosted Zone

1. Go to Route 53 Console
2. Click "Create hosted zone"
3. Domain name: `yourdomain.com`
4. Type: Public hosted zone

### 8.2 Create Records

**A Record for main domain:**
- Name: (leave empty)
- Type: A
- Value: <ELASTIC_IP>

**A Record for www:**
- Name: www
- Type: A
- Value: <ELASTIC_IP>

**A Record for API:**
- Name: api
- Type: A
- Value: <ELASTIC_IP>

### 8.3 Update Nameservers

Copy the 4 nameservers from Route 53 and update them in your domain registrar.

---

## Step 9: Setup Monitoring

### 9.1 PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 9.2 View Logs

```bash
pm2 logs cultour-api
pm2 monit
```

### 9.3 CloudWatch (Optional)

Install CloudWatch agent:
```bash
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb
```

---

## Step 10: Backup Strategy

### 10.1 MongoDB Backup

MongoDB Atlas provides automatic backups. Configure:
1. Go to cluster
2. Click "Backup"
3. Enable continuous backup
4. Set retention period

### 10.2 S3 Versioning

```bash
aws s3api put-bucket-versioning \
  --bucket cultour-maharashtra-images \
  --versioning-configuration Status=Enabled
```

### 10.3 EC2 Snapshots

Create AMI:
```bash
aws ec2 create-image \
  --instance-id <instance-id> \
  --name "cultour-backup-$(date +%Y%m%d)" \
  --description "CulTour Maharashtra backup"
```

---

## Step 11: CI/CD with GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /home/ubuntu/cultour-maharashtra
            git pull origin main
            cd backend
            npm install --production
            pm2 restart cultour-api
            cd ../frontend
            npm install
            npm run build
            sudo systemctl reload nginx
```

---

## Step 12: Security Hardening

### 12.1 Setup Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 12.2 Fail2Ban

```bash
sudo apt install -y fail2ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### 12.3 Automatic Updates

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Troubleshooting

### Backend not starting
```bash
pm2 logs cultour-api --lines 100
```

### Nginx errors
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### MongoDB connection issues
- Check IP whitelist in Atlas
- Verify connection string
- Check network connectivity

### SSL certificate issues
```bash
sudo certbot certificates
sudo certbot renew --force-renewal
```

---

## Performance Optimization

### 1. Enable Nginx Caching

Add to nginx config:
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;

location /api {
    proxy_cache api_cache;
    proxy_cache_valid 200 10m;
    proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
}
```

### 2. Enable Compression

Already included in nginx config above.

### 3. CDN (CloudFront)

1. Create CloudFront distribution
2. Origin: Your domain
3. Enable caching for static assets
4. Update DNS to point to CloudFront

---

## Cost Estimation

**Monthly AWS Costs (Approximate):**
- EC2 t2.medium: $35
- Elastic IP: $0 (when attached)
- S3 Storage (10GB): $0.25
- Data Transfer (100GB): $9
- Route 53: $0.50
- **Total: ~$45/month**

**Other Services:**
- MongoDB Atlas (Free tier): $0
- Razorpay: Transaction fees only
- OpenAI API: Pay per use

---

## Maintenance Checklist

**Daily:**
- [ ] Check PM2 status
- [ ] Monitor error logs

**Weekly:**
- [ ] Review CloudWatch metrics
- [ ] Check disk space
- [ ] Review security logs

**Monthly:**
- [ ] Update dependencies
- [ ] Review and rotate logs
- [ ] Test backup restoration
- [ ] Review AWS costs

---

## Support

For deployment issues:
- Check logs: `pm2 logs`
- Nginx logs: `/var/log/nginx/`
- System logs: `journalctl -xe`

## Conclusion

Your CulTour Maharashtra platform is now deployed on AWS with:
✅ Scalable architecture
✅ SSL encryption
✅ Automated backups
✅ Monitoring and logging
✅ Security hardening
✅ Production-ready configuration
