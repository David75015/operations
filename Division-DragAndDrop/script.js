document.querySelectorAll(".produit, .etape-2, .etape-3, .quotient").forEach(line => {
    while (line.querySelectorAll(".case").length < 5) {
        const caseElement = document.createElement("div");
        caseElement.className = "case zone-depot";
        line.appendChild(caseElement);
    }
});

const chiffres = document.querySelectorAll(".chiffre");
const zonesDepot = document.querySelectorAll(".zone-depot");
const boutonVerifier = document.getElementById("boutonVerifier");
const boutonInitialiser = document.getElementById("boutonInitialiser");
const boutonReinitialiser = document.getElementById("boutonReinitialiser");
const message = document.getElementById("message");

let glisse = null;
let glisseMobile = null;
let fantome = null;

function genererNombre(maxChiffres) {
    const chiffres = Math.floor(Math.random() * maxChiffres) + 1;
    const minimum = chiffres === 1 ? 0 : 10 ** (chiffres - 1);
    const maximum = 10 ** chiffres - 1;

    return Math.floor(Math.random() * (maximum - minimum + 1) + minimum).toString();
}

function remplirNombre(id, valeur) {
    const cases = document.querySelectorAll(`#${id} .case`);
    const chiffresNombre = valeur.slice(-cases.length);
    const premiereCaseChiffre = id === "dividende"
        ? 0
        : cases.length - chiffresNombre.length;

    cases.forEach((caseElement, index) => {
        caseElement.textContent = index >= premiereCaseChiffre
            ? chiffresNombre[index - premiereCaseChiffre]
            : "";
    });
}

boutonInitialiser.addEventListener("click", () => {
    let dividende = genererNombre(5);
    let diviseur = genererNombre(3);
    while (
        diviseur === "0" ||
        Math.floor(Number(dividende) / Number(diviseur)) > 99999
    ) {
        dividende = genererNombre(5);
        diviseur = genererNombre(3);
    }

    remplirNombre("dividende", dividende);
    remplirNombre("diviseur", diviseur);
    effacerMessage();
});


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

    if (texte === "") {
        return null;
    }

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

    if (dividende === null || diviseur === null || quotient === null || reste === null) {
        definirMessage("Complètez toutes les cases", "incorrect");
        return;
    }

    if (diviseur === 0) {
        definirMessage("Diviseur nul !", "incorrect");
        return;
    }

    const quotientAttendu = Math.floor(dividende / diviseur);
    const resteAttendu = dividende % diviseur;
    const correct =
        Number.isInteger(quotient) &&
        Number.isInteger(reste) &&
        quotient === quotientAttendu &&
        reste === resteAttendu;

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