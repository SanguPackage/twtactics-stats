<?php
require 'func.php';
require 'vendor/autoload.php';

$mysqli = get_mysqli();
if ($mysqli->connect_errno) {
	echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;

} else {
	$query =
		"SELECT DATE_FORMAT(downloaddate, '%Y-%m-%d') AS day, count(0) AS amount FROM twsnapshotdownloads
		WHERE downloaddate > NOW() - INTERVAL 1 MONTH
		GROUP BY DATE_FORMAT(downloaddate, '%Y-%m-%d')
		ORDER BY DATE_FORMAT(downloaddate, '%Y-%m-%d') DESC";

	if ($result = $mysqli->query($query)) {
		while ($row = $result->fetch_assoc()) {
			$row['day'] = date("d M Y", strtotime($row['day']));

			$downloads[] = $row;
		}

		$result->free();
	}

	$query =
		"SELECT server, world, player, count(0) downloads, DATE_FORMAT(MIN(downloaddate), '%d %M %Y') AS FirstDate,
					DATE_FORMAT(MAX(downloaddate), '%d %M %Y') AS LastDate
		FROM twsnapshotdownloads
		WHERE player<>''
		GROUP BY server, world, player
		HAVING downloads>5
		ORDER BY MAX(downloaddate) DESC";

	if ($result = $mysqli->query($query)) {
		while ($row = $result->fetch_assoc()) {
			$users[] = $row;
		}

		$result->free();
	}

	$mysqli->close();

	$templates = new League\Plates\Engine('./templates');
	echo $templates->render('stats', ['downloads' => $downloads, 'users' => $users]);
}
?>