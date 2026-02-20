<?php

header("Content-type:application/json");

require("DBconnection.php"); // On dispose de l'objet $DBconnection pour gérer nos requêtes

$req = "SELECT * FROM `notes_list`";

$res = $DBconnection->prepare($req);
$res -> execute();

$notes_list = $res -> fetchAll(PDO::FETCH_ASSOC);

echo json_encode($notes_list);

?>