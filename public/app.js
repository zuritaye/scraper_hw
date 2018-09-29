// Grab articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the information on the page
      $("#articles").append("<h3 data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</h3>");
    }
  });
  
  
// When tag is click
  $(document).on("click", "h3", function() {
// Empty the notes from the note section
    $("#notes").empty();
// Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
// make ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
// Add the note information to the page
      .then(function(data) {
        console.log(data);
        // title of the article
        $("#notes").append("<h3>" + data.title + "</h3>");
        // input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // button to submit a new note with the id article save 
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
// When clicking the savenote button
  $(document).on("click", "#savenote", function() {
// Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
// Run a POST request to change the note
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {
        // log the response
        console.log(data);
        // empty the notes section
        $("#notes").empty();
      });
  
    // remove values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  