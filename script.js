// je sélectionne les éléments dans l'HTML
const pokemonContainer = document.querySelector(".pokemon-container");

const spinner = document.querySelector("#spinner");

const précédent = document.querySelector("#précédent");

const suivant = document.querySelector("#suivant");

// j'initialise les variables limit et offset
let limit = 8;
let offset = 1;

// j'ajoute un écouteur d'événements sur le clic du bouton précédent
previous.addEventListener("click", () => {
  // Vérifie si l'offset n'est pas égal à 1
  if (offset != 1) {
    // Décrémente l'offset de 9
    offset -= 9;
    // Supprime tous les enfants de pokemonContainer
    removeChildNodes(pokemonContainer);
    // Appelle la fonction fetchPokemons avec le nouvel offset et la limite
    fetchPokemons(offset, limit);
  }
});

// Ajoute un écouteur d'événements sur le clic du bouton suivant
next.addEventListener("click", () => {
  // Incrémente l'offset de 9
  offset += 9;
  // Supprime tous les enfants de pokemonContainer
  removeChildNodes(pokemonContainer);
  // Appelle la fonction fetchPokemons avec le nouvel offset et la limite
  fetchPokemons(offset, limit);
});

// Définit la fonction pour récupérer les données d'un seul Pokémon en fonction de son ID
function fetchPokemon(id) {
  // Effectue une requête HTTP GET pour récupérer les données du Pokémon spécifié par son ID
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    // Transforme la réponse en format JSON
    .then((res) => res.json())
    // Utilise les données récupérées pour créer un élément représentant le Pokémon
    .then((data) => {
      createPokemon(data); // Appelle la fonction createPokemon avec les données du Pokémon
      spinner.style.display = "none"; // Cache l'élément spinner une fois que les données sont chargées
    });
}

// Définit la fonction pour récupérer plusieurs Pokémon en fonction d'un offset et d'une limite
function fetchPokemons(offset, limit) {
  // Affiche le spinner pour indiquer le chargement
  spinner.style.display = "block";
  // Effectue une boucle pour récupérer les données de chaque Pokémon dans la plage spécifiée
  for (let i = offset; i <= offset + limit; i++) {
    fetchPokemon(i); // Appelle la fonction fetchPokemon pour récupérer les données de chaque Pokémon
  }
}

// Définit la fonction pour créer un élément HTML représentant un Pokémon
function createPokemon(pokemon) {
  // Crée une div pour représenter une carte Pokémon (utilisée pour la mise en page CSS)
  const flipCard = document.createElement("div");
  flipCard.classList.add("flip-card");

  // Crée une div pour contenir les éléments de la carte Pokémon
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");

  // Ajoute la div du conteneur de carte à la div flipCard
  flipCard.appendChild(cardContainer);

  // Crée une div pour représenter la face avant de la carte Pokémon
  const card = document.createElement("div");
  card.classList.add("pokemon-block");

  // Crée une div pour contenir l'image du Pokémon
  const spriteContainer = document.createElement("div");
  spriteContainer.classList.add("img-container");

  // Crée une balise img pour afficher l'image du Pokémon
  const sprite = document.createElement("img");
  sprite.src = pokemon.sprites.front_default; // Définit la source de l'image du Pokémon

  // Ajoute l'image du Pokémon à son conteneur
  spriteContainer.appendChild(sprite);

  // Crée un paragraphe pour afficher le numéro du Pokémon
  const number = document.createElement("p");
  number.textContent = `#${pokemon.id.toString().padStart(3, 0)}`; // Formate le numéro du Pokémon

  // Crée un paragraphe pour afficher le nom du Pokémon
  const name = document.createElement("p");
  name.classList.add("name");
  name.textContent = pokemon.name; // Récupère et affiche le nom du Pokémon

  // Ajoute l'image, le numéro et le nom du Pokémon à la div card
  card.appendChild(spriteContainer);
  card.appendChild(number);
  card.appendChild(name);

  // Crée une div pour représenter la face arrière de la carte Pokémon
  const cardBack = document.createElement("div");
  cardBack.classList.add("pokemon-block-back");

  // Ajoute les barres de progression des statistiques du Pokémon à la face arrière de la carte
  cardBack.appendChild(progressBars(pokemon.stats));

  // Ajoute les deux faces de la carte Pokémon au conteneur de carte
  cardContainer.appendChild(card);
  cardContainer.appendChild(cardBack);

  // Ajoute la carte Pokémon au conteneur principal de Pokémon
  pokemonContainer.appendChild(flipCard);
}

// Définit la fonction pour créer des barres de progression représentant les statistiques d'un Pokémon
function progressBars(stats) {
  // Crée une div pour contenir toutes les barres de progression des statistiques
  const statsContainer = document.createElement("div");
  statsContainer.classList.add("stats-container");

  // Parcourt les trois premières statistiques du Pokémon
  for (let i = 0; i < 3; i++) {
    const stat = stats[i]; // Récupère la statistique actuelle

    // Calcule la largeur de la barre de progression en fonction de la statistique de base du Pokémon
    const statPercent = stat.base_stat / 2 + "%";

    // Crée une div pour contenir chaque statistique et sa barre de progression
    const statContainer = document.createElement("div");
    statContainer.classList.add("stat-container");

    // Crée un paragraphe pour afficher le nom de la statistique
    const statName = document.createElement("p");
    statName.textContent = stat.stat.name; // Récupère et affiche le nom de la statistique

    // Crée une div pour représenter la barre de progression
    const progress = document.createElement("div");
    progress.classList.add("progress");

    // Crée la barre de progression proprement dite
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.setAttribute("aria-valuenow", stat.base_stat);
    progressBar.setAttribute("aria-valuemin", 0);
    progressBar.setAttribute("aria-valuemax", 200);
    progressBar.style.width = statPercent; // Définit la largeur de la barre de progression
    progressBar.textContent = stat.base_stat; // Affiche la valeur de la statistique sur la barre de progression

    // Ajoute la barre de progression à la div de progression
    progress.appendChild(progressBar);

    // Ajoute le nom de la statistique et sa barre de progression au conteneur de statistiques
    statContainer.appendChild(statName);
    statContainer.appendChild(progress);

    // Ajoute le conteneur de statistiques à la div principale
    statsContainer.appendChild(statContainer);
  }

  // Retourne la div contenant toutes les barres de progression
  return statsContainer;
}

// Définit une fonction pour supprimer tous les enfants d'un élément HTML
function removeChildNodes(parent) {
  // Tant que l'élément parent a un premier enfant
  while (parent.firstChild) {
    // Supprime le premier enfant de l'élément parent
    parent.removeChild(parent.firstChild);
  }
}

// Appelle la fonction fetchPokemons pour charger les premiers Pokémon au chargement de la page
fetchPokemons(offset, limit);


// Fonction pour rechercher un Pokémon
function searchPokemon() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const pokemonCards = document.querySelectorAll('.flip-card');
    
    pokemonCards.forEach(card => {
        const pokemonName = card.querySelector('.name').textContent.toLowerCase();
        if (pokemonName.includes(searchInput)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
