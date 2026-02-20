
async function DB_getNotes() {

    const query = await fetch("backend/getNotes.php");

    return await query.json();

}