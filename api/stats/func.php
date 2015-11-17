<?php
function get_mysqli() {
	$host = 'localhost';
	$username = 'laoujin_laoujin';
	$password = 'KeepingTrackOfTheDownloads';
	$dbname = 'laoujin_twtactics';
	$port = 33060;

	if ($_SERVER["REMOTE_ADDR"] != "127.0.0.1" && $_SERVER["REMOTE_ADDR"] != "::1") {
		$port = 3306;
	}

	return new mysqli($host, $username, $password, $dbname, $port);
}
?>