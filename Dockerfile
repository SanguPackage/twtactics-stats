# tw-stats.sangu.be — plain PHP 8.3 + mysqli, served by Apache. Docroot = api/.
# vendor/ is gitignored, so install league/plates from the tracked composer files.
FROM composer:2 AS vendor
WORKDIR /app
# Regenerate from composer.json: the committed lock predates Composer 2 and lacks
# the content-hash key, which breaks autoload generation.
COPY api/stats/composer.json ./
RUN composer update --no-dev --no-interaction --optimize-autoloader

FROM php:8.3-apache
RUN docker-php-ext-install mysqli
COPY api/ /var/www/html/
COPY --from=vendor /app/vendor/ /var/www/html/stats/vendor/
EXPOSE 80
