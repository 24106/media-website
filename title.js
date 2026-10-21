// builds a separate-looking detail page for the title selected from index.html
const root = document.querySelector("detail-root");
const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));
const item = (window.FRAME_MEDIA || []).find(entry => entry.id === id);

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function makeDetailPoster(item) {
    const wrap = el("div", "detail-poster");
    const poster = el("div", "poster-art");
    poster.style.setProperty("--poster-color", item.colour || "#6c6252");

    if (item.poster) {
        const image = el("img", "poster-image");
        image.src = item.poster;
        image.alt = `${item.title} alternative poster`;
        image.addEventListener("error", () => image.remove());
        poster.classList.add("has-image");
        poster.appendChild(image);
    }

    const top = el("div", "poster-topline");
    top.append(el("span", "", item.type === "movie" ? "A FILM" : "A SERIES"));
    top.append(el("span", "", String(item.year)));
    const symbol = el("div", "poster-symbol", item.symbol || "*");
    const title = el("div", "poster-title", item.title);
    const foot = el("div", "poster-footer", "FRAME · PERSONAL ARCHIVE");
    poster.append(top, symbol, title, foot);
    wrap.appendChild(poster);
    return wrap;
}

if (!item) {
    root.replaceChildren();
    root.className = "not-found";
    root.append(
        el("p", "eyebrow", "PAGE NOT FOUND"),
        el("h1", "", "This page wandered off."),
        el("p", "", "That title isn't in the collection yet."),
        Object.assign(el("a", "ink-button", "Back to the scrapbook ↗"), { href: "index.html#collection" })
    );
} else {
    document.title = `${item.title} - FRAME`;
    root.replaceChildren();

    const back = el("a", "back-link", "← BACK TO THE SCRAPBOOK");
    back.href = "index.html#collection";

    const layout = el("div", "detail-layout");
    layout.appendChild(makeDetailPoster(item));

    const copy = el("div", "detail-copy");
    copy.appendChild(el("p", "eyebrow", item.type === "movie" ? "A FILM FROM THE ARCHIVE" : "A SERIES FROM THE ARCHIVE"));
    copy.appendChild(el("h1", "", item.title));
    copy.appendChild(el("p", "detail-deck", "Some stories find a little place to live in your head."));

    const facts = el("div", "detail-facts");
    [String(item.year), item.genre, item.type === "movie" ? "Film" : "TV series"].forEach(value => {
        facts.appendChild(el("span", "fact-pill", value));
    });
    copy.appendChild(facts);
    copy.appendChild(el("hr", "detail-rule"));
    copy.appendChild(el("h2", "", "The little synopsis"));
    copy.appendChild(el("p", "detail-description", item. description));

    copy.appendChild(el("hr", "detail-rule"));
    copy.appendChild(el("h2", "", "The rating note"));
    const panel = el("div", "rating-panel");
    const source = item.type === "movie" ? "Letterboxd" : "Serializd";
    const ratingBox = el("div", "rating-box");
    ratingBox.append(el("span", "", `${source} rating`), el("strong", "", item.rating || "Not added yet"));
    const typeBox = el("div", "rating-box");
    typeBox.append(el("span", "", "Filed under"), el("strong", "", item.type === "movie" ? "Movies" : "TV shows"));
    panel.append(ratingBox, typeBox);
    copy.appendChild(panel);

    const actions = el("div", "detail-actions");
    const save = el("button", "ink-button", "♡ Save for later");
    save.type = "button";
    const savedKey = window.FRAME_WATCHLIST_KEY || "frame-watchlist";

    function updateSave() {
        let saved = []
        try { saved = JSON.parse(localStorage.getItem(savedKey) || "[]"); } catch {}
        const isSaved = Array.isArray(saved) && saved.includes(item.id);
        save.textContent = isSaved ? "♥ Saved for later" : "♡ Save for later";
    }

    save.addEventListener("click", () => {
        let saved = [];
        try { saved = JSON.parse(localStorage.getItem(savedKey) || "[]"); } catch{}
        if (!Array.isArray(saved)) saved = [];
        if (saved.includes(item.id)) saved = saved.filter(savedId => savedId !== item.id);
        else saved.push(item.id);
        localStorage.setItem(savedKey, JSON.stringify(saved));
        updateSave();
    });
    updateSave();

    const backButton = el("a", "outline-button", "Back to all titles");
    backButton.href = "index.html#collection";
    actions.append(saved, backButton);
    copy.appendChild(actions);

    layout.appendChild(copy);
    root.append(back. layout);
}