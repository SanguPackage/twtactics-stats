<?php
// Liveness probe for Coolify/Docker: confirms Apache + PHP serve a request.
// Intentionally does NOT touch the DB — MariaDB has its own healthcheck, and a
// DB hiccup shouldn't mark the web container unhealthy and pull it from routing.
header('Content-Type: text/plain');
echo 'ok';
?>
