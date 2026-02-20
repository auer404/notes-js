async function DB_getNotes() {

    const query = await fetch("backend/getNotes.php");
    return await query.json();
}

function DB_addNote(note_data_object) {

    fetch("backend/addNote.php" , {
        method:"POST",
        body:new URLSearchParams(note_data_object)
    });
}

function DB_updateNote(note_data_object) {

    fetch("backend/updateNote.php" , {
        method:"POST",
        body:new URLSearchParams(note_data_object)
    });
}

function DB_deleteNote(note_id) {

    fetch("backend/deleteNote.php" , {
        method:"POST",
        body:new URLSearchParams({note_id}) // ou {note_id: note_id} (simplifiable lorsqu'une propriété a le même nom qu'une variable / paramètre que l'on veut y renseigner)
    });
}