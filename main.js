
var myForm = document.querySelector("#myForm"); //Input form
var searchInput = document.querySelector("#searchInput");   //Recipe Name in input
var searchBtn = document.querySelector("#searchBtn"); //Search Buttom
var randomBtn = document.querySelector("#randomBtn");   //Random button
var dishPhoto = document.querySelector("#dishPhoto");   //List of dishes for search result
var dishName = document.querySelector("#dishName");     //Name of Dish
var origin = document.querySelector("#origin"); 
var category = document.querySelector("#category");
var ingredients = document.querySelector("#ingredients");
var quantity = document.querySelector("#quantity"); 
var instruction = document.querySelector("#instruction");   
// var container = document.querySelector(".container");   
var showMatchingResult = document.querySelector("#showMatchedResult");  //Show names of dishes under dishes pics while search result
var showResultImg = document.querySelector("#showResultImg");   //Result of searh string
var DOMDishPhoto = document.querySelector("#DOMDishPhoto");
var quantHeading = document.querySelector("#quantHeading");
var ingredHeading = document.querySelector("#ingredHeading");
var instructHeading = document.querySelector("#instructHeading");
var textEle = document.querySelector(".textEle");
var linkVideo = document.querySelector(".linkVideo");
var tagLine = document.querySelector("#tagLine");

//Fetch API and show Meal
function showMeal(e){
    e.preventDefault();
    tagLine.innerHTML = "";
    var word = searchInput.value;
    if(word.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${word}`)
        .then(res => res.json())
        .then((data) => {   
            showMatchingResult.innerHTML = `Matching Dish for your query <span class="searchHighlightStr">${word}</span>: `

            if(data.meals === null){
                showMatchingResult.innerText = "There is no matching result";
            }
            else{
                console.log(data.meals);
                dishPhoto.innerHTML = data.meals.map(mealList => 
                    `
                    <div class="col-md-4 col-sm-6 col-6 mb-3">
                    <img class="resultImg mealInfo" data-mealListId ="${mealList.idMeal}" src="${mealList.strMealThumb}" alt="${mealList.strMeal}" />
                    <span class="spanInfo">
                        <h4 class="mt-2">${mealList.strMeal}</h4>
                    </span> 
                    </div>
                    `                        
                ).join("");
            }

        });
        searchInput.value = "";

    }else{
        alert("Input Some thing")
    }

}


function getSelectedFood(foodID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${foodID}`)
    .then(res => res.json())
    .then(data => {
        var newData = data.meals[0];
        forDOMAdd(newData);
    })
}


function forDOMAdd(newData){
    dishPhoto.innerHTML = "";
    DOMDishPhoto.innerHTML = "";
    linkVideo.innerHTML  = "";


    
    var ingreds = [];
    var quant = [];
    
    for(var i=1; i<=20; i++){
        if(newData[`strIngredient${i}`]){
            ingreds.push(newData[`strIngredient${i}`]);
            quant.push(newData[`strMeasure${i}`]);
        }
        else{
            break;
        }
    }
    ingredHeading.innerText = "Ingredients";
    quantHeading.innerText = "Quantity";
    ingredients.innerHTML = ingreds.map((listIngred) => {
            return `<li>${listIngred}</li>`
    }).join("");

    quantity.innerHTML = quant.map((listQuant) => {
        return `<li>${listQuant}</li>`
    }).join("");
    DOMDishPhoto.innerHTML = `<img class="mainDishPic" src="${newData.strMealThumb}"
                                 alt="${newData.strMeal}" 
                                />`
    dishName.innerHTML = `Name: <span style="color:white;">${newData.strMeal}</span>`;

    if(newData.strArea && newData.strCategory){
        origin.innerHTML = `Origin: <span style="color:white;">${newData.strArea}</span>`;
        category.innerHTML = `Category: <span style="color:white;">${newData.strCategory}</span>`;
    }else{
        origin.innerHTML = "";
        category.innerHTML = "";
    }
    instructHeading.innerText ="Cooking-Instructions";
    instruction.innerText = newData.strInstructions;
    var videoStr = newData.strYoutube;
    var newVStr = videoStr.replace("watch?v=", "embed/");
    linkVideo.src = newVStr;
    
}
 

function randomDish(){
    tagLine.innerHTML  = "";
    textEle.innerText = ""; 
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then((data)=> {
        var newData = data.meals[0];
     forDOMAdd(newData);
    })

}





randomBtn.addEventListener("click", randomDish);
myForm.addEventListener("submit", showMeal)
dishPhoto.addEventListener("click", e => {

    var getFoodInfo = e.path.find(item => {
        if(item.classList){
            return item.classList.contains("mealInfo")
        }
        else{
            return false;
        }
    });
    var foodID = getFoodInfo.getAttribute("data-mealListId");
    getSelectedFood(foodID);
});
