<?php
require_once( 'db.inc.php' );

$con->query("
	INSERT INTO upslide_downloads (ipaddress)
	VALUES('".$_SERVER['REMOTE_ADDR']."')
");

header('location: ../downloads/UpSlide-1.2.zip');
?>