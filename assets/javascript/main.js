{/* <div class="forecast">
            <h4>9/14/2022</h4>
            <h5>Temp</h5>
            <h5>Wind</h5>
            <h5>Humidity</h5>
          </div> */}
const forecasts = [];
for(let i = 0;i<5; i++){
    forecasts.push(fiveDayForecast());
    console.log(forecasts[i]);
    document.getElementById("five-day-forecast").append(forecasts[i]);
    setForecast(i);
}

function fiveDayForecast(){
    const forecast = document.createElement("div");
    forecast.classList.add("forecast");
    forecast.append(document.createElement("h4"));
    forecast.append(document.createElement("h5"));
    forecast.append(document.createElement("h5"));
    forecast.append(document.createElement("h5"));
    return forecast;
}
function setForecast(index){
    forecasts[index].childNodes[0].textContent = "9/14/2022";
    forecasts[index].childNodes[1].textContent = "Temp";
    forecasts[index].childNodes[2].textContent = "Wind";
    forecasts[index].childNodes[3].textContent = "Humidity";
}