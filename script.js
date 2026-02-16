const notes_list = JSON.parse(localStorage.getItem("notes-js"));
// ! \ ATTENTION : dans le cas d'une première utilisation de l'appli, notes_list sera null, ce qui aura des conséquences sur la suite de ce qu'on veut faire à partir de notes_list

console.log("Données sauvegardées : ", notes_list);

// TODO : D'après les données récupérées via localStorage, on doit maintenant recréer toutes les notes correspondant, en HTML (via notre fonction add_note() ?)

function getNoteById(id) {
    // cette fonction doit nous fournir l'élément de notes_list portant l'id passé en paramètre,
    // ou nous indiquer qu'il n'existe pas.

    for (let n of notes_list) { // ! \ ERREUR si notes_list == null
        if (n.note_id == id) {
            // On a trouvé
            return n;
        }
    }
    return null; // On n'a rien trouvé qui corresponde (donc la boucle for s'est terminée, il n'y a pas eu de return préalable)
}


/*******************/

// On veut pouvoir faire apparaître une nouvelle note :
// - au double-clic
// - à l'endroit cliqué

const workspace = document.querySelector("#workspace");
const template = document.querySelector("#base-note-structure");

//workspace.ondblclick = add_note;
// OU (version plus propre et "cumulable") :
workspace.addEventListener("dblclick", add_note);

function add_note(e) {

    //console.log(e); // e = l'événement lui-même, on peut voir dans la console toutes les infos qu'il pourra nous donner, et on en déduit :

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    // Soit les coordonnées de la souris au moment du double-clic

    // Préparation : "import" du contenu de notre template vers notre page globale
    const clone = document.importNode(template.content, true);

    // ! \ clone n'est pas directement un élément HTML mais un "document-fragment". Si on veut le manipuler après insertion, il faut récupérer dans celui-ci le HTML qui nous intéresse : son premier (et unique dans notre cas) élément.
    const new_note = clone.firstElementChild;

    // Insertion à l'emplacement voulu :
    workspace.append(new_note);

    new_note.note_id = crypto.randomUUID(); // identifiant unique

    // Positionnement inital (en fonction des coordonnées de la souris) :
    new_note.style.top = mouseY - 10 + "px";
    new_note.style.left = mouseX - new_note.offsetWidth / 2 + "px";

    // Pour rendre la nouvelle note "glissable-déposable"
    $(new_note).draggable({
        containment: "parent",
        stop: function(e, ui) {
            //console.log(ui)
            new_note.save(); // Mettre à jour : position x/y
        }
    });

    // Activer le bouton de fermeture / suppression

    new_note.querySelector(".close-btn").addEventListener("click", function() {
        if (confirm("Supprimer cette note ?")) {
            new_note.delete_saved();
            new_note.remove(); // Ne s'exécutera que si confirm() renvoie true (ce sera le cas lorsque l'utilisateur aura cliqué sur "OK" - false si clic sur "Annuler")
        }
    });

    new_note.field = new_note.querySelector("textarea");

    // Gestion de la sauvegarde

    new_note.save = function() {
        console.log("Note sauvegardée");

        // On construit une version "sauvegardable" de notre note :
        const new_note_data = {
            note_id: new_note.note_id,
            content: new_note.field.value
        }

        // On vérifie si la note est nouvelle (à ajouter) ou existe déjà dans la sauvegarde

        const existing_note = getNoteById(new_note.note_id);

        if (!existing_note) {
            notes_list.push(new_note_data); // Ajout
        } else {
            existing_note.content = new_note_data.content; // Remplacement
            // ! \ Pourquoi pas directement existing_note = new_note_data ??? À expliquer
        }

        localStorage.setItem("notes-js", JSON.stringify(notes_list));

        console.log(localStorage.getItem("notes-js"));

    }

    new_note.delete_saved = function() {
        console.log("Note supprimée (dans la sauvegarde)");
    }

    new_note.field.addEventListener("input", new_note.save);

}

