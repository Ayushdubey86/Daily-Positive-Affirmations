document.addEventListener('DOMContentLoaded', () => {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const refreshQuotesButton = document.getElementById('refresh-quotes-button');

    let quotes = [];
    let displayedQuotes = new Set();

    async function fetchQuotes() {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk-None-nvmGKZFPC0sjpm1mt8t2T3BlbkFJPcEhHFWaboFDlWRM8KD9' // Replace with your actual API key
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'system', content: 'Give me 10 positive motivation quotes.' }],
                    max_tokens: 150,
                    n: 1,
                    stop: null,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const quotesText = data.choices[0].message.content.trim();
            quotes = quotesText.split('\n').filter(quote => quote.trim() !== '');
            quotes = quotes.map(quote => quote.replace(/^\d+\.\s*/, '')); // Remove any numbers at the beginning
            displayedQuotes.clear();
            displayQuote();
        } catch (error) {
            quoteText.textContent = `Error: ${error.message}`;
        }
    }

    function displayQuote() {
        if (quotes.length === 0 || displayedQuotes.size === quotes.length) {
            fetchQuotes();
            return;
        }

        let quote, author;
        do {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            [quote, author] = quotes[randomIndex].split(' - ');
        } while (displayedQuotes.has(quote));

        displayedQuotes.add(quote);
        quoteText.textContent = quote.trim();
        quoteAuthor.textContent = author ? `— ${author.trim()}` : '';
    }

    refreshQuotesButton.addEventListener('click', displayQuote);
    setInterval(displayQuote, 9000);

    fetchQuotes(); // Initial fetch to load quotes on page load
});

function toggleNav() {
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");

    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
        main.style.marginLeft = "0";
    } else {
        sidebar.style.width = "250px";
        main.style.marginLeft = "250px";
    }
}

function showColors() {
    const colorSelection = document.getElementById("color-selection");
    const themeSelection = document.getElementById("theme-selection");
    colorSelection.classList.remove("hidden");
    themeSelection.classList.add("hidden");
}

function showThemes() {
    const themeSelection = document.getElementById("theme-selection");
    const colorSelection = document.getElementById("color-selection");
    themeSelection.classList.remove("hidden");
    colorSelection.classList.add("hidden");
}

function changeBackgroundColor(color) {
    document.body.style.backgroundColor = color;
    document.body.style.backgroundImage = ''; // Clear any background image
}

function changeBackgroundImage(imageUrl) {
    document.body.style.backgroundImage = `url('${imageUrl}')`;
    document.body.style.backgroundSize = 'cover'; // Ensures the image covers the entire page
    document.body.style.backgroundPosition = 'center'; // Centers the image
    document.body.style.backgroundRepeat = 'no-repeat'; // Prevents the image from repeating
}
