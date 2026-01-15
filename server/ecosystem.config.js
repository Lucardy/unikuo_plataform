/**
 * Configuración de PM2
 * 
 * Para iniciar: pm2 start ecosystem.config.js
 * Para reiniciar: pm2 restart ecosystem.config.js
 * Para detener: pm2 stop ecosystem.config.js
 * 
 * NOTA: PM2 requiere CommonJS para archivos de configuración,
 * por eso usamos module.exports aunque el proyecto use ES modules
 */

module.exports = {
  apps: [
    {
      name: 'unikuo-backend',
      script: 'src/index.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
    },
  ],
};
