


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

    // Positionnement inital (en fonction des coordonnées de la souris) :
    new_note.style.top = mouseY - 10 + "px";
    new_note.style.left = mouseX - new_note.offsetWidth / 2 + "px";

    // Pour rendre la nouvelle note "glissable-déposable"
    $(new_note).draggable({
        containment: "parent"
    });

}