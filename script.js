document.addEventListener("DOMContentLoaded" , () => {

    const API_KEY = "550ca14fd13d481aa18184603250608"; // Replace with your WeatherAPI key

    const div1 = document.getElementById("div1")
    const div2 = document.getElementById("div2")
    const div3 = document.getElementById("div3")
    const input1 = document.getElementById("input1")
    const locat = document.getElementById("location")
    const search = document.getElementById("searchBtn")

    search.addEventListener("click" ,() => {
        const city = input1.value.trim();
        if(city === ""){
            alert("Please! Enter a Valid City, I don't have time")
            return
        }
    
        getweather(city)
    })

    function getweather(city){
        const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;

        fetch(url)
            .then(res => {
                if(!res.ok) throw new Error("City Not Found.")
                return res.json()
            })
            .then(data => {
                displayweather(data)
            })
            .catch(error => {
                div2.innerHTML = `<p class="text-white text-xl">${error.message}<p>`
            })
        }
    
    function displayweather(data){
        const {location,current} = data;

        div2.innerHTML = `
            <h2 class="text-white font-bold text-2xl mb-4">${location.name},${location.country}</h2>
            <p class="text-white text-xl">🌡️ Temperature: ${current.temp_c}°C</p>
            <p class="text-white text-xl">💧 Humidity: ${current.humidity}%</p>
            <p class="text-white text-xl">🌬️ Wind: ${current.wind_kph} m/s</p>
            <p class="text-white text-xl">🌥️ Condition: ${current.condition.text}</p>`
    }
})
