<?php
require 'func.php';
require 'vendor/autoload.php';

$mysqli = get_mysqli();
if ($mysqli->connect_errno) {
	echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;

} else {
	$fetchAll = function($sql) use ($mysqli) {
		$rows = [];
		if ($result = $mysqli->query($sql)) {
			$rows = $result->fetch_all(MYSQLI_ASSOC);
			$result->free();
		}
		return $rows;
	};

	$totals = $fetchAll(
		"SELECT COUNT(0) AS downloads, COUNT(DISTINCT player) AS players, COUNT(DISTINCT tribe) AS tribes,
				COUNT(DISTINCT world) AS worlds, COUNT(DISTINCT server) AS servers,
				YEAR(MIN(downloaddate)) AS firstYear, YEAR(MAX(downloaddate)) AS lastYear
		FROM twsnapshotdownloads")[0];

	$perYear = $fetchAll(
		"SELECT YEAR(downloaddate) AS year, COUNT(0) AS downloads
		FROM twsnapshotdownloads
		GROUP BY YEAR(downloaddate)
		ORDER BY YEAR(downloaddate)");

	$topServers = $fetchAll(
		"SELECT server, COUNT(0) AS downloads
		FROM twsnapshotdownloads
		GROUP BY server
		ORDER BY downloads DESC
		LIMIT 10");

	$users = $fetchAll(
		"SELECT server, world, player, COUNT(0) AS downloads,
				DATE_FORMAT(MIN(downloaddate), '%d %M %Y') AS FirstDate,
				DATE_FORMAT(MAX(downloaddate), '%d %M %Y') AS LastDate
		FROM twsnapshotdownloads
		WHERE player <> ''
		GROUP BY server, world, player
		HAVING downloads > 5
		ORDER BY downloads DESC
		LIMIT 50");

	$mysqli->close();

	$templates = new League\Plates\Engine('./templates');
	echo $templates->render('stats', [
		'totals' => $totals,
		'perYear' => $perYear,
		'topServers' => $topServers,
		'users' => $users,
	]);
}
?>
