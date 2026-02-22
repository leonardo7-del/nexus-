FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev libicu-dev libonig-dev libxml2-dev gnupg \
    && docker-php-ext-install pdo_mysql mbstring zip intl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN mkdir -p storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

RUN chmod -R 777 storage bootstrap/cache

RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

RUN cp .env.example .env

RUN php artisan key:generate --force

RUN npm ci --include=dev --no-audit --no-fund

RUN npm run build

RUN rm -f .env

EXPOSE 8080

CMD sh -lc "set -eu; \
export DB_CONNECTION=\"${DB_CONNECTION:-mysql}\"; \
export DB_HOST=\"${DB_HOST:-${MYSQLHOST:-127.0.0.1}}\"; \
export DB_PORT=\"${DB_PORT:-${MYSQLPORT:-3306}}\"; \
export DB_DATABASE=\"${DB_DATABASE:-${MYSQLDATABASE:-laravel}}\"; \
export DB_USERNAME=\"${DB_USERNAME:-${MYSQLUSER:-root}}\"; \
export DB_PASSWORD=\"${DB_PASSWORD:-${MYSQLPASSWORD:-}}\"; \
if [ -z \"${DB_PASSWORD}\" ]; then echo 'ERROR: DB_PASSWORD is empty. Set DB_PASSWORD (or MYSQLPASSWORD) in Railway variables.'; exit 1; fi; \
echo '--- ENV DB DEBUG ---'; \
env | grep -E '^DB_CONNECTION=|^DB_HOST=|^DB_PORT=|^DB_DATABASE=|^DB_USERNAME='; \
mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache; \
chmod -R 777 storage bootstrap/cache; \
php artisan optimize:clear; \
php artisan migrate --force; \
php artisan queue:work --sleep=1 --tries=3 --timeout=60 & \
php artisan serve --host=0.0.0.0 --port=${PORT:-8080}"
