let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [
    {
        question: "What is HTML?",
        answer: "HTML is the standard markup language for creating web pages.",
        category: "Web Development"
    },
    {
        question: "What is CSS?",
        answer: "CSS is used to style and design web pages.",
        category: "Web Development"
    },
    {
        question: "What is JavaScript?",
        answer: "JavaScript adds interactivity to web pages.",
        category: "Programming"
    }
];

let currentIndex = 0;
let editIndex = null;
let filteredCards = [...flashcards];

// Elements
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const categoryEl = document.getElementById("cardCategory");
const counterEl = document.getElementById("cardCounter");

const showAnswerBtn = document.getElementById("showAnswerBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const form = document.getElementById("flashcardForm");

const questionInput = document.getElementById("questionInput");
const answerInput = document.getElementById("answerInput");
const categoryInput = document.getElementById("categoryInput");

const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

const darkModeBtn = document.getElementById("darkModeBtn");

// Save Data
function saveCards() {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
}

// Populate Categories
function updateCategoryDropdown() {
    categoryFilter.innerHTML =
        '<option value="all">All Categories</option>';

    const categories = [...new Set(flashcards.map(card => card.category))];

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Render Card
function renderCard() {

    if (filteredCards.length === 0) {
        questionEl.textContent = "No flashcards found";
        answerEl.textContent = "";
        categoryEl.textContent = "-";
        counterEl.textContent = "0 / 0";
        return;
    }

    if (currentIndex >= filteredCards.length) {
        currentIndex = 0;
    }

    const card = filteredCards[currentIndex];

    questionEl.textContent = card.question;
    answerEl.textContent = card.answer;
    categoryEl.textContent = card.category;

    answerEl.classList.add("hidden");

    counterEl.textContent =
        `${currentIndex + 1} / ${filteredCards.length}`;
}

// Show Answer
showAnswerBtn.addEventListener("click", () => {
    answerEl.classList.toggle("hidden");
});

// Next
nextBtn.addEventListener("click", () => {

    if (filteredCards.length === 0) return;

    currentIndex++;

    if (currentIndex >= filteredCards.length) {
        currentIndex = 0;
    }

    renderCard();
});

// Previous
prevBtn.addEventListener("click", () => {

    if (filteredCards.length === 0) return;

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = filteredCards.length - 1;
    }

    renderCard();
});

// Add / Edit Card
form.addEventListener("submit", (e) => {

    e.preventDefault();

    const newCard = {
        question: questionInput.value.trim(),
        answer: answerInput.value.trim(),
        category: categoryInput.value.trim()
    };

    if (!newCard.question ||
        !newCard.answer ||
        !newCard.category) {
        return;
    }

    if (editIndex !== null) {

        flashcards[editIndex] = newCard;

        editIndex = null;

    } else {

        flashcards.push(newCard);
    }

    saveCards();

    filteredCards = [...flashcards];

    updateCategoryDropdown();

    form.reset();

    currentIndex = filteredCards.length - 1;

    renderCard();
});

// Edit
editBtn.addEventListener("click", () => {

    if (filteredCards.length === 0) return;

    const currentCard = filteredCards[currentIndex];

    const actualIndex =
        flashcards.findIndex(card =>
            card.question === currentCard.question &&
            card.answer === currentCard.answer
        );

    if (actualIndex === -1) return;

    editIndex = actualIndex;

    questionInput.value = currentCard.question;
    answerInput.value = currentCard.answer;
    categoryInput.value = currentCard.category;

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
});

// Delete
deleteBtn.addEventListener("click", () => {

    if (filteredCards.length === 0) return;

    const confirmDelete =
        confirm("Delete this flashcard?");

    if (!confirmDelete) return;

    const currentCard = filteredCards[currentIndex];

    flashcards = flashcards.filter(card =>
        !(
            card.question === currentCard.question &&
            card.answer === currentCard.answer
        )
    );

    saveCards();

    filteredCards = [...flashcards];

    updateCategoryDropdown();

    currentIndex = 0;

    renderCard();
});

// Search
searchInput.addEventListener("input", () => {

    const searchTerm =
        searchInput.value.toLowerCase();

    const selectedCategory =
        categoryFilter.value;

    filteredCards = flashcards.filter(card => {

        const matchesSearch =
            card.question.toLowerCase().includes(searchTerm) ||
            card.answer.toLowerCase().includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            card.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    currentIndex = 0;

    renderCard();
});

// Category Filter
categoryFilter.addEventListener("change", () => {

    const searchTerm =
        searchInput.value.toLowerCase();

    const selectedCategory =
        categoryFilter.value;

    filteredCards = flashcards.filter(card => {

        const matchesSearch =
            card.question.toLowerCase().includes(searchTerm) ||
            card.answer.toLowerCase().includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            card.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    currentIndex = 0;

    renderCard();
});

// Dark Mode
darkModeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    const isDark =
        document.body.classList.contains("dark-mode");

    localStorage.setItem("darkMode", isDark);
});

// Load Dark Mode
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
}

// Initial Setup
updateCategoryDropdown();
renderCard();