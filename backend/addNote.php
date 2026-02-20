<?php

require("DBconnection.php"); // On dispose de l'objet $DBconnection pour gérer nos requêtes

if (
    isset($_POST["note_id"])
 && isset($_POST["content"])
 && isset($_POST["x"])
 && isset($_POST["y"])
 ) {

    $req = "INSERT INTO `notes_list` (`note_id` , `content` , `x` , `y` ) VALUES (? , ? , ? , ?)";

    $res = $DBconnection->prepare($req);

    $res -> execute([
        $_POST["note_id"],
        $_POST["content"],
        $_POST["x"],
        $_POST["y"]
    ]);

 }

?>