const UserTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const errorContainer = document.querySelector("[data-error-container]");
const errorImage = document.querySelector("[data-error-image]");


// Initially variables req

let oldTab=UserTab;
const API_KEY = "585f18aa449ca7f5ceaf04c28ea05f03";
oldTab.classList.add("current-tab");
getfromSessionStorage();


function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");


        if(!searchForm.classList.contains("active")){
 // kya search form wala container is invisible, if yes then make it visible           
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            errorContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
          // ab mee pahle search wale tab pr tha aur ab weather tab visible karna hai
             searchForm.classList.remove("active");
             userInfoContainer.classList.remove("active");
             errorContainer.classList.remove("active");
             //ab mee your weather tab me aa gaya hu, toh weather bhi display karna hoga
             // so let's check local storage first for coordinates, if we have save them there
             getfromSessionStorage();
        }
         
    }
}


UserTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(UserTab); 
});

searchTab.addEventListener("click",()=>{
//pass clicked tab as input parameter
switchTab(searchTab);
});


// check if coordinates are alraedy present in session storage
function getfromSessionStorage(){
  const localCoordinates=sessionStorage.getItem("user-coordinates");
  if(!localCoordinates){
    // agar local coordinates nahi mile
    grantAccessContainer.classList.add("active");
  }
  else{
    const coordinates=JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}


async function fetchUserWeatherInfo(coordinates){
   const{lat,lon} = coordinates;
   // make grantAccessContainer invisible
   grantAccessContainer.classList.remove("active");
   // make loader visible
   loadingScreen.classList.add("active");

   //API CALL
   try{
     const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
     const data=await response.json();
     loadingScreen.classList.remove("active");
     userInfoContainer.classList.add("active");
     renderWeatherInfo(data);
   }
   catch(err){
    loadingScreen.classList.remove("active");
    console.error("Error fetching weather data:", err);
   }
   
}


function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the elements

    const cityName=document.querySelector("[data-city-Name]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    // console.log(weatherInfo);

    //fetch values from weatherInfo object & put it in UI elements
  
    cityName.innerText= weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}

 
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation is not supported by this browser.");
    }
}


function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
     fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton=document.querySelector("[data-grant-access]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e) =>{
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName === ""){
        return ;
    }
    else {
        fetchSearchWeatherInfo(cityName);
    }
});



async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    errorContainer.classList.remove("active")

    try{
   const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data= await response.json();
    loadingScreen.classList.remove("active");

     if (response.ok) {
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
    }
    
    else {
            errorContainer.classList.add("active");
        }
    }
    catch(err){
        
       loadingScreen.classList.remove("active");
       errorContainer.classList.add("active");
       console.error("Error fetching weather data:", err);
    }

}     


