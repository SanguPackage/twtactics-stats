<?php
require 'stats/func.php';

$mysqli = get_mysqli();
if ($mysqli->connect_errno) {
	echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}
else
{
	if ($stmt = $mysqli->prepare("insert into twsnapshotdownloads (server, world, player, tribe, ip) values (?, ?, ?, ?, ?)"))
	{
		$stmt -> bind_param("sssss", $_POST['server'], $_POST['world'], $_POST['player'], $_POST['tribe'], $_SERVER['REMOTE_ADDR']);
		$stmt -> execute();
	}

	$mysqli -> close();
}
?>