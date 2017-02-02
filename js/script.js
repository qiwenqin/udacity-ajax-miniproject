
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var streetValue = $('#street').val();
    var cityValue = $('#city').val();
    var address = streetValue + ','+ cityValue;

    var addressURL = 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address + '';
    $body.append('<img class = "bgimg" src = "' + addressURL + '">');

    var nytimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityValue + '&sort=newest&api-key=cd3d45b609b643e18c36fb7ed84c0492';
    $.getJSON(nytimesUrl,function(data){
      $nytHeaderElem.text("New York Times Articles About" + ' ' +cityValue);
      articles = data.response.docs;
      for (i=0; i < articles.length; i++){
        var article = articles[i];
        $nytElem.append('<li class = "article">'+'<a href = "'+article.web_url+'">'+ article.headline.main +'</a>'+'<p>'+ article.snippet +'</p>'+'</li>');
      };
    }).error(function(e){
      $nytHeaderElem.text("New York Times Articles Could Not Be loaded");
    });
    // $.ajax({
    //   url:nytimesUrl,
    //   dataType:jsonp,
    //   success:function(data){
    //     $nytHeaderElem.text("New York Times Articles About" + cityValue);
    //     articles = data.response.docs;
    //     for (i=0;i<article.length;i++){
    //       var article =articles[i];
    //       $nytElem.append('<li class = "article">'+'<a href = "'+article.web_url+'">'+article.headline.main+'</a>'+'<p>'+article.snippet+'</p>'+'</li>' );
    //     };
    //   }
    // }).error(function(e){
    //   $nytHeaderElem.text("New York Times Articles Could Not Be loaded");
    // });
    var wikiRequestTimeout = setTimeout(function(){
      $wikiElem.text('Failed to loaded wikipedia resourses');
    },8000);
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+cityValue +'&format=json&callback=wikiCallback';
    $.ajax({
      url:wikiUrl,
      dataType:'JSONP',
      success:function(response){
        var articleList = response[1];
        for (i=0;i<articleList.length;i++){
          articleStr = articleList[i];
          var url =  'http://en.wikipedia.org/wiki/'+articleStr;
          $wikiElem.append('<li>'+'<a href="'+url+'">'+articleStr+'</a>'+'</li>');
          clearTimeout(wikiRequestTimeout);
        }
      }
    });
    return false;
};

$('#form-container').submit(loadData);
