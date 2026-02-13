# Deployment Guide

## Production Deployment Checklist

### Backend Deployment

#### 1. Environment Setup

- [ ] Change JWT_SECRET to a strong random key
- [ ] Update MongoDB connection to production database
- [ ] Configure email service (SMTP)
- [ ] Set NODE_ENV=production
- [ ] Update FRONTEND_URL to production URL

#### 2. Security

- [ ] Enable MongoDB authentication
- [ ] Use HTTPS only
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up DDoS protection

#### 3. Database

- [ ] Create MongoDB backups
- [ ] Enable replication (for high availability)
- [ ] Create indexes on frequently queried fields
- [ ] Set up monitoring

#### 4. Email Service

- [ ] Configure production email service (SendGrid, Mailgun, etc.)
- [ ] Set up email templates
- [ ] Test email delivery

#### 5. File Storage

- [ ] Move uploads to cloud storage (AWS S3, Google Cloud Storage)
- [ ] Set up image compression
- [ ] Configure CDN for fast delivery

#### 6. Monitoring & Logging

- [ ] Set up application monitoring (New Relic, DataDog)
- [ ] Configure error tracking (Sentry)
- [ ] Set up centralized logging (ELK Stack, CloudWatch)
- [ ] Monitor database performance

### Frontend Deployment

#### 1. Build Optimization

```bash
npm run build
```

#### 2. Environment Variables

Set the `VITE_API_URL` environment variable in your Vercel project settings:

```bash
VITE_API_URL=https://your-backend-url.com
```

This will automatically be picked up by `src/config.js`.

#### 3. Performance

- [ ] Enable gzip compression
- [ ] Minify CSS/JS
- [ ] Optimize images
- [ ] Implement lazy loading
- [ ] Enable caching headers

#### 4. SEO

- [ ] Add meta tags
- [ ] Configure sitemap.xml
- [ ] Submit to search engines
- [ ] Add robots.txt

### Hosting Options

#### Backend Hosting

**Heroku**

```bash
heroku login
heroku create your-app-name
git push heroku main
```

**Railway**

- Connect GitHub repo
- Auto-deploy on push

**DigitalOcean**

- Use App Platform for simplicity
- Or use VPS with manual setup

**AWS**

- Elastic Beanstalk
- EC2 + RDS

#### Frontend Hosting

**Vercel**

- Connect GitHub
- Auto-deploy on git push
- Comes with CDN

**Netlify**

- Connect GitHub
- Auto-deploy
- Free SSL

**AWS S3 + CloudFront**

- S3 for static files
- CloudFront for CDN

### SSL Certificate

Recommended: Use Let's Encrypt (free)

```bash
# Using Certbot
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d yourdomain.com
```

### Database Backup Strategy

#### MongoDB Backup

```bash
# Daily backup to S3
mongodump --uri="mongodb://..." --out=/backups/backup-$(date +%Y%m%d)
aws s3 cp /backups/backup-$(date +%Y%m%d) s3://your-bucket/
```

#### Restore from Backup

```bash
mongorestore --uri="mongodb://..." /path/to/backup
```

### Performance Optimization

#### Backend

1. Add Redis caching
2. Implement database indexing
3. Use connection pooling
4. Optimize queries
5. Enable gzip compression

#### Frontend

1. Code splitting
2. Lazy loading
3. Image optimization
4. CSS/JS minification
5. Service workers for offline support

### Monitoring & Alerting

1. **Uptime Monitoring**
   - Pingdom, UptimeRobot

2. **Error Tracking**
   - Sentry for application errors

3. **Performance Monitoring**
   - New Relic, DataDog

4. **Log Analysis**
   - CloudWatch, ELK Stack

### Scaling Strategy

#### Horizontal Scaling

- Load balancer (AWS ELB, Nginx)
- Multiple backend instances
- Stateless session management

#### Vertical Scaling

- Larger database instances
- More powerful server hardware

#### Database Optimization

- Sharding for horizontal scaling
- Replication for high availability
- Read replicas for read-heavy operations

### CI/CD Pipeline

#### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Deploy to production
        run: npm run deploy
```

### Cost Optimization

1. Use free tiers where applicable
2. Optimize database queries
3. Compress media files
4. Use CDN for static assets
5. Monitor and cleanup unused resources

### Post-Deployment

1. Set up monitoring dashboards
2. Create runbooks for common issues
3. Test backup and restore procedures
4. Train team on deployment process
5. Document configuration and architecture

### Emergency Contacts

Keep critical information:

- Database credentials (encrypted)
- API keys and secrets
- Hosting provider support
- Development team contact info

---

For additional help, contact your DevOps team or hosting provider support.
