// ===== Konfigurasi =====
// Ganti dengan API key dari openweathermap.org (jangan commit key asli ke repo public!)
const API_KEY = 'd4c891341d0020ad7f86380c2a0ccf5e';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const HISTORY_KEY = 'weather-history';
const UNIT_KEY = 'weather-unit';
const MAX_HISTORY = 5;

// ===== DOM Elements =====
const form = document.querySelector('#searchForm');
const input = document.querySelector('#cityInput');
const loading = document.querySelector('#loading');
const error = document.querySelector('#error');
const result = document.querySelector('#weatherResult');
const unitToggle = document.querySelector('#unitToggle');
const historySection = document.querySelector('#historySection');
const historyList = document.querySelector('#historyList');
const clearHistoryBtn = document.querySelector('#clearHistory');

// ===== State =====
let currentUnit = 'C';
let lastData = null; // data cuaca terakhir (untuk toggle °C/°F tanpa fetch ulang)

// ===== Helper: UI state =====
const showLoading = () => {
    loading.classList.remove('hidden');
    error.classList.add('hidden');
    result.classList.add('hidden');
};
const hideLoading = () => loading.classList.add('hidden');

const showError = (message) => {
    error.textContent = `⚠️ ${message}`;
    error.classList.remove('hidden');
    result.classList.add('hidden');
};

// ===== Helper: konversi suhu =====
const toFahrenheit = (celsius) => (celsius * 9) / 5 + 32;
const formatTemp = (celsius) => {
    const value = currentUnit === 'C' ? celsius : toFahrenheit(celsius);
    return `${Math.round(value)}°${currentUnit}`;
};

// ===== Helper: tema latar sesuai kondisi cuaca =====
const THEMES = {
    Clear: 'theme-clear',
    Clouds: 'theme-clouds',
    Rain: 'theme-rain',
    Drizzle: 'theme-rain',
    Thunderstorm: 'theme-storm',
    Snow: 'theme-snow',
};
const applyTheme = (condition) => {
    document.body.className = THEMES[condition] ?? '';
};

// ===== Fetch data cuaca (async/await + Fetch API) =====
const getWeather = async (city) => {
    try {
        showLoading();

        const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=id`;
        const res = await fetch(url);

        if (res.status === 404) throw new Error(`Kota "${city}" tidak ditemukan.`);
        if (res.status === 401) throw new Error('API key tidak valid. Periksa API_KEY di app.js.');
        if (!res.ok) throw new Error('Server error. Coba lagi nanti.');

        const data = await res.json();
        displayWeather(data);
        saveHistory(data.name);
    } catch (err) {
        // fetch() reject dengan TypeError saat jaringan bermasalah
        const message = err.name === 'TypeError'
            ? 'Network error. Periksa koneksi internet Anda.'
            : err.message;
        showError(message);
    } finally {
        hideLoading();
    }
};

// ===== Tampilkan data cuaca =====
const displayWeather = (data) => {
    lastData = data;
    const { name, main, weather } = data; // destructuring
    const [{ description, icon, main: condition }] = weather;

    document.querySelector('#cityName').textContent = name;
    document.querySelector('#temperature').textContent = formatTemp(main.temp);
    document.querySelector('#description').textContent = description;
    document.querySelector('#humidity').textContent = `Kelembaban: ${main.humidity}%`;

    const iconEl = document.querySelector('#weatherIcon');
    iconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    iconEl.alt = description;

    applyTheme(condition);
    error.classList.add('hidden');
    result.classList.remove('hidden');
};

// ===== Bonus: Riwayat pencarian (LocalStorage) =====
const loadHistory = () => {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) ?? [];
    } catch {
        return [];
    }
};

const saveHistory = (city) => {
    const updated = [
        city,
        ...loadHistory().filter((item) => item.toLowerCase() !== city.toLowerCase()),
    ].slice(0, MAX_HISTORY);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    renderHistory();
};

const renderHistory = () => {
    const items = loadHistory();
    historySection.classList.toggle('hidden', items.length === 0);

    const buttons = items.map((city) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = city;
        btn.addEventListener('click', () => {
            input.value = city;
            getWeather(city);
        });
        li.append(btn);
        return li;
    });

    historyList.replaceChildren(...buttons);
};

// ===== Bonus: Toggle °C / °F =====
const setUnit = (unit) => {
    currentUnit = unit;
    unitToggle.textContent = `°${unit}`;
    localStorage.setItem(UNIT_KEY, unit);
    if (lastData) {
        document.querySelector('#temperature').textContent = formatTemp(lastData.main.temp);
    }
};

// ===== Event Listeners =====
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = input.value.trim();

    if (!city) {
        showError('Nama kota tidak boleh kosong!');
        return;
    }
    getWeather(city);
});

unitToggle.addEventListener('click', () => setUnit(currentUnit === 'C' ? 'F' : 'C'));

clearHistoryBtn.addEventListener('click', () => {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
});

// ===== Init =====
setUnit(localStorage.getItem(UNIT_KEY) === 'F' ? 'F' : 'C');
renderHistory();
