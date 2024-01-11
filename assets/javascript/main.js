const apiKey = "71650f9b4cb44eeb4432c38ab5410ca5";
const builtGEOCodeCall = `http://api.openweathermap.org/geo/1.0/direct?appid=${apiKey}&`;
const builtForecastCall = `http://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&`;

const searchHistoryEl = document.getElementById("search-history");
const searches = [];

const forecasts = [];
for(let i = 0;i<5; i++){
    forecasts.push(createFiveDayElement());
    document.getElementById("five-day-forecast").append(forecasts[i]);
}

loadSearchHistory();

function newSearchButton(city){
    const button = document.createElement("button");
    button.textContent =city;
    
    if(searchHistoryEl.children.length > 0)
        searchHistoryEl.insertBefore(button, searchHistoryEl.children[0]);
    else
        searchHistoryEl.append(button);

    button.onclick = () =>{
        historySearchCity(city);
    }
    return button;
}

function createFiveDayElement(){
    const forecast = document.createElement("div");
    forecast.classList.add("forecast");
    forecast.append(document.createElement("h4"));
    forecast.append(document.createElement("img"));
    forecast.append(document.createElement("h4"));
    forecast.append(document.createElement("h4"));
    forecast.append(document.createElement("h4"));
    return forecast;
}
function setMainContainer(city, date, info){
    const container = document.getElementById("city-view");
    container.children[0].textContent = `${city} (${date})`;
    container.children[1].src = `https://openweathermap.org/img/wn/${info.icon}.png`;
    container.children[2].textContent = `Temp: ${info.temp}°F`;
    container.children[3].textContent = `Wind: ${info.wind} MPH`;
    container.children[4].textContent = `Humidity: ${info.humidity} %`;
}
function setForecast(index, date, info){
    forecasts[index].childNodes[0].textContent = date;
    forecasts[index].childNodes[1].src=`https://openweathermap.org/img/wn/${info.icon}.png`;
    forecasts[index].childNodes[2].textContent = `Temp: ${info.temp} °F`;
    forecasts[index].childNodes[3].textContent = `Wind: ${info.wind} MPH`;
    forecasts[index].childNodes[4].textContent = `Humidity: ${info.humidity} %`;
}
function historySearchCity(city){
    for(let i = 0;i<searches.length;i++){
        if(searches[i].city.toLowerCase() === city.toLowerCase())
        {
            fetchCityWeather(city, false);
            searchHistoryEl.insertBefore(searches[i].button, searchHistoryEl.children[0]);
            searches.unshift(searches[i]);
            searches.splice(i+ 1, 1);
            saveSearchHistory();
            return true;
        }
    }
    return false;
}

document.getElementById("search-button").onclick = (event) =>{
    event.preventDefault();
    const city = document.getElementById("search-city").value.trim();
    
    if(historySearchCity(city))
        return;

    fetchCityWeather(city, true);
};
function fetchCityWeather(city, newSearch){
    fetch(`${builtGEOCodeCall}q=${city}`)
    .then(result => result.json())
    .then(data => {
        if(data.length === 0){
            return;
        }
        fetch(`${builtForecastCall}lat=${data[0].lat}&lon=${data[0].lon}&units=imperial`)
        .then(result => result.json())
        .then(weatherData =>{
            if(newSearch){
                searches.unshift({
                    "city":city,
                    "button": newSearchButton(city)
                });
                saveSearchHistory();
            }
            setDashboard(weatherData, city);
        });
    });
}

function setDashboard(weatherData, city){
    weatherInfo = {};
    for(let day = 0; day < 5; day++){
        let newDay = day*8;
        let date = weatherData.list[newDay].dt_txt.substring(0, weatherData.list[newDay].dt_txt.indexOf(' '));
        weatherInfo[date] = {
            "temp":0,
            "wind":0,
            "humidity":0,
            "icon": weatherData.list[newDay].weather[0].icon
        };
        
        for(let i = 0;i<8; i++){
            let index = i + newDay;
            let dataInfo = weatherData.list[index];
            weatherInfo[date].temp += dataInfo.main.temp;
            weatherInfo[date].wind += dataInfo.wind.speed;
            weatherInfo[date].humidity += dataInfo.main.humidity;
        }
        
        for (const [key, value] of Object.entries(weatherInfo[date])){
            if(key === "icon")
                continue;

            weatherInfo[date][key] /= 8;
            weatherInfo[date][key] = weatherInfo[date][key].toFixed(2);
        }
        setForecast(day, date, weatherInfo[date]);
    }
    const date = Object.keys(weatherInfo)[0];
    setMainContainer(city, date, weatherInfo[date]);
}
function saveSearchHistory(){
    const cities = [];
    searches.forEach((city)=>{
        cities.push(city.city);
    });
    localStorage.setItem("search-history", JSON.stringify(cities));
}
function loadSearchHistory(){
    let temp = localStorage.getItem("search-history");
    if(temp === null){
        return;
    }
    temp = JSON.parse(temp);
    for(let i = temp.length - 1;i>=0;i--){
        searches.unshift({
            "city":temp[i],
            "button": newSearchButton(temp[i])
        });
    }
    fetchCityWeather(searches[0].city, false);
}