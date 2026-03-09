
let btn = document.getElementById("themeBtn");

btn.addEventListener("click", () => {
    document.body.classList.toggle("dark")

    if (document.body.classList.contains("dark")) {
        btn.textContent = "☀️ Light";
    } else {
        btn.textContent = "🌙 Dark";
    }
})

let searchBtn = document.getElementById("searchBtn")
let city = document.getElementById("cityInput")

searchBtn.addEventListener("click", () => {
    let cityName = city.value.trim();
    if(cityName){
        searchWeather(cityName);
    }
});
const API_KEY = 'f81ba25ab232a2af495e9d1455d7434c';

async function getWeather(city) {

    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`

    let response = await fetch(apiUrl)

    if (!response.ok) {
        throw new Error("Data could not found")
    }
    const data = await response.json()
  
    return data;

}

async function addFavorite(city) {

    let favorites = JSON.parse(localStorage.getItem("favorites")) || []

    if (!favorites.includes(city)) {
        favorites.push(city)
        localStorage.setItem("favorites", JSON.stringify(favorites))
    }
    loadFavorites()

}

function loadFavorites() {

    let favorites = JSON.parse(localStorage.getItem("favorites")) || []
    let list = document.getElementById("favoritesList")
    list.innerHTML = ""
    favorites.forEach(city => {
        let item = document.createElement("div")
        item.className = "favorite-item"
        let cityName = document.createElement("span")
        cityName.innerHTML = city

        let removeIcon = document.createElement("span")
        removeIcon.innerHTML = "❌"
        removeIcon.className = "remove-btn"
        item.appendChild(cityName)
        item.appendChild(removeIcon)

        cityName.addEventListener("click", () => {
            searchWeather(city)
        })

        removeIcon.addEventListener("click", (e) => {
            e.stopPropagation()
            let updatedFav = favorites.filter(c => c !== city)
            localStorage.setItem("favorites", JSON.stringify(updatedFav))

            loadFavorites()
        })

        list.appendChild(item)
    })
}

async function searchWeather(city) {

    let cityName = city || document.getElementById("cityInput").value
    let card = document.getElementById("weatherCard")
    let errorMsg = document.getElementById("errorMsg")
    let loader = document.getElementById("spinner")

    loader.style.display = "block"
    card.style.display = "none"
    errorMsg.style.display = "none"

    try {
        let data = await getWeather(cityName)

        document.querySelector(".showCity").textContent = data.name
        document.querySelector(".showTemp").textContent = data.main.temp + " °C"
        document.querySelector(".showHumidity").textContent = data.main.humidity + "%"
        document.querySelector(".descWeather").textContent = data.weather[0].description
        loader.style.display = "none"
        card.style.display = "flex"
        errorMsg.style.display = "none"
    } catch (err) {
        loader.style.display = "none"
        errorMsg.style.display = "flex"
        card.style.display = "none"

        document.querySelector(".showError").textContent = err.message

    }


}

let timer ;
function debounceSearch() {
  clearTimeout(timer)
  timer = setTimeout(()=>{
    let cityName = city.value.trim()
    if(cityName){
        searchWeather(cityName)
    }
  },500)

}

document.addEventListener('DOMContentLoaded', function () {
    city.addEventListener("input",debounceSearch)

    loadFavorites();

});



// Export functions for button onclick (temporary)

window.searchWeather = searchWeather;

window.addFavorite = addFavorite;