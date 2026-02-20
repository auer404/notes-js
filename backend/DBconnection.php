<?php

// Module de connexion : à inclure en premier lieu dans chaque script devant manipuler la BDD.

$db_server = "localhost";
$db_username = "root";
$db_password = "root"; // ou "" ?
$db_name = "notes-js-2026";

$DBconnection = new PDO("mysql:host=$db_server;dbname=$db_name", $db_username, $db_password);

?>