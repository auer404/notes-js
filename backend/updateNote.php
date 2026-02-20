<?php

require("DBconnection.php"); // On dispose de l'objet $DBconnection pour gérer nos requêtes

if (
    isset($_POST["note_id"])
 && isset($_POST["content"])
 && isset($_POST["x"])
 && isset($_POST["y"])
 ) {

    $req = "UPDATE `notes_list` SET `content` = ? , `x` = ? , `y`= ? WHERE `note_id` = ?";

    $res = $DBconnection->prepare($req);

    $res -> execute([
        $_POST["content"],
        $_POST["x"],
        $_POST["y"],
        $_POST["note_id"]
    ]);

 }

 ?>