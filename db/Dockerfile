# MariaDB with the schema + data baked in. Coolify compose deploys don't fill
# relative bind mounts from the repo, so the seed must live in the image.
FROM mariadb:10.11
COPY init/ /docker-entrypoint-initdb.d/
