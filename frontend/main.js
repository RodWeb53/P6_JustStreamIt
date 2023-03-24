const mainURL = "http://localhost:8000/api/v1/titles/"

//--- Gestion du meilleur film ---\\
async function getBest() {
    // Récupération des informations de l'API
    const response = await fetch(mainURL + "?sort_by=-imdb_score");
    const data = await response.json();
    // Récupération du détail du meilleur film
    const best = await fetch(data["results"][0]["url"])
    const dataBest = await best.json()
    // Affichage des informations dans le HTML
    document.getElementById("best-title").innerText = dataBest.title;
    document.getElementById("best-picture").src = dataBest.image_url;
    document.getElementById("best-description").innerText = dataBest.description;
    const bestModalBtn = document.getElementsByClassName("modal-btn")[0];
    bestModalBtn.setAttribute("onclick", `openModal(${dataBest.id})`);
};

//--- Gestion des 7 meilleurs film pour une catégorie ---\\
async function getNumberFilm(numberFilm, categorie){
    if (categorie == "best")
        categorie = ""
    const response = await fetch(mainURL + "?sort_by=-imdb_score&page_size=" + numberFilm + "&genre=" + categorie)
    if (!response.ok)
        return
    const numberFilms = await response.json();
    return numberFilms
};

//--- Création du carousel ---\\
async function createCarrousel(numberFilm, categorie) {
    const dataFilms = await getNumberFilm(numberFilm, categorie)
    // Fonctionnalité pour enlever le meilleur film de la liste best
    if (categorie == "best")
        dataCarousel = dataFilms.results.splice(0, 1)
    dataCarousel = dataFilms
    // Construction des balises du HTML
    const sectionCategorie = document.getElementById("categories");
    
    const wrapper = document.createElement('div');
    wrapper.classList.add("slide-container");

    const title = document.createElement('div');
    title.classList.add("title");
    
    const categoryTitle = document.createElement('h2');
    categoryTitle.innerHTML = categorie

    const buttonPrev = document.createElement('img');
    buttonPrev.classList.add('arrow');
    buttonPrev.setAttribute("id", categorie + '-slide-left');
    buttonPrev.src = "./img/arrow-left.png";

    const carouselConst = document.createElement('section');
    carouselConst.classList.add("container");
    carouselConst.setAttribute("id", categorie);
    
    const buttonNext = document.createElement('img');
    buttonNext.classList.add('arrow');
    buttonNext.setAttribute("id", categorie + '-slide-right');
    buttonNext.src = "./img/arrow-right.png";
    
    // Boucle pour créer les 7 affiches de film dans le carousel
    for( i in dataCarousel.results){
        const film = document.createElement('div');
        const cover = document.createElement('img');

        film.classList.add('thumbnail');
        cover.src = dataCarousel.results[i].image_url;
        cover.setAttribute("onclick", `openModal(${dataCarousel.results[i].id})`)

        film.appendChild(cover);
        carouselConst.appendChild(film);
    }
    // Construction du HTML
    sectionCategorie.appendChild(title);
    title.appendChild(categoryTitle);
    sectionCategorie.appendChild(wrapper);
    wrapper.appendChild(buttonPrev);
    wrapper.appendChild(carouselConst);
    wrapper.appendChild(buttonNext);

    // Gestion des boutons de défilement du carousel 
    let slider = document.getElementById(categorie);

    buttonPrev.addEventListener("click", movePrev);
    buttonNext.addEventListener("click", moveNext);

    function movePrev(){
        slider.scrollLeft -= 220;
    }
    function moveNext(){
        slider.scrollLeft += 220;
    }

};

//--- Gestion de la modale ---\\
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
// Informations affichées dans la modale
async function openModalData(movieId) {
    const response = await fetch(mainURL + movieId);
    const data = await response.json();

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

//--- Création d'une fonction async pour l'affichage du carousel dans l'ordre ---\\
async function viewCarousel(){
    await createCarrousel(8, "best"),
    await createCarrousel(7, "Crime"),
    await createCarrousel(7, "Biography"),
    await createCarrousel(7, "Family")
};

//--- Chargement du JS dans le HTML ---\\
window.addEventListener('load', () => {
    getBest();
    viewCarousel()
});

