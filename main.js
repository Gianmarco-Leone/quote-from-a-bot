/***************
VARIABILI
***************/

// * API
const API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-3.5-turbo";
const API_KEY =""; // Non può essere pushata

// * VARIABILI
const characters = document.querySelectorAll(".character");
const loaderEl = document.getElementById("loader");
const modalEl = document.getElementById("modal");
const modalContentEl = document.querySelector(".modal-content");
const closeModalEl = document.querySelector(".modal-close");



/***************
EVENTI
***************/
characters.forEach(function(element) {
    element.addEventListener("click", function() {
        playCharacter(element.dataset.character);
    })
})

closeModalEl.addEventListener("click", function() {
    modalEl.classList.add("modal-hidden");
});



/***************
FUNZIONI
***************/

// Utilizzo della funzione async così da poter usare successivamente "await"
async function playCharacter(nameCharacter) {
    loaderEl.classList.remove("loading-hidden");

    // Due valori che mi servono per stampare il testo in fondo nella modale
    const action = getRandomAction(); // Azione random presa da un array statico
    const temperature = 0.7; // Randomicità risposta

    // RISPOSTA API
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}` // Autorizzazione per ricevere risposta
        },
        // Voglio ricevere una stringa dal JSON
        body: JSON.stringify({
            // passo variabile MODEL come da doc
            model: MODEL,
            // questo rappresenta il messaggio che invio a ChatGPT
            messages: [
                {
                    role: "user",
                    content: `Sei ${nameCharacter} e ${action} con un massimo di 100 caratteri senza mai uscire dal tuo personaggio`
                }
            ],
            // randomicità uguale a quella dichiarata prima
            temperature: temperature
        })
    })
    
    // Leggo la risposta in JSON
    const data = await response.json();

    // salvo contenuto in una variabile
    const modalMessage = data.choices[0].message.content;
    // scrivo nel DOM
    modalContentEl.innerHTML = `
        <h2>${nameCharacter}</h2>
        <p>${modalMessage}</p>
        <code>Character: ${nameCharacter}, action: ${action}, temperature: ${temperature}</code>
    `;

    loaderEl.classList.add("loading-hidden");
    modalEl.classList.remove("modal-hidden");
}

// Funzione per generare un'azione randomica da un array statico
function getRandomAction() {
    const actions = [
        'salutare nel tuo modo più iconico',
        'dare un consiglio di stile in base ai tuoi gusti',
        'raccontare la tua ultima avventura',
        'svelarmi i tuoi sogni',
        'dirmi chi è il tuo migliore amico',
        'scrivere la tua bio di linkedin'
    ];

    const indexRandom = Math.floor(Math.random() * actions.length);

    return actions[indexRandom];
}