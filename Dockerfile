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

CMD sh -lc "mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache && chmod -R 777 storage bootstrap/cache && php artisan config:clear && php artisan route:clear && php artisan view:clear && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}"
