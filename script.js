const media = [
    {
        id: 1, 
        title: "Brokeback Mountain",
        type: "movie", 
        year: 2005, 
        genre: "Romantic drama",
        rating: "4.2/5",
        colour: "#2f312f", 
        symbol: "⛰︎",
        description:
            "Two American cowboys, Ennis Del Mar and Jack Twist, develop a complex, decades-long secret love affair after herding sheep together in 1963.",
        poster: ""
    }, 
    {
        id: 2, 
        title: "Black Swan",
        type: "movie", 
        year: 2010, 
        genre: "Psychological horror",
        rating: "4.2/5",
        colour: "#33302d", 
        symbol: "𝜗𝜚",
        description:
            "A thriller that follows a dedicated ballerina whose sanity unravels as she dangerously obsesses over the lead roles in 'Swan Lake'.",
        poster: ""
    },
    {
        id: 3, 
        title: "Little Miss Sunshine",
        type: "movie", 
        year: 2006, 
        genre: "Dark comedy",
        rating: "4.2/5",
        colour: "#f3ca3c", 
        symbol: "☀︎",
        description:
            "A heartwarming film that follows a dsyfunctional family on a chaotic road trip to enter their daughter in a beauty pagent.",
        poster: ""
    },
    {
        id: 4, 
        title: "Dead Poets Society",
        type: "movie", 
        year: 1989, 
        genre: "Drama",
        rating: "4.4/5",
        colour: "#2c1e16", 
        symbol: "✎",
        description:
            "An English teacher inspires his strict boarding school students to challenge conformity and passionately embrace life.",
        poster: ""
    },
    {
        id: 5, 
        title: "Brooklyn Nine-Nine",
        type: "show", 
        year: 2013, 
        genre: "Comedy",
        rating: "4.19/5",
        colour: "#515c95", 
        symbol: "⛊",
        description:
            "A workplace sitcom that follows the chaotic and heartfelt friendships of a detective squad in a Brooklyn police precinct.",
        poster: ""
    },
    {
        id: 6, 
        title: "Rick and Morty",
        type: "show", 
        year: 2013, 
        genre: "Adult animation",
        rating: "3.95/5",
        colour: "#97ce4c", 
        symbol: "⚛",
        description:
            "An animated sci-fi show following a genius scientist, Rick, and his anxious grandson, Morty, on dangerous adventures across alternate dimensions.",
        poster: ""
    },
    {
        id: 7, 
        title: "The Office",
        type: "show", 
        year: 2005, 
        genre: "Comedy",
        rating: "4.25/5",
        colour: "#3b5998", 
        symbol: "❏",
        description:
            "A hilarious sitcom that follows the awkward, chaotic, and heartwarming daily lives or employees working at a Pennsylvania paper company.",
        poster: ""
    },
    {
        id: 8, 
        title: "Arcane",
        type: "movie", 
        year: 2021, 
        genre: "Animated action-adventure",
        rating: "4.43/5",
        colour: "#1b3d50", 
        symbol: "⟡",
        description:
            "A visually stunning animated series that explores the tragic conflict between two sisters torn apart by war, magic, and technology.",
        poster: ""
    }
]; 

const mediaGrid = document.querySelector("#media-grid");
const watchlistGrid = document.querySelector("#watchlist-grid");
const searchInput = document.querySelector("#search");
const emptyMessage = document.querySelector("#empty-message");
const watchlistEmpty = document.querySelector("#watchlist-empty");
const watchlistCount = document.querySelector("#watchlist-count");
const filterButtons = document.querySelectorAll("[data-filter]");

let currentFilter = "all";
let watchlist = [];

try {
    const saved = JSON.parse(localStorage.getItem("frame-watchlist") || "[]");
    if (Array.isArray(saved)) {
        watchlist = saved.filter(id => media.some(item => item.id === id));
    }
} catch {
    watchlist = [];
}

function ratingSource(item) {
    return item.type === "movie" ? "Letterboxd" : "Serializd";
}

function createPoster(item) {
    const poster = document.createElement("div");
    poster.className = "poster-art";
    poster.style.setProperty("--poster-color", item.colour || "#6c6252");

    if (item.poster) {
        const image = document.createElement("img");
        image.className = "poster-image";
        image.src = item.poster;
        image.alt = `${item.title} alternative poster`;
        image.loading = "lazy";
        image.addEventListener("error", () => image.remove());
        poster.classList.add("has-image");
        poster.appendChild(image);
    }

    const top = document.createElement("div");
    top.className = "poster-topline";
    const label = document.createElement("span");
    label.textContent = item.type === "movie" ? "A FILM" : "A SERIES";
    const year = document.createElement("span");
    year.textContent = String(item.year);
    top.append(label, year);

    const symbol = document.createElement("div");
    symbol.className = "poster-symbol";
    symbol.textContent = item.symbol || "*";
    symbol.setAttribute("aria-hidden", "true");

    const title = document.createElement("div");
    title.className = "poster-title";
    title.textContent = item.title;

    const footer = document.createElement("div");
    footer.className = "poster-footer";
    footer.textContent = "FRAME · PERSONAL ARCHIVE";

    poster.append(top, symbol, title, footer);
    return poster;
}
function createCard(item) {
    const card = document.createElement("article");
    card.className = "media-card";

    const link = document.createElement("a");
    link.className = "poster-link";
    link.href = `title.html?id=${encodeURIComponent(item.id)}`;
    link.setAttribute("aria-label", `View details for ${item.title}`);
    link.appendChild(createPoster(item));

    const info = document.createElement("div");
    info.className = "card-info";

    const kicker = document.createElement("div");
    kicker.className = "card-kicker";
    const type = document.createElement("span");
    type.textContent = item.type === "movie" ? "Film" : "TV show";
    const year = document.createElement("span");
    year.textContent = item.year;
    kicker.append(type, year);

    const title = document.createElement("h3");
    title.textContent = item.title;

    const meta = document.createElement("p");
    meta.className = "card-meta";
    meta.textContent = item.genre;

    const rating = document.createElement("p");
    rating.className = "card-rating";
    rating.textContent = item.rating
        ? `${ratingSource(item)}  ·  ${item.rating}`
        : `${ratingSource(item)}  ·  not added`
    
    const actions = document.createElement("div");
    actions.className = "card-actions";

    const details = document.createElement("a");
    details.className = "small-button";
    details.href = link.href;
    details.textContent = "Read the notes ↗";

    const save = document.createElement("button");
    save.className = "small-button";
    save.type = "button";

    function updateSaveButton() {
        const saved = watchlist.includes(item.id);
        save.textContent = saved ? "♥ Saved" : "♡ Save for later";
        save.classList.toggle("is-saved", saved);
        save.setAttribute("aria-pressed", String(saved));
    }

    save.addEventListener("click", () => {
        if (watchlist.includes(item.id)) {
            watchlist = watchlist.filter(id => id !== item.id);
        } else {
            watchlist.push(item.id);
        }
        localStorage.setItem("frame-watchlist", JSON.stringify(watchlist));
        renderMedia();
    });

    updateSaveButton();
    actions.append(details, save);
    info.append(kicker, title, meta, rating, actions);
    card.append(link, info);
    return card;
}

function renderMedia() {
    if (!mediaGrid) return;

    const query = searchInput.value.trim().toLowerCase();
    const visible = media.filter(item => {
        const matchesFilter = currentFilter === "all" || item.type === currentFilter;
        const text = `${item.title} ${item.genre} ${item.year} ${item.description}`.toLowerCase();
        return matchesFilter && text.includes(query);
    });

    mediaGrid.replaceChildren(...visible.map(createCard));
    emptyMessage.hidden = visible.length > 0;

    const savedItems = media.filter(item => watchlist.includes(item.id));
    watchlistGrid.replaceChildren(...savedItems.map(createCard));
    watchlistEmpty.hidden = savedItems.length > 0;
    watchlistCount.textContent = String(watchlist.length);
}

if (searchInput) searchInput.addEventListener("input", renderMedia);

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        filterButtons.forEach(other => {
            other.classList.toggle("is-active", other === button);
        });
        renderMedia();
    });
});

document.querySelectorAll("[data-jump-filter]").forEach(link => {
    link.addEventListener("click", () => {
        currentFilter = link.dataset.jumpFilter;
        filterButtons.forEach(button => {
            button.classList.toggle("is-active", button.dataset.filter === currentFilter);
        });
        if (searchInput) searchInput.value = "";
        renderMedia();
    });
});

// make the collection available to the individual title pages
window.FRAME_MEDIA = media;
window.FRAME_WATCHLIST_KEY = "frame-watchlist";

renderMedia();