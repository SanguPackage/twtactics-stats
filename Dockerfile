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
# Serve the stats dashboard at / while keeping the root ingestion endpoints reachable.
COPY apache-vhost.conf /etc/apache2/sites-available/000-default.conf
EXPOSE 80

# Coolify reads this to gate traffic. Uses PHP (always present) instead of curl/wget
# (not in the base image) so the probe exercises the full Apache + PHP path.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD php -r 'exit(@file_get_contents("http://127.0.0.1/health.php") === "ok" ? 0 : 1);'
