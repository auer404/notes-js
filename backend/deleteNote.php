<?php

require("DBconnection.php"); // On dispose de l'objet $DBconnection pour gérer nos requêtes

if (isset($_POST["note_id"])) {

    $req = "DELETE FROM `notes_list` WHERE `note_id` = ?";

    $res = $DBconnection->prepare($req);

    $res -> execute([$_POST["note_id"]]);

 }

 ?>