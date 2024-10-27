<?php
function get_mysqli() {
	$host = 'sangu.be.mysql';
	$username = 'sangu_betwtactics';
	$password = '';
	$dbname = 'sangu_betwtactics';
	$port = 3306;

	if ($_SERVER["REMOTE_ADDR"] != "127.0.0.1" && $_SERVER["REMOTE_ADDR"] != "::1") {
		$port = 3306;
	}

	return new mysqli($host, $username, $password, $dbname, $port);
}

function auto_cast($row) {
	foreach ($row as $key => $value) {
		if (ctype_digit($value)) {
			$row[$key] = (int) $value;
		}
		elseif (is_numeric($value)) {
			$row[$key] = (float) $value;
		}
		else {
			$row[$key] = (string) $value;
		}
	}
	return $row;
}
?>
