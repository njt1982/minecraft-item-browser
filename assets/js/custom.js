(function($, Handlebars) {
  var ITEMS = [],
      RECIPES = [],
      TEXTURE_CONTENT = [],
      searchResult = document.getElementById('search_result_wrapper'),
      detailsWrapper = document.getElementById('details_wrapper'),
      $searchBox = $('#search_box');

  $.when(
    $.getJSON('assets/items.json'),
    $.getJSON('assets/recipes.json'),
    $.getJSON('assets/texture_content.json')
  ).then(function(items, recipes, texture_content) {
    ITEMS = items[0];
    RECIPES = recipes[0];
    TEXTURE_CONTENT = texture_content[0];
    $searchBox.val('Pickaxe').trigger('keyup');
  });

  var keyUptTimeout = null;
  $searchBox.on('keyup', function(e) {
    if (keyUptTimeout != null) { clearTimeout(keyUptTimeout); }

    var searchText = e.target.value.toLowerCase();

    keyUptTimeout = setTimeout(function() {
      keyUptTimeout = null;
      searchResult.innerHTML = '';

      if (searchText.length > 0) {
        var resultSize = 0;
        var results = ITEMS.filter(function(i) {
          if (resultSize < 10 && i.displayName.toLowerCase().indexOf(searchText) !== -1) {
            resultSize += 1;
            return true
          }
          return false;
        }).map(function(item) {
          return {
            item: item,
            texture: TEXTURE_CONTENT[item.id]
          };
        });
      }
      else {
        var results = [];
      }
      searchResult.innerHTML = Handlebars.templates.search_results({results: results});
    }, 150);
  });

  $(searchResult).on('click', 'button', function(e) {
    // @TODO - remove active from others!
    e.target.className += ' active';
    var context = {
      item: ITEMS[e.target.dataset.id],
      recipes: (RECIPES[e.target.dataset.id] || []).map(function(recipe) {
        if (recipe.result) {
          recipe.result.item = ITEMS[recipe.result.id]
        }
        if (recipe.ingredients) {
          recipe.ingredients = recipe.ingredients.map(function(ingredient) {
            return { item: ITEMS[ingredient], texture: TEXTURE_CONTENT[ingredient] };
          })
        }
        if (recipe.inShape) {
          recipe.inShape = recipe.inShape.map(function(row) {
            return row.map(function(col) {
              return col === null ? null : { item: ITEMS[col], texture: TEXTURE_CONTENT[col] };
            });
          }).reverse(); // For some reason, the rows are inverted. See: https://github.com/PrismarineJS/minecraft-data/issues/231
        }
        return recipe;
      })
    };

    detailsWrapper.innerHTML = Handlebars.templates.details(context);
  });

})(jQuery, Handlebars);
