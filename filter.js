var autoFilterLibrary = {

  autoFilter: function(inputIdName, displayIdName, listData) {

    var inputId = document.getElementById(inputIdName) || inputIdName[0];
    var displayId = document.getElementById(displayIdName) || displayIdName[0];
    //saving the list-item class so that styling is preserved
    var listClass = "class='" + displayId.firstChild.nextElementSibling.className + "'";

    this.filterListener(inputId, displayId, listData, listClass);
  },

  drawAutoFilter: function(context, listData, options) {
    var container = document.getElementById(context) || context[0];

    var defaults = {
      placeholder: "Search the list here",
      inputCSS: {
                  "width": "95%",
                  "border-radius": "5px",
                  "border": "1px solid #999999",
                  "padding": "2%",
                  "margin-bottom": "2%",
                  "font-family": "sans-serif",
                  "font-size": "1em"
                },
      listCSS: {
                  "width": "95%",
                  "border-radius": "5px",
                  "border": "1px solid #999999",
                  "padding": "0",
                  "font-family": "sans-serif",
                  "color": "#444444"
                },
      listItemCSS: {
                    "border-top": "1px solid #999999",
                    "padding": "2%",
                    "list-style": "none"
                    }
    };

    mergedOptions = this.optionsMerge(options, defaults);

    //setting up html to insert into DOM
    var inputField = "<input type='text' placeholder='" + mergedOptions.placeholder + "'>";
    
    var firstListStyle = Object.create(mergedOptions.listItemCSS);
    firstListStyle["border-top"] = undefined;
    var firstListStyle = "style='" +  this.jsonToCSS(firstListStyle) + "'";

    var listStyle = "style='" +  this.jsonToCSS(mergedOptions.listItemCSS) + "'";
    var listItems = listData.map( function(data, index) {
        if (index == 0) {
          return "<li " + firstListStyle + ">" + data + "</li>";
        } else {
          return "<li " + listStyle + ">" + data + "</li>";
        }
      });

    //inserting and styling new elements
    container.innerHTML = inputField + "<ul>" + listItems.join(" ") + "</ul>";
    container.setAttribute("style", "vertical-align: top;");
    container.children[0].setAttribute("style", this.jsonToCSS(mergedOptions.inputCSS));
    container.children[1].setAttribute("style", this.jsonToCSS(mergedOptions.listCSS));

    //activating the filter listener
    this.filterListener(container.children[0], container.children[1], listData, listStyle, firstListStyle);
  },

  filterListener: function(inputEl, displayEl, listData, listAttr, firstListStyle){
    inputEl.addEventListener("input", function(){

      var filtered = listData.filter(function(value) {
        return value.toLowerCase().indexOf(inputEl.value.toLowerCase()) > -1
      });

      var listItems = filtered.map( function(data, index) {
        if( index == 0 && firstListStyle) {
          return "<li " + firstListStyle + ">" + data + "</li>";
        }
        return "<li " + listAttr +">" + data + "</li>";
      });
      
      displayEl.innerHTML = listItems.join(" ");
    });   
  },

  optionsMerge: function(options, defaults){
    for (var key in options) {
      if (options[key].constructor == Object) {
        //combining sub-objects so we don't override default css options
        defaults[key] = this.optionsMerge(options[key], defaults[key]);
      } else {
        defaults[key] = options[key];
      }
    }
    return defaults;
  },

  jsonToCSS: function(jsonObj){
    var cssString = new String;
    for ( attr in jsonObj ) {
      cssString = cssString + attr + ":" + jsonObj[attr] + ";"
    }
    return cssString;
  }
};



