let searchBtn = document.getElementById("search");
let input = document.getElementById("input");
let cardContainer = document.querySelector(".card-container");
let foodContent = document.getElementById("foodContent");
let contentModal = document.querySelector(".content");
let closeBtn = document.querySelector(".close-btn");

const renderFood = async (search) => {
  document.getElementById("head").innerHTML = "Fetching Your Request...";
  try {
    let get = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search.value}`);
    let jsonData = await get.json();
    
    search.value = "";
    cardContainer.innerHTML = "";

    if (jsonData.meals !== null) {
      document.getElementById("head").innerHTML = "Best Dishes";
      jsonData.meals.forEach((meal) => {
        let cardDiv = document.createElement("div");
        cardDiv.classList.add("foodCard");
        cardDiv.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
          <h2>${meal.strMeal}</h2>
          <p>${meal.strArea} <span>Dish</span></p>
          <p>${meal.strTags ? meal.strTags : 'No Tags Available'}</p>
        `;

        let moreBtn = document.createElement("button");
        moreBtn.setAttribute("id", "viewMore");
        moreBtn.innerText = "View Recipe";
        cardDiv.appendChild(moreBtn);

        moreBtn.addEventListener("click", () => showContent(meal));

        cardContainer.appendChild(cardDiv);
      });
    } else {
      document.getElementById("head").innerHTML = "Please Enter a Valid Dish Name";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("head").innerHTML = "Error Fetching Data";
  }
};

function ingredient(meal) {
  let list = "";
  for (let a = 1; a <= 20; a++) {
    let ingredient = meal[`strIngredient${a}`];
    if (ingredient) {
      list += `<li>${ingredient}</li>`;
    } else {
      break;
    }
  }
  return list;
}

function showContent(meal) {
  foodContent.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <h3>Ingredients :</h3>
    <ul>${ingredient(meal)}</ul>
    <h3>Instructions :</h3>
    <p>${meal.strInstructions}</p>
  `;

  contentModal.style.display = "block";
  document.body.classList.add('no-hover'); 
}

closeBtn.addEventListener("click", () => {
  contentModal.style.display = "none";
  document.body.classList.remove('no-hover');
});

searchBtn.addEventListener("click", () => {
  if (input.value.trim() !== "") {
    renderFood(input);
  } else {
    document.getElementById("head").innerHTML = "Please Enter a Dish Name";
  }
});
