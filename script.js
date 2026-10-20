const media = [
    {
        id: 1, 
        title: "Brokeback Mountain",
        type: "movie", 
        year: 2005, 
        genre: "Romantic drama",
        rating: "4.2/5",
        colour: "#2f312f", 
        description:
            "Two American cowboys, Ennis Del Mar and Jack Twist, develop a complex, decades-long secret love affair after herding sheep together in 1963."
    }, 
    {
        id: 2, 
        title: "Black Swan",
        type: "movie", 
        year: 2010, 
        genre: "Psychological horror",
        rating: "4.2/5",
        colour: "#33302d", 
        description:
            "A thriller that follows a dedicated ballerina whose sanity unravels as she dangerously obsesses over the lead roles in 'Swan Lake'."
    },
    {
        id: 3, 
        title: "Little Miss Sunshine",
        type: "movie", 
        year: 2006, 
        genre: "Dark comedy",
        rating: "4.2/5",
        colour: "#f3ca3c", 
        description:
            "A heartwarming film that follows a dsyfunctional family on a chaotic road trip to enter their daughter in a beauty pagent."
    },
    {
        id: 4, 
        title: "Dead Poets Society",
        type: "movie", 
        year: 1989, 
        genre: "Drama",
        rating: "4.4/5",
        colour: "#2c1e16", 
        description:
            "An English teacher inspires his strict boarding school students to challenge conformity and passionately embrace life."
    },
    {
        id: 5, 
        title: "Brooklyn Nine-Nine",
        type: "show", 
        year: 2013, 
        genre: "Comedy",
        rating: "4.19/5",
        colour: "#515c95", 
        description:
            "A workplace sitcom that follows the chaotic and heartfelt friendships of a detective squad in a Brooklyn police precinct."
    },
    {
        id: 6, 
        title: "Rick and Morty",
        type: "show", 
        year: 2013, 
        genre: "Adult animation",
        rating: "3.95/5",
        colour: "#97ce4c", 
        description:
            "An animated sci-fi show following a genius scientist, Rick, and his anxious grandson, Morty, on dangerous adventures across alternate dimensions."
    },
    {
        id: 7, 
        title: "The Office",
        type: "show", 
        year: 2005, 
        genre: "Comedy",
        rating: "4.25/5",
        colour: "#3b5998", 
        description:
            "A hilarious sitcom that follows the awkward, chaotic, and heartwarming daily lives or employees working at a Pennsylvania paper company."
    },
    {
        id: 8, 
        title: "Arcane",
        type: "movie", 
        year: 2021, 
        genre: "Animated action-adventure",
        rating: "4.43/5",
        colour: "#1b3d50", 
        description:
            "A visually stunning animated series that explores the tragic conflict between two sisters torn apart by war, magic, and technology."
    }
]; 

// find the parts of the page we need
const mediaGrid = document.querySelector("media-grid");
const watchlistGrid = document.querySelector("#watchlist-grid");
const searchInput = document.querySelector("#search");
const emptyMessage = document.querySelector("#empty-message");
const watchlistEmpty = document.querySelector("#watchlist-empty");
const filterButtons = document.querySelector(".filter-button");

// load the saved watchlist, or start with an empty one
let watchlist = [];

try {
    const saved = JSON.parse(
        localStorage.getItem("frame-watchlist") || "[]"
    );

    if (Array.isArray(saved)) {
        watchlist = saved.filter(id =>
            media.some(item => item.id === id)
        );
    }
} catch {
    watchlist = [];
}

let currentFilter = "all";

// create the HTML for one media card
function createCard(item, inWatchlist = false) {
    const card = document.createElement("article");
    card.className = "media-card";

    const poster = document.createElement("div");
    poster.className = "poster";
    poster.style.setProperty("--poster-colour", item.colour);

    const art = document.createElement("div");
    art.className = "poster-art";

    const posterTitle = document.createElement("span");
    posterTitle.className = "poster-title";
    posterTitle.textContext = item.title;

    poster.append(art, posterTitle);

    const type = document.createElement("span");
    type.className = "media-type";
    type.textContent = 
        item.type === "movie" ? "Movie" : "TV Series";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const meta = document.createElement("p");
    meta.className = "card-meta";
    meta.textContent = `${item.year} · ${item.genre}`;

    const rating = document.createElement("p");
    rating.className = "rating";
    rating.textContent = item.rating === null
        ? "Rating not added yet"
        : `${item.type === "movie" ? "Letterboxd" : "Serializd"}: ${item.rating}`;
    
    const actions = document.createElement("div");
    actions.className = "card-actions";

    const detailsButton = document.createElement("button");
    detailsButton.className = "card-button";
    detailsButton.textContent = "Details";
    detailsButton.addEventListener("click", () => {
        alert(
            `${item.title}\n\n${item.year} · ${item.genre}\n\n${item.description}`
        );
    });

    const watchButton = document.createElement("button");
    watchButton.className = "card-button";

    function updateWatchButton() {
        watchButton.textContent = watchlist.includes(item.id)
            ? "✓ Saved"
            : "+ Watchlist";
    }

    updateWatchButton();

    watchButton.addEventListener("click", () => {
        if (watchlist.includes(item.id)) {
            watchlist = watchlist.filter(id => id !== item.id);
        } else {
            watchlist.push(item.id);
        }

        localStorage.setItem(
            "frame-watchlist",
            JSON.stringify(watchlist)
        );

        renderMedia();
    });

    // keep the buttons up to date
    actions.append(detailsButton, watchButton);
    card.append(poster, type, title, meta, rating, actions);

    return card;
}

// display the collection and saved watchlist
function renderMedia() {
    const query = searchInput.ariaValueMax.trim().toLowerCase();

    const filteredMedia = media.filter(item => {
        const matchesFilter =
            currentFilter === "all" ||
            item.type === currentFilter;
        
        const searchableText = 
            `${item.title} ${item.genre} ${item.year}`.toLowerCase();

        return matchesFilter && searchableText.includes(query)
    });

    mediaGrid.replaceChildren();

    filteredMedia.forEach(item => {
        mediaGrid.appendChild(createCard(item));
    });

    emptyMessage.hidden = filteredMedia.length !== 0;

    watchlistGrid.replaceChildren();

    const savedMedia = media.filter(item =>
        watchlist.includes(item.id)
    );

    savedMedia.forEach(item => {
        watchlistGrid.appendChild(createCard(item, true));
    });

    watchlistEmpty.hidden = savedMedia.length !== 0;
}

// search as the user types
searchInput.addEventListener("input", renderMedia);

// change between everything, movies and tv shows
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(otherButton => {
            otherButton.classList.toggle(
                "active",
                otherButton === button
            );
        });

        renderMedia();
    });
});

// draw everything when the page first loads
renderMedia();