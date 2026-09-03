const numbers = document.querySelectorAll(".number");

const dropzones = document.querySelectorAll(".dropzone");

const checkButton = document.getElementById("checkButton");

const initButton = document.getElementById("initButton");

const resetButton = document.getElementById("resetButton");

const message = document.getElementById("message");


let draggedNumber = null;
let mobileNumber = null;
let ghost = null;

function generateNumber(maxDigits) {
    const digits = Math.floor(Math.random() * maxDigits) + 1;
    const minimum = digits === 1 ? 0 : 10 ** (digits - 1);
    const maximum = 10 ** digits - 1;

    return Math.floor(Math.random() * (maximum - minimum + 1) + minimum).toString();
}

function fillNumber(lineId, value) {
    const boxes = document.getElementById(lineId).querySelectorAll(".box");
    const digits = value.slice(-boxes.length);
    const firstDigitBox = boxes.length - digits.length;

    boxes.forEach((box, index) => {
        box.textContent = index >= firstDigitBox
            ? digits[index - firstDigitBox]
            : "";
    });
}

initButton.addEventListener("click", () => {
    let firstNumber = generateNumber(5);
    let secondNumber = generateNumber(5);

    if (Number(firstNumber) < Number(secondNumber)) {
        [firstNumber, secondNumber] = [secondNumber, firstNumber];
    }

    fillNumber("firstNumber", firstNumber);
    fillNumber("secondNumber", secondNumber);
    message.textContent = "";
    message.className = "";
});


/* =========================
   DRAG DES CHIFFRES
========================= */

numbers.forEach(number => {

    number.addEventListener("dragstart", () => {

        draggedNumber = number.textContent;

    });

});


/* =========================
   DROP ZONES
========================= */

dropzones.forEach(dropzone => {


    /* AUTORISER LE DROP */

    dropzone.addEventListener("dragover", event => {

        event.preventDefault();

    });


    /* ENTREE DANS LA CASE */

    dropzone.addEventListener("dragenter", () => {

        dropzone.classList.add("drag-over");

    });


    /* SORTIE DE LA CASE */

    dropzone.addEventListener("dragleave", () => {

        dropzone.classList.remove("drag-over");

    });


    /* DEPOT DU CHIFFRE */

    dropzone.addEventListener("drop", event => {

        event.preventDefault();

        dropzone.textContent = draggedNumber;

        dropzone.classList.remove("drag-over");

        message.textContent = "";

        message.className = "";

    });

});


/* =========================
   RECUPERER UN NOMBRE
========================= */

function getNumber(lineId) {
    const line = document.getElementById(lineId);
    const boxes = line.querySelectorAll(".box");

    let number = "";

    boxes.forEach(box => {
        number += box.textContent || "0";
    });

    return Number(number);
}


/* =========================
   VERIFIER L'ADDITION
========================= */

checkButton.addEventListener("click", () => {

    const firstNumber = getNumber("firstNumber");

    const secondNumber = getNumber("secondNumber");

    const result = getNumber("result");


    /* CASES NON REMPLIES */

    if (
        firstNumber === null ||
        secondNumber === null ||
        result === null
    ) {

        message.textContent = "Incorrect ❌";

        message.className = "incorrect";

        return;

    }


    /* VERIFICATION */

    if (firstNumber + secondNumber === result) {

        message.textContent = "Bravo";

        message.className = "correct";

    } else {

        message.textContent = "Incorrect";

        message.className = "incorrect";

    }

});


/* =========================
   RESET
========================= */

resetButton.addEventListener("click", () => {

    dropzones.forEach(dropzone => {

        dropzone.textContent = "";

        dropzone.classList.remove("drag-over");

    });


    message.textContent = "";

    message.className = "";

    draggedNumber = null;

});

dropzones.forEach(dropzone => {
    dropzone.addEventListener("click", () => {
        dropzone.textContent = "";

        message.textContent = "";
        message.className = "";
    });
});

numbers.forEach(number => {

    /* ---------- PC ---------- */

    number.addEventListener("dragstart", () => {

        draggedNumber = number.textContent;
        number.classList.add("dragging");

    });

    number.addEventListener("dragend", () => {

        number.classList.remove("dragging");

    });


    /* ---------- MOBILE ---------- */

    number.addEventListener("touchstart", () => {

        mobileNumber = number.textContent;

        ghost = number.cloneNode(true);

        ghost.style.position = "fixed";
        ghost.style.pointerEvents = "none";
        ghost.style.opacity = "0.8";
        ghost.style.zIndex = "9999";

        document.body.appendChild(ghost);

    });


    number.addEventListener("touchmove", (e) => {

        if (!ghost) return;

        const touch = e.touches[0];

        ghost.style.left = `${touch.clientX - ghost.offsetWidth / 2}px`;
        ghost.style.top = `${touch.clientY - ghost.offsetHeight / 2}px`;

        e.preventDefault();

    }, { passive: false });


    number.addEventListener("touchend", (e) => {

        if (!ghost) return;

        const touch = e.changedTouches[0];

        const target = document.elementFromPoint(
            touch.clientX,
            touch.clientY
        );

        if (target && target.classList.contains("dropzone")) {

            target.textContent = mobileNumber;

            message.textContent = "";
            message.className = "";

        }

        ghost.remove();

        ghost = null;
        mobileNumber = null;

    });

});