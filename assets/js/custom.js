(function($, Handlebars) {
  var ITEMS = [],
      RECIPES = [],
      searchResult = document.getElementById('search_result_wrapper'),
      detailsWrapper = document.getElementById('details_wrapper'),
      $searchBox = $('#search_box');

  $.when(
    $.getJSON('assets/items.json'),
    $.getJSON('assets/recipes.json')
  ).then(function(items, recipes) {
    ITEMS = items[0];
    RECIPES = recipes[0];
    $searchBox.val('Pickaxe').trigger('keyup');
  });

  var keyUptTimeout = null;
  $searchBox.on('keyup', function(e) {
    if (keyUptTimeout != null) { clearTimeout(keyUptTimeout); }

    var searchText = e.target.value.toLowerCase();

    keyUptTimeout = setTimeout(function() {
      keyUptTimeout = null;
      searchResult.innerHTML = '';

      var resultSize = 0;
      var results = ITEMS.filter(function(i) {
        if (resultSize < 10 && i.displayName.toLowerCase().indexOf(searchText) !== -1) {
          resultSize += 1;
          return true
        }
        return false;
      });
      searchResult.innerHTML = Handlebars.templates.search_results({results: results});
    }, 150);
  });

  $(searchResult).on('click', 'button', function(e) {
    var context = {
      item: ITEMS[e.target.dataset.id],
      recipes: (RECIPES[e.target.dataset.id] || []).map(function(recipe) {
        if (recipe.result) {
          recipe.result.item = ITEMS[recipe.result.id]
        }
        if (recipe.ingredients) {
          recipe.ingredients = recipe.ingredients.map(function(ingredient) {
            return ITEMS[ingredient];
          })
        }
        if (recipe.inShape) {
          recipe.inShape = recipe.inShape.map(function(row) {
            return row.map(function(col) {
              return col === null ? null : ITEMS[col];
            });
          }).reverse(); // For some reason, the rows are inverted. See: https://github.com/PrismarineJS/minecraft-data/issues/231
        }
        return recipe;
      })
    };
    console.log(context);

    detailsWrapper.innerHTML = Handlebars.templates.details(context);
  });

})(jQuery, Handlebars);
