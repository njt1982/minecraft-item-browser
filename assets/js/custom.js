(function($) {
  var ITEMS = [], RECIPES = [], $searchResult = $('#search_result'), $detailsWrapper = $('#details_wrapper');

  $.when(
    $.getJSON('assets/items.json'),
    $.getJSON('assets/recipes.json')
  ).then(function(items, recipes) {
    ITEMS = items[0];
    RECIPES = recipes[0];
  });


  var keyUptTimeout = null;
  $('#search_box').on('keyup', function(e) {
    if (keyUptTimeout != null) { clearTimeout(keyUptTimeout); }

    var searchText = e.target.value.toLowerCase();

    keyUptTimeout = setTimeout(function() {
      keyUptTimeout = null;
      $searchResult.empty();

      var resultSize = 0;
      ITEMS.filter(function(i) {
        if (resultSize < 10 && i.displayName.toLowerCase().indexOf(searchText) !== -1) {
          resultSize += 1;
          return true
        }
        return false;
      }).forEach(function(i) {
        $searchResult.append('<button type="button" data-id="' + i.id + '" class="list-group-item list-group-item-action">' + i.displayName + '</button>');
      });
    }, 150);
  });

  $searchResult.on('click', 'button', function(e) {
    console.log(e, e.target.dataset.id);
    var item = ITEMS.find(function(i) {return (i.id == e.target.dataset.id) })
    console.log(item);

    $detailsWrapper.empty();

    $detailsWrapper.append('<h1>' + item.displayName + '</h1>')
  });

})(jQuery);
