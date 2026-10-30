const WEATHER_API = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const QUOTE_API = "https://korean-advice-open-api.vercel.app/api/advice";
const DEFAULT_CITY = {
  name: "서울특별시",
  country: "대한민국",
  latitude: 37.5665,
  longitude: 126.978,
  timezone: "Asia/Seoul",
};

const weatherContent = document.querySelector("#weather-content");
const quoteContent = document.querySelector("#quote-content");
const cityHeading = document.querySelector("#weather-heading");
const countryLabel = document.querySelector(".country-label");
const cityForm = document.querySelector("#city-form");
const cityInput = document.querySelector("#city-input");
const cityResults = document.querySelector("#city-results");
const locationButton = document.querySelector("#location-button");
const dateLabel = document.querySelector("#today-date");

let activeCity = loadSavedCity();

function loadSavedCity() {
  try {
    const savedCity = localStorage.getItem("todays-sky-city");
    return savedCity ? { ...DEFAULT_CITY, ...JSON.parse(savedCity) } : DEFAULT_CITY;
  } catch (error) {
    console.error("저장된 도시를 불러오지 못했습니다.", error);
    return DEFAULT_CITY;
  }
}

function saveCity(city) {
  try {
    localStorage.setItem("todays-sky-city", JSON.stringify(city));
  } catch (error) {
    console.error("도시 설정을 저장하지 못했습니다.", error);
  }
}

function setCityHeading(city) {
  activeCity = city;
  cityHeading.textContent = city.name;
  countryLabel.textContent = city.country;
  saveCity(city);
}

function dateForTimezone(timezone) {
  const resolvedTimezone =
    timezone && timezone !== "auto"
      ? timezone
      : Intl.DateTimeFormat().resolvedOptions().timeZone;
  return new Intl.DateTimeFormat("sv-SE", { timeZone: resolvedTimezone }).format(new Date());
}

function updateDate(timezone) {
  dateLabel.textContent = new Intl.DateTimeFormat("ko-KR", {
    timeZone: timezone,
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date());
}

function weatherDescription(code) {
  const conditions = {
    0: ["맑음", "☀️"],
    1: ["대체로 맑음", "🌤️"],
    2: ["구름 조금", "⛅"],
    3: ["흐림", "☁️"],
    45: ["안개", "🌫️"],
    48: ["안개", "🌫️"],
    51: ["이슬비", "🌦️"],
    53: ["이슬비", "🌦️"],
    55: ["강한 이슬비", "🌧️"],
    56: ["어는 이슬비", "🌧️"],
    57: ["어는 이슬비", "🌧️"],
    61: ["약한 비", "🌧️"],
    63: ["비", "🌧️"],
    65: ["강한 비", "🌧️"],
    66: ["어는 비", "🌧️"],
    67: ["강한 어는 비", "🌧️"],
    71: ["약한 눈", "🌨️"],
    73: ["눈", "🌨️"],
    75: ["강한 눈", "❄️"],
    77: ["싸락눈", "🌨️"],
    80: ["소나기", "🌦️"],
    81: ["소나기", "🌧️"],
    82: ["강한 소나기", "⛈️"],
    85: ["눈 소나기", "🌨️"],
    86: ["강한 눈 소나기", "❄️"],
    95: ["뇌우", "⛈️"],
    96: ["우박을 동반한 뇌우", "⛈️"],
    99: ["강한 뇌우", "⛈️"],
  };
  return conditions[code] ?? ["날씨 정보", "🌡️"];
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`서버 응답 오류 (${response.status})`);
  }
  return response.json();
}

async function loadWeather(city = activeCity) {
  weatherContent.innerHTML =
    '<div class="weather-loading"><span class="loading-spinner" aria-hidden="true"></span><p>날씨를 불러오고 있어요</p></div>';
  setCityHeading(city);

  const params = new URLSearchParams({
    latitude: city.latitude,
    longitude: city.longitude,
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: city.timezone || "auto",
    forecast_days: "1",
  });

  try {
    const data = await fetchJson(`${WEATHER_API}?${params}`);
    const current = data.current;
    const [description, icon] = weatherDescription(current.weather_code);
    const high = Math.round(data.daily.temperature_2m_max[0]);
    const low = Math.round(data.daily.temperature_2m_min[0]);

    updateDate(data.timezone);
    weatherContent.innerHTML = `
      <div class="weather-overview">
        <div class="weather-summary">
          <div class="weather-icon" aria-hidden="true">${icon}</div>
          <div>
            <p class="temperature">${Math.round(current.temperature_2m)}<sup>°</sup></p>
            <p class="weather-description">${description} · 체감 ${Math.round(current.apparent_temperature)}°</p>
            <p class="weather-range">최고 ${high}° <span aria-hidden="true">·</span> 최저 ${low}°</p>
          </div>
        </div>
        <div class="weather-details">
          <div class="weather-detail">
            <span class="detail-icon" aria-hidden="true">💧</span>
            <div><p class="detail-label">습도</p><p class="detail-value">${current.relative_humidity_2m}%</p></div>
          </div>
          <div class="weather-detail">
            <span class="detail-icon" aria-hidden="true">🍃</span>
            <div><p class="detail-label">바람</p><p class="detail-value">${Math.round(current.wind_speed_10m)} km/h</p></div>
          </div>
          <div class="weather-detail">
            <span class="detail-icon" aria-hidden="true">☔</span>
            <div><p class="detail-label">강수량</p><p class="detail-value">${current.precipitation} mm</p></div>
          </div>
        </div>
      </div>`;
  } catch (error) {
    console.error("날씨 정보를 불러오지 못했습니다.", error);
    weatherContent.innerHTML =
      '<div class="error-message"><span>날씨를 불러오지 못했어요.</span><button type="button" data-retry-weather>다시 시도</button></div>';
    weatherContent.querySelector("[data-retry-weather]").addEventListener("click", () => loadWeather());
  }
}

function showQuoteError() {
  quoteContent.innerHTML =
    '<div class="error-message"><span>명언을 불러오지 못했어요.</span><button type="button" data-retry-quote>다시 시도</button></div>';
  quoteContent.querySelector("[data-retry-quote]").addEventListener("click", () => loadQuote(true));
}

async function loadQuote(forceRefresh = false) {
  const today = dateForTimezone(activeCity.timezone || "Asia/Seoul");
  const cacheKey = `todays-sky-advice-v1-${today}`;

  if (!forceRefresh) {
    try {
      const cachedQuote = localStorage.getItem(cacheKey);
      if (cachedQuote) {
        renderQuote(JSON.parse(cachedQuote));
        return;
      }
    } catch (error) {
      console.error("저장된 명언을 불러오지 못했습니다.", error);
    }
  }

  quoteContent.innerHTML =
    '<div class="quote-loading"><span class="loading-spinner" aria-hidden="true"></span><p>오늘의 문장을 찾고 있어요</p></div>';

  try {
    const data = await fetchJson(QUOTE_API);
    if (!data?.message || !data?.author) {
      throw new Error("명언 API에서 유효한 문장을 받지 못했습니다.");
    }

    const quoteEntry = {
      text: data.message,
      author: data.author,
      profile: data.authorProfile || "",
    };
    try {
      localStorage.setItem(cacheKey, JSON.stringify(quoteEntry));
    } catch (error) {
      console.error("명언을 저장하지 못했습니다.", error);
    }
    renderQuote(quoteEntry);
  } catch (error) {
    console.error("오늘의 명언을 불러오지 못했습니다.", error);
    showQuoteError();
  }
}

function renderQuote(quote) {
  const text = document.createElement("p");
  text.className = "quote-text";
  text.textContent = `“${quote.text}”`;

  const author = document.createElement("p");
  author.className = "quote-author";
  author.textContent = `— ${quote.author}${quote.profile ? ` · ${quote.profile}` : ""}`;

  quoteContent.replaceChildren(text, author);
}

cityForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = cityInput.value.trim();
  if (!query) {
    cityInput.focus();
    return;
  }

  cityResults.replaceChildren();
  const submitButton = cityForm.querySelector("button");
  submitButton.disabled = true;
  submitButton.textContent = "검색 중";

  try {
    const params = new URLSearchParams({
      name: query,
      count: "5",
      language: "ko",
      format: "json",
    });
    const data = await fetchJson(`${GEOCODING_API}?${params}`);

    if (!data.results?.length) {
      cityResults.textContent = "검색 결과가 없어요. 다른 도시 이름을 입력해 주세요.";
      return;
    }

    data.results.forEach((result) => {
      const button = document.createElement("button");
      button.className = "city-result";
      button.type = "button";
      const name = document.createElement("span");
      name.textContent = result.name;
      const details = document.createElement("small");
      details.textContent = [result.admin1, result.country].filter(Boolean).join(", ");
      button.append(name, details);
      button.addEventListener("click", () => {
        const selectedCity = {
          name: result.name,
          country: result.country || "",
          latitude: result.latitude,
          longitude: result.longitude,
          timezone: result.timezone || "auto",
        };
        cityResults.replaceChildren();
        cityInput.value = "";
        loadWeather(selectedCity);
        loadQuote();
      });
      cityResults.append(button);
    });
  } catch (error) {
    console.error("도시를 검색하지 못했습니다.", error);
    cityResults.textContent = "도시 검색에 실패했어요. 잠시 후 다시 시도해 주세요.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "검색";
  }
});

locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    weatherContent.innerHTML =
      '<div class="error-message"><span>이 브라우저에서는 위치 정보를 사용할 수 없어요. 도시를 검색해 주세요.</span></div>';
    return;
  }

  locationButton.disabled = true;
  locationButton.textContent = "위치 확인 중";
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      loadWeather({
        name: "내 위치",
        country: "",
        latitude: coords.latitude,
        longitude: coords.longitude,
        timezone: "auto",
      });
      locationButton.disabled = false;
      locationButton.innerHTML = '<span aria-hidden="true">◎</span> 내 위치';
    },
    (error) => {
      console.error("현재 위치를 가져오지 못했습니다.", error);
      weatherContent.innerHTML =
        '<div class="error-message"><span>위치를 확인할 수 없어요. 권한을 확인하거나 도시를 검색해 주세요.</span></div>';
      locationButton.disabled = false;
      locationButton.innerHTML = '<span aria-hidden="true">◎</span> 내 위치';
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
  );
});

loadWeather();
loadQuote();
