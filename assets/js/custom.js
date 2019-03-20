(function($, Handlebars) {
  var ITEMS = [],
      RECIPES = [],
      TEXTURE_CONTENT = [],
      TEXTURE_CONTENT_MAP = {},
      searchResult = document.getElementById('search_result_wrapper'),
      detailsWrapper = document.getElementById('details_wrapper'),
      $searchBox = $('#search_box');

  // Map precompiled tempaltes into partials
  // https://stackoverflow.com/a/12148609/224707
  Handlebars.partials = Handlebars.templates;


  $.when(
    $.getJSON('assets/items.json'),
    $.getJSON('assets/recipes.json'),
    $.getJSON('assets/texture_content.json')
  ).then(function(items, recipes, texture_content) {
    ITEMS = items[0];
    RECIPES = recipes[0];
    TEXTURE_CONTENT = texture_content[0];
    TEXTURE_CONTENT_MAP = TEXTURE_CONTENT.reduce(function(acc, val, key) {
      acc[val.name] = key;
      return acc;
    }, {});

    $searchBox.val('iron ingot').trigger('keyup');
    setTimeout(function() {
      $('button', searchResult).first().click();
    }, 200);
  });

  var getItem = function(item) {
    if (item === null) return null;

    if (typeof item == 'object') {
      item = item.id
    }

    var item = { item: ITEMS[item] };
    if (TEXTURE_CONTENT_MAP[item.item.name]) {
      item.texture = TEXTURE_CONTENT[TEXTURE_CONTENT_MAP[item.item.name]];
    }
    return item;
  }

  var expandRecipe = function(recipe) {
    var expandedRecipe = {};

    if (recipe.result) {
      expandedRecipe.result = getItem(recipe.result.id);
      expandedRecipe.result.count = recipe.result.count;
    }

    if (recipe.ingredients) {
      expandedRecipe.ingredients = recipe.ingredients.map(getItem)
    }

    if (recipe.inShape) {
      expandedRecipe.inShape = recipe.inShape.map(function(row) {
        return row.map(getItem);
      }).reverse(); // For some reason, the rows are inverted. See: https://github.com/PrismarineJS/minecraft-data/issues/231
    }

    return expandedRecipe;
  }

  var showDetails = function(id) {
    var context = {
      selected: getItem(id),
      createdWithRecipes: (RECIPES[id] || []).map(expandRecipe),
      usedInRecipes: Object.values(RECIPES).filter(function(recipes) {
        for (var i = 0; i < recipes.length; i++) {
          var recipe = recipes[i];
          if (recipe.ingredients && recipe.ingredients.indexOf(id) !== -1) {
            return true;
          }

          if (recipe.inShape) {
            for (var y = 0; y < recipe.inShape.length; y++) {
              for (var x = 0; x < recipe.inShape[y].length; x++) {
                if (recipe.inShape[y][x] == id) {
                  return true;
                }
              }
            }
          }
        }

        return false;
      }).flat().map(expandRecipe),
    };

    detailsWrapper.innerHTML = Handlebars.templates.details(context);
    $('[data-toggle="tooltip"]', detailsWrapper).tooltip()
  }

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
        }).map(getItem);
      }
      else {
        var results = [];
      }

      searchResult.innerHTML = Handlebars.templates.search_results({results: results});
      $('[data-toggle="tooltip"]', searchResult).tooltip()
    }, 150);
  }).trigger('keyup');

  $(searchResult).on('click', 'button', function(e) {
    $('.active', search_result_wrapper).removeClass('active');
    e.target.className += ' active';
    showDetails(e.target.dataset.id)
  });

  $(detailsWrapper).on('click', 'img.mc-item', function(e) {
    $('.tooltip').remove();
    showDetails(e.target.dataset.id)
  });
})(jQuery, Handlebars);
