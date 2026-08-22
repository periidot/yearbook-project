let thing = [];

Promise.all([
    fetch('/resource.csv').then(res => res.ok ? res.text() : ''),
    fetch('/test.csv').then(res => res.ok ? res.text() : '')
])
.then(([res1, res2]) => {
    const csvdata = res1 + '\n' + res2;
    const lines = csvdata.split('\n').map(line => line.trim()).filter(Boolean);
    thing = lines.map(line => {
        const cols = line.split(',');
        return {
            id: cols[0]?.trim() || '',
            name: cols[1]?.trim() || '',
            dob: cols[2]?.replace(/"/g,'').trim() || '',
            clubs: cols[3]?.replace(/"/g,'').trim() || '',
            contact: cols[4]?.trim() || '',
            img: cols[5]?.trim() || ''
        };
    });

    const urlParams = new URLSearchParams(window.location.search);
    const urlQuery = urlParams.get('q');
    if (urlQuery) {
        document.getElementById('query').value = urlQuery;
        searcher();
    }
})
.catch(err => console.error('Error fetching CSVs:', err));

function searcher() {
    const query = document.getElementById('query').value.toLowerCase();
    const container = document.getElementById('people');
    if (!container) return;
    container.innerHTML = '';

    const results = thing.filter(p => p.name.toLowerCase().includes(query));

    if (results.length === 0) {
        container.innerHTML = '<p>Nothing is found</p>';
        return;
    }

    results.forEach(p => {
        const card = document.createElement('div');
        card.className = 'person-card';
        card.innerHTML = `
            <img src="/pics/${p.img}">
            <h3>${p.name}</h3>
            <p>DoB: ${p.dob}</p>
            <p>Club: ${p.clubs || '-'}</p>
            <p>Contact: ${p.contact}</p>
        `;
        container.appendChild(card);
    });
}

function changeFontSize(delta) {

    const root = document.querySelector(':root');
    const style = getComputedStyle(root);
    const currentSize = parseFloat(style.getPropertyValue('--book-fs'));

    let newSize = currentSize + delta;
    if (newSize < 0.5) newSize = 0.5;
    if (newSize > 3) newSize = 3;
    root.style.setProperty('--book-fs', newSize + 'vw');
}
window.onload = function() {
    const savedSize = localStorage.getItem('userFontSize');
    if (savedSize) {
        document.querySelector(':root').style.setProperty('--book-fs', savedSize + 'vw');
    }
}

const clankerMemory = {
    "who": {
        text: "Your assistant! Ask me questions, tell me your life stories, and I will listen to all! I am at your service 25/8! I hope we get along!!!",
        img: "/pics/clank-silly.png" 
    },
    "lost": {
        text: "If you're lost, simply navigate through the Table of Contents on the left page of the book!",
        img: "/pics/clank-norm.png"
    },
    "secret": {
        text: "The school used to be a hospital. It's morgue has been permanently sealed away alongside one forgotten corpse. Well... we shouldn't gossip, its rude to talk about someone who's listening",
        img: "/pics/clank-silly.png"
    },
    "joke": {
        text: "Certainly not you!",
        img: "/pics/clank-passagr.png"
    },
    "default": {
        text: "Hello, dearest allumni! How could I assist you?",
        img: "/pics/clank-norm.png"
    }
};

function openAI() {
    document.getElementById('ai-overlay').style.display = 'flex';
    document.getElementById('clanker-display').src = clankerMemory["default"].img;
    document.getElementById('ai-text').innerText = clankerMemory["default"].text;
    showInitialOptions();
}

function closeAI() {
    document.getElementById('ai-overlay').style.display = 'none';
}

function askClanker(key) {
    const speech = document.getElementById('ai-text');
    const display = document.getElementById('clanker-display');
    if (clankerMemory[key]) {
        speech.innerText = clankerMemory[key].text;
        display.src = clankerMemory[key].img;
    }
}

function showInitialOptions() {
    const container = document.getElementById('ai-options');
    container.innerHTML = `
        <button class="option-btn" onclick="askClanker('who')">Who made you?</button>
        <button class="option-btn" onclick="askClanker('lost')">I am lost and confused!!!</button>
        <button class="option-btn" onclick="askClanker('secret')">Tell me a juicy school secret</button>
        <button class="option-btn" onclick="askClanker('joke')">Who scored highest in Physics?</button>
    `;
}
