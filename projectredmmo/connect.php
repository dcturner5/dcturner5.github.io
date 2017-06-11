<?php
$user = 'gamma';
$pass = 'zj6Xcm15';
$name = 'projectred';
$dbh = null;

try {
    $dbh = new PDO('mysql:host=138.197.199.138;dbname='.$name, $user, $pass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    print "Error: " . $e->getMessage() . "<br/>";
    die();
}