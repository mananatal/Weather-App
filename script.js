const user_tab=document.querySelector("[user-tab]");
const search_tab=document.querySelector("[search-tab]");
const form_container=document.querySelector(".formContainer");
const infoContainer=document.querySelector(".userInfoContainer");
const loadingContainer=document.querySelector(".loadingContainer");
const locationContainer=document.querySelector(".grantLocationContainer");
const errorContainer=document.querySelector(".errorContainer");

const API_KEY = "168771779c71f3d64106d8a88376808a";

let currentTab=user_tab;

currentTab.classList.add("currentTab");

getFromSessionStorage();

function switchTab(switchTab)
{
     if(currentTab!=switchTab){
        currentTab.classList.remove("currentTab");
        currentTab=switchTab;
        currentTab.classList.add("currentTab");
        

        if(!form_container.classList.contains("active"))
        {   
            locationContainer.classList.remove("active");
            infoContainer.classList.remove("active");
            form_container.classList.add("active");
        }
        else 
        {
            form_container.classList.remove("active");
            infoContainer.classList.remove("active");
            getFromSessionStorage();
        }
     }    
}

user_tab.addEventListener('click',()=>{
    switchTab(user_tab);
});

search_tab.addEventListener('click',()=>{
    switchTab(search_tab);
});

function getFromSessionStorage()
{
    let localCoordinates=sessionStorage.getItem("userCoordinates");

    if(localCoordinates)
    {
        const coordinates=JSON.parse(localCoordinates);
        getWeatherInfo(coordinates);
        
    }
    else
    {
        locationContainer.classList.add("active");
    }
}

const grantAccess=document.querySelector("[location-permission]");

grantAccess.addEventListener('click',getLocation);

function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        grantAccess.style.display='none';
    }
}

function showPosition(position)
{
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
      sessionStorage.setItem("userCoordinates",JSON.stringify(userCoordinates));
      getWeatherInfo(userCoordinates);

}

async function getWeatherInfo(coordinates)
{
    const {lat,lon}=coordinates;
    
    locationContainer.classList.remove("active");
    loadingContainer.classList.add("active");
   
    try
    {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await response.json();

        loadingContainer.classList.remove("active");
        infoContainer.classList.add("active");
        renderWeatherInfo(data);


    }
    catch(err)
    {
        loadingContainer.classList.remove("active");
        infoContainer.classList.remove("active");
        errorContainer.classList.add("active");

    }
}

function renderWeatherInfo(data)
{
    const cityName=document.querySelector("[city-name]");
    const weatherDesc=document.querySelector("[weather-desc]");
    const dataTemp=document.querySelector("[data-temp]");
    const windSpeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const clouds=document.querySelector("[data-clouds]");
    const countryFlag=document.querySelector("[country-flag]");
    const weatherIcon=document.querySelector("[ weather-desc-img]");

   
    cityName.innerHTML=data?.name;
   
    weatherDesc.innerHTML=data?.weather?.[0].
    description;
   
    dataTemp.innerHTML=`${data?.main?.temp} °C
    `;
  
    windSpeed.innerHTML=`${data?.wind?.speed} M/S`;
  
    humidity.innerHTML=`${data?.main?.humidity.toFixed(2)} %`;
  
    clouds.innerHTML=`${data?.clouds?.all.toFixed(2)} %`; 
  
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;

    countryFlag.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    
}

//Handling Search Form

const dataSearchForm=document.querySelector("[form-container]");
const searchInput=document.querySelector("[data-input]");

dataSearchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(searchInput.value==="")
    {
        return;
    }
   
    fetchCityWeather(searchInput.value);
    searchInput.value="";
});



async function fetchCityWeather(city)
{
    loadingContainer.classList.add("active");
    infoContainer.classList.remove("active");
    locationContainer.classList.remove("active");
    try
    {
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
                
        const data= await response.json();
       
        loadingContainer.classList.remove("active");
        infoContainer.classList.add("active");
        renderWeatherInfo(data);
    
    }
    catch(err)
    {
        loadingContainer.classList.remove("active");
        infoContainer.classList.remove("active");
        errorContainer.classList.add("active");

    }
}