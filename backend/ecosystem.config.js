/**
 * PM2 Ecosystem Configuration
 * Production में backend को manage करने के लिए
 * 
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 save
 *   pm2 startup
 */

module.exports = {
  apps: [
    {
      name: 'atharvahelth-backend',
      script: './dist/server.js',
      instances: 1, // Production में 1 instance, scale करने के लिए 'max' use करें
      exec_mode: 'fork', // 'cluster' mode use करने के लिए 'cluster' set करें
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      // Logging
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      // Auto restart
      watch: false, // Production में false
      max_memory_restart: '500M', // Memory limit
      // Restart policy
      min_uptime: '10s',
      max_restarts: 10,
      // Advanced
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};

