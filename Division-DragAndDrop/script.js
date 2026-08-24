const chiffres = document.querySelectorAll(".chiffre");
const zonesDepot = document.querySelectorAll(".zone-depot");
const boutonVerifier = document.getElementById("boutonVerifier");
const boutonReinitialiser = document.getElementById("boutonReinitialiser");
const message = document.getElementById("message");

let glisse = null;
let glisseMobile = null;
let fantome = null;


/* =========================
   MESSAGE
========================= */

function definirMessage(texte, classe) {
    message.textContent = texte;
    message.className = classe;
}

function effacerMessage() {
    definirMessage("", "");
}


/* =========================
   DRAG & DROP (PC)
========================= */

chiffres.forEach(chiffre => {

    chiffre.addEventListener("dragstart", () => {
        glisse = chiffre.textContent;
        chiffre.classList.add("en-cours-glisse");
    });

    chiffre.addEventListener("dragend", () => {
        chiffre.classList.remove("en-cours-glisse");
    });

});

zonesDepot.forEach(zoneDepot => {

    zoneDepot.addEventListener("dragover", e => e.preventDefault());

    zoneDepot.addEventListener("dragenter", () => zoneDepot.classList.add("survol"));

    zoneDepot.addEventListener("dragleave", () => zoneDepot.classList.remove("survol"));

    zoneDepot.addEventListener("drop", e => {
        e.preventDefault();
        zoneDepot.textContent = glisse;
        zoneDepot.classList.remove("survol");
        effacerMessage();
    });

});


/* =========================
   DRAG & DROP (MOBILE)
========================= */

chiffres.forEach(chiffre => {

    chiffre.addEventListener("touchstart", () => {
        glisseMobile = chiffre.textContent;

        fantome = chiffre.cloneNode(true);
        fantome.style.position = "fixed";
        fantome.style.pointerEvents = "none";
        fantome.style.opacity = "0.8";
        fantome.style.zIndex = "9999";
        document.body.appendChild(fantome);
    });

    chiffre.addEventListener("touchmove", e => {
        if (!fantome) return;

        const touch = e.touches[0];
        fantome.style.left = touch.clientX - fantome.offsetWidth / 2 + "px";
        fantome.style.top = touch.clientY - fantome.offsetHeight / 2 + "px";

        e.preventDefault();
    }, { passive: false });

    chiffre.addEventListener("touchend", e => {
        if (!fantome) return;

        const touch = e.changedTouches[0];
        const cible = document.elementFromPoint(touch.clientX, touch.clientY);

        if (cible && cible.classList.contains("zone-depot")) {
            cible.textContent = glisseMobile;
            effacerMessage();
        }

        fantome.remove();
        fantome = null;
        glisseMobile = null;
    });

});


/* =========================
   CLIC SUR UNE CASE = VIDER
========================= */

zonesDepot.forEach(zoneDepot => {

    zoneDepot.addEventListener("click", () => {
        zoneDepot.textContent = "";
        effacerMessage();
    });

});


/* =========================
   LIRE UN NOMBRE (cases)
========================= */

function lireNombre(id) {
    let texte = "";
    document.querySelectorAll(`#${id} .case`).forEach(caseElement => {
        texte += caseElement.textContent.trim();
    });

    const negatif = texte.includes("-");
    const valeur = Number(texte.replace("-", "")) || 0;

    return negatif ? -valeur : valeur;
}


/* =========================
   VERIFIER
========================= */

boutonVerifier.addEventListener("click", () => {

    const diviseur = lireNombre("diviseur");
    const dividende = lireNombre("dividende");
    const quotient = lireNombre("quotient");
    const reste = lireNombre("reste");

    if (diviseur === 0) {
        definirMessage("Diviseur nul !", "incorrect");
        return;
    }

    const correct =
        dividende === diviseur * quotient + reste &&
        reste >= 0 &&
        reste < Math.abs(diviseur);

    definirMessage(correct ? "Bravo" : "Incorrect", correct ? "correct" : "incorrect");

});


/* =========================
   REINITIALISER
========================= */

boutonReinitialiser.addEventListener("click", () => {

    zonesDepot.forEach(zoneDepot => {
        zoneDepot.textContent = "";
    });

    effacerMessage();

});