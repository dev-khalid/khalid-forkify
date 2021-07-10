import * as model from './model.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';
import addRecipeView from './view/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
//following two lines are used for polyfilling . so that super old browsers can also run our application
import 'core-js/stable'; //this one here is for polyfiling everything else
import 'regenerator-runtime/runtime'; //this one here is for polyfilling async await
// if(module.hot) {
//   module.hot.accept();
// }
// const timeout = function (s) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error(`Request took too long! Timeout after ${s} second`));
//     }, s * 1000);
//   });
// };

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipies = async function () {
  try {
    //get the id from the url
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    bookmarksView.update(model.state.bookmarks);
    //0.update search results view
    resultsView.update(model.getSearchResultsPage());
    //1.Loading data from the api.
    await model.loadRecipe(id);

    //2.Rendering Data
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1)Get Search Query

    const query = searchView.getQuery();
    if (!query) return;

    //2)Load Search Results
    await model.loadSearchResults(query); //as this will return a new promise so we need to await this .

    //3)Render Search Results
    // resultsView.render(model.state.search.results); // it render's all result
    resultsView.render(model.getSearchResultsPage());

    //4.Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goTopage) {
  //1)Render Search Results
  // resultsView.render(model.state.search.results); // it render's all result
  resultsView.render(model.getSearchResultsPage(goTopage));

  //2.Render initial pagination buttons
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  //update the servings (in state)
  model.updateServings(newServings);
  //update the recipe view
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  else model.addBookmark(model.state.recipe);
  recipeView.update(model.state.recipe);
  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //render spinner 
    addRecipeView.renderSpinner();
    //upload data to api
    await model.uploadRecipe(newRecipe);
    //Render recipe 
    recipeView.render(model.state.recipe); 
    //success message 
    addRecipeView.renderMessage(); 
    //render bookmark view 
    bookmarksView.render(model.state.bookmarks); 
    //change id in url 
    window.history.pushState(null,'',`#${model.state.recipe.id}`); 
    //close window 
    setTimeout(()=> {
      addRecipeView.toggleWindow(); 
    },MODAL_CLOSE_SEC*1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message); 
  }
}; 
const init = function () {
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipies);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe); 
};
init();

//things those are related to dom will not be involved inside controller
//this things are about dealing with view .
