const mainURL = "http://localhost:8000/api/v1/titles/"


//* Gestion du meilleur film
async function getBest() {
    // Récupération des informations de l'API
    const response = await fetch(mainURL + "?sort_by=-imdb_score");
    const data = await response.json();
    const best = await fetch(data["results"][0]["url"])
    const dataBest = await best.json()
    console.log(data);
    console.log(data["results"][0]["title"]);
    console.log(dataBest);
    // Affichage des informations dans le HTML
    document.getElementById("best-title").innerText = dataBest.title;
    document.getElementById("best-picture").src = dataBest.image_url;
    document.getElementById("best-description").innerText = dataBest.description;
    const bestModalBtn = document.getElementsByClassName("modal-btn")[0];
    bestModalBtn.setAttribute("onclick", `openModal(${dataBest.id})`);

}

//* Gestion des 7 meilleurs film
async function getSevenBest(numberFilm, categorie){
    const response = await fetch(mainURL + "?sort_by=-imdb_score&page_size=" + numberFilm + "&genre=" + categorie)
    const sevenBest = await response.json();
    console.log("La liste des 7 meilleurs film du site");
    console.log(sevenBest);
}

//* gestion de la modale
const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-triggers");

modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))

function toggleModal(){
    modalContainer.classList.toggle("active");
}

async function openModal(movieId) {
    modalContainer.classList.toggle("active");
    await openModalData(movieId)
}

function closeModal(){
    modalContainer.classList.toggle("active");
}
// Information afficher dans la modale
async function openModalData(movieId) {
    const response = await fetch(mainURL + movieId);
    const data = await response.json();
    console.log("resultat de la data");
    console.log(data);
    document.getElementById("modal-picture").src = data.image_url;
    document.getElementById("modal-title").innerText = data.title;
    document.getElementById("modal-genre").innerText = "Genre : " + data.genres;
    document.getElementById("modal-date").innerText = "Date de sortie du film : " + data.date_published;
    
    document.getElementById("modal-score").innerText = "Note JustStreamIt : " + data.imdb_score;
    document.getElementById("modal-description").innerText = "Description du film :\n " + data.long_description;
    document.getElementById("modal-director").innerText = "Réalisateur : " + data.directors;
    document.getElementById("modal-actors").innerText = "Acteurs : " + data.actors;
    document.getElementById("modal-duration").innerText = "Durée du film : " + data.duration + " Minutes";
    document.getElementById("modal-country").innerText = "Pays d'origine : " + data.countries;
    document.getElementById("modal-country").innerText = "Pays d'origine : " + data.countries;
    
    if (data.rated = "Not rated or unkown rating")
        document.getElementById("modal-rated").innerText = "Note : Pas de note pour le moment";
    else
        document.getElementById("modal-rated").innerText = "Note : " + data.rated;
    
    if (data.worldwide_gross_income == null)
        document.getElementById("modal-box").innerText = "Résultat Box Office : Pas de résultat";
    else
        document.getElementById("modal-box").innerText = "Résultat Box Office : " + data.worldwide_gross_income;

    document.getElementsByClassName("close-modal")[0].setAttribute("onclick" , closeModal)
}  


window.addEventListener('load', () => {
    getBest()
    getSevenBest(7, "drama")
});

