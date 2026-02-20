const workspace = document.querySelector("#workspace");
const template = document.querySelector("#base-note-structure");

const notes_list = JSON.parse(localStorage.getItem("notes-js")) || [];
// "|| []" -> notes_list correspondra SI POSSIBLE à ce qu'on trouve dans localStorage. Dans le cas inverse (localStorage null), on basculera sur un tableau vide.
// Ici on fait en sorte que, si notre sauvegarde (le bon emplacement de localStorage) est vide, on utilisera tout de même un tableau. Sans cela, notes_list peut être null, ce qui poserait problème dans la suite du script (dès que l'on tente de passer en revue notes_list)

console.log("Données sauvegardées : ", notes_list);

// Création des notes correspondant aux données (peut-être) sauvegardées précédemment
for (let n of notes_list) {
    add_note(n);
}


function getNoteById(id) {
    // cette fonction doit nous fournir l'élément de notes_list portant l'id passé en paramètre,
    // ou nous indiquer qu'il n'existe pas.

    for (let n of notes_list) {
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

//workspace.ondblclick = add_note;
// OU (version plus propre et "cumulable") :
workspace.addEventListener("dblclick", add_note);

function add_note(e) { // ! \ selon le cas, e pourra correspondre à deux objets de nature différente

    //console.log(e); // e = l'événement lui-même, on peut voir dans la console toutes les infos qu'il pourra nous donner, et on en déduit :

    // Soit les coordonnées de la souris au moment du double-clic

    // Préparation : "import" du contenu de notre template vers notre page globale
    const clone = document.importNode(template.content, true);

    // ! \ clone n'est pas directement un élément HTML mais un "document-fragment". Si on veut le manipuler après insertion, il faut récupérer dans celui-ci le HTML qui nous intéresse : son premier (et unique dans notre cas) élément.
    const new_note = clone.firstElementChild;

    // Insertion à l'emplacement voulu :
    workspace.append(new_note);

    new_note.field = new_note.querySelector("textarea");

    if (e.clientX && e.clientY) { // Scénario "double-clic" -> NOUVELLE note
        
        new_note.x = e.clientX;
        new_note.y = e.clientY;
        new_note.note_id = crypto.randomUUID(); // identifiant unique

    } else { // Scénario "chargement de la sauvegarde"

        new_note.x = e.x;
        new_note.y = e.y;
        new_note.note_id = e.note_id;
        new_note.field.value = e.content;
    }

    // Positionnement inital (en fonction des coordonnées de la souris) :
    new_note.style.top = new_note.y - 10 + "px";
    new_note.style.left = new_note.x - new_note.offsetWidth / 2 + "px";

    // Pour rendre la nouvelle note "glissable-déposable"
    $(new_note).draggable({
        containment: "parent",
        // zIndex:1,
        stack:".note",
        stop: function(e, ui) {
            //console.log(ui);
            new_note.x = ui.position.left + new_note.offsetWidth / 2;
            new_note.y = ui.position.top + 10;
            new_note.save();
            new_note.field.focus(); // On donne la sélection au champ texte
        }
    });

    // Système anti suppression accidentelle de note vide (événement blur)

    new_note.addEventListener("mousedown" , function(){
        new_note.beforeDragStart = true;
        // Sera testé avant suppression auto -> annulation
    });

    new_note.addEventListener("mouseup" , function(){
        new_note.beforeDragStart = false;
        // Permet de rendre à nouveau possible la suppression auto
    });

    // Activer le bouton de fermeture / suppression

    new_note.querySelector(".close-btn").addEventListener("click", function() {
        if (confirm("Supprimer cette note ?")) {
            new_note.delete_saved();
            new_note.remove(); // Ne s'exécutera que si confirm() renvoie true (ce sera le cas lorsque l'utilisateur aura cliqué sur "OK" - false si clic sur "Annuler")
        }
    });

    // Gestion de la sauvegarde

    new_note.save = function() {

        if (new_note.field.value == "") {
            return; // Si le champ est vide, on abandonne la sauvegarde
        }
     
        // On construit une version "sauvegardable" de notre note :
        const new_note_data = {
            note_id: new_note.note_id,
            content: new_note.field.value,
            x: new_note.x,
            y: new_note.y
        }

        // On vérifie si la note est nouvelle (à ajouter) ou existe déjà dans la sauvegarde

        const existing_note = getNoteById(new_note.note_id);

        if (!existing_note) {
            notes_list.push(new_note_data); // Ajout
        } else {
            // existing_note = new_note_data; // Ne fonctionnera pas : on ne remplacera qu'une référence à notre objet sauvegardé, rien ne changera dans notes_list. Pour contourner ce problème, on peut atteindre directement les propriétés de notre objet :
            existing_note.content = new_note_data.content;
            existing_note.x = new_note_data.x;
            existing_note.y = new_note_data.y;
        }

        localStorage.setItem("notes-js", JSON.stringify(notes_list));

    }

    new_note.delete_saved = function() {

        const note_to_delete = getNoteById(new_note.note_id);

        // 1) On cherche l'indice de notre note dans la liste
        const note_index = notes_list.indexOf(note_to_delete);
   
        // 2) Ce qui permet de supprimer cette note dans la liste
        if (note_index != -1) { // On s'assure que note_to_delete se trouve bien dans la liste (indexOf() renvoie -1 dans le cas contraire)
            notes_list.splice(note_index , 1);
            localStorage.setItem("notes-js", JSON.stringify(notes_list));
        }
    }

    new_note.resize_field = function() {
        new_note.field.style.height = ""; // RaZ -> permet d'établir un nouveau scrollHeight cohérent
        new_note.field.style.height = new_note.field.scrollHeight + "px";
        // On fait correspondre la hauteur du champ à la hauteur de son contenu scrollable.
    }

    new_note.resize_field();

    new_note.field.addEventListener("input", new_note.save);

    new_note.field.addEventListener("input", new_note.resize_field);

    new_note.field.addEventListener("blur", function(){
        
        setTimeout(function(){

            // beforeDragStart (booleen) : true entre le moment où on s'apprête à déplacer la note (mousedown) et le moment où on la dépose à son nouvel emplacement (mouseup) -> Permet d'éviter de supprimer accidentellement une note vide en voulant seulement la déplacer.
            if (new_note.field.value == "" && !new_note.beforeDragStart) {
                new_note.delete_saved();
                new_note.remove();
            }

        },100);

    });

    // Intercepter les double-clics sur les notes
    // (Pour éviter qu'ils occasionnent la création d'une nouvelle note)
    new_note.addEventListener("dblclick", function(e){
        e.stopPropagation();
        // Le fait qu'on déclenche quelque chose au double-clic sur le conteneur de nos notes, provoque le même déclenchement lorsqu'on clique sur un élément enfant de ce conteneur (donc une note). Cela s'appelle la propagation d'événements, et on peut l'empêcher via stopPropagation().
        // -> Un double-clic détecté sur une note ne sera pas propagé "derrière" elle (et ne déclenchera pas l'événement double-clic du conteneur)
    });

    new_note.field.focus(); // On donne la sélection au champ texte

}

window.addEventListener("beforeunload", function(e){
    // ! \ NE MARCHE PAS POUR L'INSTANT
    // Si l'une de nos notes est sélectionnée (son champ texte a le focus) : lui faire perdre le focus
    console.log(document.activeElement);
    document.activeElement.blur();
    //e.preventDefault();
    
});

/* //* TODO
- Suppression notes vides lorsqu'on quitte / recharge la page - > A CORRIGER

*/