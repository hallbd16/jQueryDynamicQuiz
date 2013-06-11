$(function () {

var answersSelected = [];
var i = 0;
var name;
var prefix= "dynamicQuizStorage" //  localStorage prefix

//Begin Quiz
//Require name entry to begin quiz.  If repeat, get old data from localStorage.  Hide name field and begin quiz one name is submitted.
$("#submitName").click(function(){
	if($("#name").val()==='') {
		alert('Please enter a name to take the quiz.'); 
		return false;
	}else{
		name = $("#name").val();//set the global name variable		
		//loop through local storage object.  If matching name exists set the value as the answersSelected array
		for (var prop in localStorage) {  
			if (prop === prefix+name) {
				alert("Welcome back, " + name +".  Your previous answers have been set.");
				answersSelected= localStorage.getItem(prefix+name).split(',');
			}
		}
		$("#nameContainer").hide();
		//next two function begin the quiz
		populateQuestion();
		createButtons();
	}
});//close enter name function



function populateQuestion() {  
	$("#insideContainer").fadeOut( function() {
	console.log("fadeOut");	
		if(i<allQuestions.length) {
			$("#question").text(allQuestions[i].question);  // add question text
			$("#target").empty();  // clear any existing radios
			
			//show next button except for last question when submit button is shown
			if(i===allQuestions.length-1) {
			$("#nextButton").hide(); 
			$("#submitButton").show();
			}else {
			$("#nextButton").show();
			$("#submitButton").hide();
			}
			//show prev button except for first question 
			if(i===0){$("#prevButton").hide();}else{$("#prevButton").show();}
	
			//add answer choices and radios
			for(var j=0; j<allQuestions[i].choices.length; j++) {  
			$('#target').append('<input type="radio" name="answerChoices"' + 'value="' + j + '"/>');
			$('#target').append(allQuestions[i].choices[j] + '<br/>');
			 /* I would rather do it like I have done the buttons by setting html attributes as objects rather than line type the code something like this:
			var radioinputtest= $('<input/>', {
				type: 'radio',
				value: 2,
				name: "radioName"
				text: 'Next', //set text 1 to 10	
				id: 'radioinputtest',  // should I be able to select the button by this id?? Seems like I could use this to append the button	
				}); */
		}

			//check if answer previously selected.  If yes, set that as the default
			if(!(isNaN(answersSelected[i]))) { 
			$("input[value="+answersSelected[i]+"]").prop("checked", true);  
			}
		}
	
			});
	$("#insideContainer").fadeIn();
		console.log('test');
}

//check an answer is selected, record that to answersSelected array, and populate next question
function processAnswer() {
answersSelected[i] = +$('input[name="answerChoices"]:checked').val();
	
	if (isNaN(answersSelected[i])) {
        alert('No answer selected.  Please choose one.');
        return false;    	 	
	 } else if (i<allQuestions.length) {
        	i++;
    		populateQuestion();
    } 
} 

function submitFinalAnswer() {
	//check if answer is selected then record that to answerSelected array,  next display final screen
	answersSelected[i] = +$('input[name="answerChoices"]:checked').val();
	if (isNaN(answersSelected[i])) {
        alert('No answer selected.  Please choose one.');
        return false;
    }    	 	
	$("#insideContainer").fadeOut(function() {	
       	$("#question").text('Congratulations!  You have completed the quiz.');
		$("#target").empty();
		$("#prevButton").hide();
		$("#submitButton").hide();
		$("#restartButton").show();
		var incorrectQuestions= [];
		function questionsMissed() {
			//make array of incorrect answers
			for (var j=0; j<allQuestions.length; j++) {
				if (allQuestions[j].correctAnswerIndex !== answersSelected[j]) {
				incorrectQuestions.push(j+1);
				}
			}
			//set text depending on how many questions were missed
			if(incorrectQuestions.length===0){var textInput= "Well done, you got 100% of the answers correct!"
			} else if (incorrectQuestions.length==1) { var textInput= "You missed question : " + incorrectQuestions.join();
			}else{  var textInput= "You missed the following questions: " + incorrectQuestions.join();}
			$("#target").html(textInput);
		}
		questionsMissed();
	});
	$("#insideContainer").fadeIn();
}

/*  This function  to prevent multiple clicks and default events does not work*/
function preventMultiClicks(){
			//prevent multiple clicks and default events
        	event.preventDefault();
        	if($("#insideContainer").filter(':animated').length>0) {return false;}
        	}

function createButtons() {
	var nextButton= $('<button/>', {
        text: 'Next', 
        id: 'nextButton',
        click: function (event) {
			//prevent multiple clicks and default events.  Unforunately cannot use preventMultiClicks() function.  Not sure why
        	event.preventDefault();
        	if($("#insideContainer").filter(':animated').length>0) {return false;}
	        processAnswer();  
         }//close click function
});  //close nextButton

	var prevButton= $('<button/>', {
        text: 'Back', 
        id: 'prevButton',
        click: function () {
			//prevent multiple clicks and default events
        	event.preventDefault();
        	if($("#insideContainer").filter(':animated').length>0) {return false;}
       	 	i--;
			populateQuestion();
          } //close click function
    });// close prevButton

		var submitButton= $('<button/>', {
        text: 'Submit', 
        id: 'submitButton',
        click: function () {
			console.log(name+" is the name ");
			//prevent multiple clicks and default events
        	event.preventDefault();
        	if($("#insideContainer").filter(':animated').length>0) {return false;}
       	 	submitFinalAnswer();
			//save answers to a local copy
			var keyName= prefix + name;
			localStorage.setItem(keyName, answersSelected);
			console.log(localStorage);
          } //close click function
    });// close submitButton
    
	var restartButton = $('<button>', {
		text: "Restart",
		id: "restartButton",
		click: function () {
			//prevent multiple clicks and default events
        	event.preventDefault();
        	if($("#insideContainer").filter(':animated').length>0) {return false;}
			i= 0;
			populateQuestion();
			$("#restartButton").hide();
		}
	});
	
	//append buttons and set hidden buttons
	$("#buttons").append(prevButton);
	$("#prevButton").hide();
	$("#buttons").append(nextButton);
	$("#buttons").append(submitButton)
	$("#submitButton").hide();
	$("#buttons").append(restartButton);
	$("#restartButton").hide();
}

}); //onload jQuery close
