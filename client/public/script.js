import cities from './data.js';

// Initialize the input field with autocomplete
const rootDiv = document.getElementById('root')
const input = document.createElement("input");
input.placeholder = "Choose a city";
input.style.color = "black";
input.style.fontWeight = "700";
input.style.backgroundColor = "lightgrey";
rootDiv.appendChild(input);
let selectedCity;


const datalist = document.createElement("datalist");
datalist.id = "cities";
input.setAttribute("list", "cities");
rootDiv.appendChild(datalist);

//Create fav button and cart

let favourites = [];

  const favButton = document.createElement("button");
  favButton.id = 'favBut'
  favButton.textContent = "Add to favourites";
  favButton.style.backgroundColor = "orange";
  favButton.style.color = "white";
  rootDiv.appendChild(favButton);

  const image = document.createElement("img");
  image.id = 'image';

const favoritesDiv = document.createElement("div");
favoritesDiv.className = "favorites-container";
document.body.appendChild(favoritesDiv);

  function updateFavourites() {
    const favList = favourites.map(city => `<p>${city}</p>`).join("");
    favoritesDiv.innerHTML = `<div class="favorites-card"><h3>Favourites</h3>${favList}</div>`;
    if (input.value === "" && favourites.length > 0) {
      favoritesDiv.style.display = "block";
    } else {
      favoritesDiv.style.display = "none";
    }
  }

  favButton.addEventListener("click", function(){
    selectedCity = input.value;
    // console.log(selectedCity)
  if (!favourites.includes(selectedCity)) {
    favourites.push(selectedCity);
    // console.log(favourites)
    updateFavourites()
    input.value = ""
   }
  
  })

  input.oninput = () => {
  const inputVal = input.value;
  const matchingCities = cities.filter(city => city.toLowerCase().startsWith(inputVal.toLowerCase()));
  let options = matchingCities.map(city => `<option value="${city}"></option>`);
  datalist.innerHTML = options.join("");

  if (inputVal === "" && favourites.length > 0) {
    // Show favourites list if input is empty and there are favourite cities
    const favList = favourites.map(city => `<option value="${city}"></option>`).join("");
    datalist.innerHTML += favList;
  } 
 };

// Function to fetch and display weather data
async function getCityWeather(city) {
  try {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=407f30a1dd414d9aac8120249231902&q=${city}&aqi=no`);
    const data = await response.json();

// Clear previous weather card
    const card = document.querySelector('.weather-card');
    if (card) {
      card.remove();
    }

// Create new weather card with updated weather data
    const cardContainer = document.createElement("div");
    cardContainer.className = "weather-card";
    rootDiv.appendChild(cardContainer);
    
    const title = document.createElement("h2");
    cardContainer.appendChild(title);
    title.innerText = data.location.name;

    const temperature = document.createElement("h3");
    cardContainer.appendChild(temperature);
    temperature.innerText = 'Current Temperature:\n' + data.current.feelslike_c + '°C';

    const general = document.createElement("h4");
    cardContainer.appendChild(general);
    general.innerText = 'General Weather:\n' + data.current.condition.text + '!';

    const humidity = document.createElement("h4");
    cardContainer.appendChild(humidity);
    humidity.innerText = 'Humidity Level:\n' + data.current.humidity + '%';
  } catch (error) {
    console.error(error);
  }
}

// Add an image of the selected city
async function getCityPhoto(city) {
  try {
    const response = `https://api.pexels.com/v1/search?query=${city}&per_page=1`;
    let urlpackage = await fetch(response, {
      headers: {
        Authorization:
        "EYakiC9CRTtStwIrnt4EkxmdhZHB3TkqAqeTC19AIajI5yi3BksUzX3v"
        //WcceGN4VytKnt3vifRFxdABX8sgNVlrTYwcVL7axBsPjBvETZJNMnZZ1
      }
    })
    const data = await urlpackage.json();
    // console.log(data)
    if(data.photos[0].src.large) {
      document.body.appendChild(image)
    image.src = data.photos[0].src.large
    }else{
      image.src = ' '
    }
  }
  catch (error) {
    console.error(error);

  }
}

//Create loading spinner
const spinner = document.getElementById("spinner");

async function loadData() {
  try{
    spinner.removeAttribute('hidden');
    const archived = await fetch('https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=1000ms')
    const unarchived = await archived.json()
      spinner.setAttribute('hidden', '');
  }
  catch (error) {
    console.error(error);
  }
}


// Change input value and update weather data
input.addEventListener("change", () => {
  const selectedCity = input.value;
  getCityWeather(selectedCity);
  image.src = ' '
  loadData()
  getCityPhoto(selectedCity)
  datalist.innerHTML = ''
});
