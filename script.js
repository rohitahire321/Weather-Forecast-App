document.addEventListener("DOMContentLoaded", () => {
const API_KEY = "550ca14fd13d481aa18184603250608"; // Replace with your WeatherAPI key

    const div1 = document.getElementById("div1");
    const div2 = document.getElementById("div2");
    const div3 = document.getElementById("div3");
    const input1 = document.getElementById("input1");
    const locat = document.getElementById("location");
    const search = document.getElementById("searchBtn");
    const cityList = document.getElementById("citylist")

    //Load Saved weather Data.
    const savedData = localStorage.getItem("weatherData")
    if(savedData){
        displayweather(JSON.parse(savedData))
    }

    let savedCities = JSON.parse(localStorage.getItem("cities")) || [];
    updateDropdown(savedCities);

    window.addEventListener("load", () => {
        localStorage.removeItem("cities");
    });


    search.addEventListener("click", () => {
    const city = input1.value.trim();
    if (city === "") {
        alert("Please! Enter a Valid City, I don't have time");
        return;
    }
    
    // If city is new, save to list & localStorage
    if (!savedCities.includes(city)) {
        savedCities.unshift(city); // put most recent first
        localStorage.setItem("cities", JSON.stringify(savedCities));
        updateDropdown(savedCities);
    }
        getweather(city);
    });

    locat.addEventListener("click", () => {
        getCurrentLocation()
    })
    
    function updateDropdown(cities) {
        cityList.innerHTML = cities.map(c => `<option value="${c}"></option>`).join("");
    }

    input1.addEventListener("change", () => {
    const selectedCity = input1.value.trim();
    if (savedCities.includes(selectedCity)) {
        getweather(selectedCity);
    }
    });

    function getweather(city) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no&alerts=no`;

    fetch(url)
        .then((res) => {
        if (!res.ok) throw new Error("City Not Found.");
            return res.json();
        })
        .then((data) => {
            localStorage.setItem("weatherData",JSON.stringify(data));
            displayweather(data);
        })
        .catch((error) => {
            //there is no need to validate city because if i write a no. then also it can catch error.
            alert("Enter name of a Valid City.")
            div2.innerHTML = `<p class="text-white text-xl">${error.message}<p>`;
        });
    }

    function getCurrentLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success,error)
    }
    else{
        console.log("Geolocation is not Supported by Your Browser.")
    }

    function success(position){
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        console.log("Latitude:",latitude,"Longitude:",longitude)

        getweatherByCoords(latitude,longitude)
    }
    function error(err){
        alert("Something Went Wrong!")
        console.log("Error getting location:",err)
    }
}
    
    function getweatherByCoords(lat,lon){
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=5`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log("weather by coords: " , data)
                localStorage.setItem("weatherData",JSON.stringify(data))
                displayweather(data)
            })
            .catch(err => {
                console.log("Error is: ", err)
            })
    }

    function displayweather(data) {
    const { location, current, forecast } = data;
    
    if(current.temp_c > 40){
        alert("This is a Red Region Area means Very High Temperature.")
    }
    if(current.temp_c < 10){
        alert("Cold Area.")
    }
    //current weather in div2
    div2.innerHTML = `
            <h2 class="text-white text-center font-bold text-2xl mb-4 transform transition-transform duration-300 hover:scale-150">${location.name},${location.country}</h2>
            <p class="text-red-500 text-xl">🌡️ Temperature: ${current.temp_c}°C</p>
            <p class="text-yellow-500 text-xl">💧 Humidity: ${current.humidity}%</p>
            <p class="text-green-500 text-xl">🌬️ Wind: ${current.wind_kph} m/s</p>
            <p class="text-sky-500 text-xl">🌥️ Condition: ${current.condition.text}</p>
            <img src="${current.condition.icon}" class="mx-auto w-20 h-20"/>`;

    //5-day forecast in div3
    const forecastCards = div3.querySelectorAll("div")

    forecast.forecastday.forEach((day,index) => {
        if(forecastCards[index]){
            forecastCards[index].innerHTML =` 
                <p class="text-white text-sm font-bold">${day.date}</p>
                <img src="${day.day.condition.icon}" class="mx-auto w-10 h-10">
                <p class="text-red-400 text-sm">🌡 ${day.day.avgtemp_c}°C</p>
                <p class="text-sky-400 text-sm">${day.day.condition.text}</p>`;
            }
        })
    }
});
