<?php
require 'vendor/autoload.php';

$mysqli = new mysqli("localhost", "laoujin_laoujin", "KeepingTrackOfTheDownloads", "laoujin_twtactics");
if ($mysqli->connect_errno) {
	echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;

} else {
	$query =
		"SELECT DATE_FORMAT(downloaddate, '%Y%m%d') AS day, count(0) AS amount FROM twsnapshotdownloads
		GROUP BY DATE_FORMAT(downloaddate, '%Y%m%d')
		ORDER BY DATE_FORMAT(downloaddate, '%Y%m%d') DESC";

	if ($result = $mysqli->query($query)) {
		while ($row = $result->fetch_assoc()) {
			//printf ("%s (%s)<br>", $row["day"], $row["amount"]);
			$downloads[] = $row;
		}

		$result->free();
	}
	$mysqli->close();

	$templates = new League\Plates\Engine('./templates');
	echo $templates->render('stats', ['downloads' => $downloads]);
}
?>