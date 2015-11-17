<?php
require 'func.php';

$mysqli = get_mysqli();
if ($mysqli->connect_errno) {
	echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;

} else {
	$query = "SELECT server, world, player, tribe, downloaddate, ip FROM twsnapshotdownloads";

	if ($result = $mysqli->query($query)) {
		while ($row = $result->fetch_assoc()) {
			$downloads[] = auto_cast($row);
		}

		$result->free();

		echo json_encode($downloads);
	}
}
?>