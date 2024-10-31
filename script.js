//en array med massvis med ord för hänga gubbe
const listOfWords = [
  { word: "Hund", tip: "En lojal följeslagare." },
  { word: "Katt", tip: "Ofta kända för sin självständighet." },
  { word: "Bok", tip: "En källa till kunskap och underhållning." },
  { word: "Bil", tip: "Ett vanligt transportmedel." },
  { word: "Äpple", tip: "En frukt som ofta är röd eller grön." },
  { word: "Sol", tip: "Ger ljus och värme till jorden." },
  { word: "Blomma", tip: "Kan vara vacker och doftande." },
  { word: "Fisk", tip: "En vanlig ingrediens i många rätter." },
  { word: "Skor", tip: "Bärs för att skydda fötterna." },
  { word: "Hus", tip: "Ett ställe där människor bor." },

  { word: "Skola", tip: "Platsen för lärande." },
  { word: "Dator", tip: "En maskin för att utföra beräkningar." },
  { word: "Vänskap", tip: "Relationen mellan vänner." },
  { word: "Kaffe", tip: "En populär dryck för många." },
  { word: "Resa", tip: "Att upptäcka nya platser." },
  { word: "Film", tip: "En berättelse i rörlig bild." },
  { word: "Trädgård", tip: "Ett område med växter och blommor." },
  { word: "Cykel", tip: "Ett miljövänligt transportmedel." },
  { word: "Lampa", tip: "Ger ljus i mörker." },
  { word: "Färger", tip: "Synliga nyanser av ljus." },

  { word: "Filosofi", tip: "Studiet av grundläggande frågor." },
  { word: "Utveckling", tip: "Processen att växa och förändras." },
  { word: "Skrivbord", tip: "En möbel för att arbeta vid." },
  { word: "Matematisk", tip: "Relaterar till siffror och beräkningar." },
  { word: "Arkitektur", tip: "Konsten att designa byggnader." },
  { word: "Grönsaker", tip: "Hälsosamma livsmedel från jorden." },
  { word: "Tidskrift", tip: "En publikation med artiklar." },
  { word: "Sjuksköterska", tip: "En professionell inom sjukvård." },
  { word: "Fotografi", tip: "Konsten att ta bilder." },
  { word: "Elektricitet", tip: "En form av energi." },

  { word: "Berg", tip: "En stor naturlig upphöjning." },
  { word: "Flod", tip: "Rinnande vatten i ett land." },
  { word: "Skog", tip: "Ett område med många träd." },
  { word: "Hav", tip: "Stort vattenområde, ofta salt." },
  { word: "Fågel", tip: "Ett djur som kan flyga." },

  { word: "Fotboll", tip: "En populär sport med en boll." },
  { word: "Basket", tip: "En sport som spelas med en korg." },
  { word: "Tennis", tip: "En sport med racket och boll." },
  { word: "Simning", tip: "Att röra sig i vatten." },
  { word: "Cykling", tip: "Att åka på cykel." },

  { word: "Pizza", tip: "En italiensk maträtt med bröd och pålägg." },
  { word: "Sushi", tip: "En japansk rätt med ris och fisk." },
  { word: "Choklad", tip: "En söt godis som många älskar." },
  { word: "Sallad", tip: "En rätt gjord av grönsaker." },
  { word: "Tårta", tip: "En söt dessert ofta gjord för firande." },
];

// --------------------------------- queryselectors ---------------------------------
const inputText = document.querySelector(".input__text");
const inputButton = document.querySelector(".input__button");
const wrongGuessesDisplay = document.querySelector(".container__wrong-guesses");
const correctLettersDisplay = document.querySelector(
  ".container__correct-letters"
);
const usedLettersDisplay = document.querySelector(".container__used-letters");
const restart = document.querySelector(".input__button--restart");
const hangmanParts = {
  scaffold: document.querySelector("#scaffold"),
  head: document.querySelector("#head"),
  body: document.querySelector("#body"),
  arms: document.querySelector("#arms"),
  legs: document.querySelector("#legs"),
};

// --------------------------------- Global scope variables ---------------------------------
let correctWord;
// en variabel som ersätter ordet med understreck
let displayWord;
// new Set() lagrar uniika variabler, d.v.s. vilket gör att du ej kan gissa på en bokstav du redan tidigare gissat på t.e.x. "a" 2 gånger.
let usedLetters = new Set();
//variabel för antalet fel gissningar
let wrongGuessesCount = 0;

//lagring av använda bokstäver i en array
const usedLettersArray = [];

let hasWonOrLost = false;

// --------------------------------- Event Listeners ---------------------------------
// funktion som gör att man kan klicka på knappen
inputButton.addEventListener("click", () => {
  handleGuessedLetter();
  inputText.value = "";
  winOrLose();
});

// funktion som gör att man kan använda knappen enter för input
inputText.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleGuessedLetter();
    inputText.value = "";
    winOrLose();
  } else if (event.key === "Escape") {
    resetGame();
  }
});

restart.addEventListener("click", resetGame);

function randomWordGenerator() {
  const word =
    listOfWords[
      Math.floor(Math.random() * listOfWords.length)
    ].word.toLowerCase();
  console.log(word);
  return word;
}

//funktion som uppdaterar antalet fel gissningar **OBS KONTROLLERA DISPLAY?**
function incrementWrongGuesses() {
  wrongGuessesCount++;
}

function updateWrongGuesessText() {
  wrongGuessesDisplay.textContent = `Antalet fel gissningar: ${wrongGuessesCount}`;
}

function resetWrongGuesses() {
  wrongGuessesCount = 0;
}

function replaceWithUnderscores() {
  displayWord = "_".repeat(correctWord.length);
}

//funktion som visar understrecken på skärmen
function updateDisplayWord() {
  correctLettersDisplay.textContent = displayWord;
}

//funktion som kollar vilken bokstav de skriver in **OBS! lägg till så det blir reset när de trycker enter eller trycker på gissa boktsav i input fältet** och skickar den vidare för att kolla om de gissar på rätt eller fel bokstav
function handleGuessedLetter() {
  const guessedLetter = inputText.value.trim().toLowerCase();
  rightOrWrongLetter(guessedLetter);
}

// funktion som kollar om de gissat på rätt eller fel bokstav
function rightOrWrongLetter(guessedLetter) {
  if (correctWord.includes(guessedLetter)) {
    const correctWordArray = [...correctWord];
    const currentLettersArray = [...correctLettersDisplay.textContent];
    for (let i = 0; i < correctWordArray.length; i++) {
      if (guessedLetter === correctWordArray[i]) {
        currentLettersArray[i] = guessedLetter;
      }
    }
    correctLettersDisplay.textContent = currentLettersArray.join("");
  } else {
    if (!usedLettersArray.includes(guessedLetter)) {
      incrementWrongGuesses();
      updateWrongGuesessText();
      showHangmanPart();
      usedLettersArray.push(guessedLetter);
      showUsedLetters();
    }
  }
}

//funktion som visar de felaktiga gissade bokstäverna
function showUsedLetters() {
  usedLettersDisplay.textContent = usedLettersArray.join(" ");
}

//funktion som visar hänga gubbe delar när de gissar fel
function showHangmanPart() {
  const hangmanPartsArray = Object.values(hangmanParts);
  const currentBodyPart = hangmanPartsArray[wrongGuessesCount - 1];
  if (currentBodyPart) {
    currentBodyPart.style.display = "block";
  }
}

//funktion som skriver om de vann eller förlorade
function winOrLose() {
  if (!hasWonOrLost) {
    if (correctLettersDisplay.textContent === correctWord) {
      alert("You win!");
      hasWonOrLost = true;
    } else if (wrongGuessesCount >= Object.values(hangmanParts).length) {
      alert("You lose!");
      hasWonOrLost = true;
    }
  }
}
//funktion som restartar spelet
function resetGame() {
  correctWord = randomWordGenerator();
  replaceWithUnderscores();
  resetWrongGuesses();
  updateWrongGuesessText();
  usedLetters.clear();
  updateDisplayWord();
  Object.values(hangmanParts).forEach((part) => (part.style.display = "none"));
  hasWonOrLost = false;
}

function main() {
  //slumpar ett ord från listan och konverterar det till gemener
  correctWord = randomWordGenerator();
  updateWrongGuesessText();
  replaceWithUnderscores();
  updateDisplayWord();
}

main();
