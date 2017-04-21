var qCounter = 0;
var correctCounter = 0;
var incorrectCounter = 0;
var unansweredCounter = 0;
var timer = 20;
var totalTimer = timer;
var qTimer;
var triviaQ;
var images;
var gameStart = false;

$(document).ready(function() {

//GRABS THE TRIVIA QUESTIONS
    function whichGame() {
        $.ajax({
            url: "https://opentdb.com/api.php",
            data: {
                amount: 9,
                category: 27,
                difficulty: 'medium',
                type: 'multiple'
            },
            method: "GET"
        }).done(function(response) {

            triviaQ = response;
            getImage();

        });
    }
//GRABS A GIF BASED ON THE TRIVIA QUESTIONS ANSWER
    function getImage() {
        var currentQ = triviaQ.results[qCounter].correct_answer.replace(/\W+/g, " ").split(" ").join("+");
        $.ajax({
            url: "https://api.giphy.com/v1/gifs/search?q=" + currentQ + "&rating=pg&api_key=dc6zaTOxFJmzC",
            method: "GET"
        }).done(function(response2) {
            images = response2;

            if (gameStart === false) {
                gameStart = true;
                start();
            }

        });
    }

    function appendQuestion() {
        $('#question').typeIt({
            strings: triviaQ.results[qCounter].question,
            speed: 50,
            autoStart: false,
            cursor: false,
            lifeLike: true
        });
        $("#answer").html(triviaQ.results[qCounter].correct_answer);
        $("#choice1").html(triviaQ.results[qCounter].incorrect_answers[0]);
        $("#choice2").html(triviaQ.results[qCounter].incorrect_answers[1]);
        $("#choice3").html(triviaQ.results[qCounter].incorrect_answers[2]);
        $('#picture').css({
            "background-image": "url(" + images.data[2].images.downsized.url + ")",
            "background-position": "cover"
        });
    }

    function randomizeChoices() {
        var container = $('#questionDiv');
        var nodes = container.children();
        for (var i = 0; i < nodes.length; i++) {
            container.append(nodes.eq(Math.floor(Math.random() * nodes.length)));
        }
    }

    function rightAnswer() {
        correctCounter++;
        $("#result").html("Nice! The answer again was: <div id='showAnswer'></div>");
        $("#result").append("<br> <img src='assets/images/barnyw.gif'>");
        transition();
    }

    function wrongAnswer() {
        incorrectCounter++;
        $("#result").html("Wrong! The answer was: <div id='showAnswer'></div>");
        $("#result").append("<br> <img src='assets/images/barny.gif'>");
        transition();
    }

    function unanswered() {
        unansweredCounter++;
        $("#result").html("Out of time! The answer was: <div id='showAnswer'></div>");
        $("#result").append("<br> <img src='assets/images/chandler.gif'>");
        transition();
    }
    //Hides picture and choices to show the transition screen
    function transition() {
        $("#picture").hide();
        $(".choices").hide();
        $("#showAnswer").html(triviaQ.results[qCounter].correct_answer).typeIt({
            speed: 100,
            lifeLike: true
        });
        clearInterval(qTimer);
        nextQuestionTimer();
    }

    function nextQuestionTimer() {
        qCounter++;
        console.log(qCounter);
        if (qCounter != 9) {
            getImage();
            setTimeout(function() {
                $("#result").empty();
                $("#picture").show();
                nextQuestion();
                resetTimer();
            }, 3000);
        } else {
            setTimeout(function() {
                $("#result").empty();
                finalScreen();
            }, 3000);
        }

    }

    function nextQuestion() {
        $(".choices").show();
        appendQuestion();
        randomizeChoices();
    }

    function progressTimer(timeleft) {
        $(".active").css("width", timeleft);
    }

    function questionCountDown() {
        var timeleft = (timer * (100 / totalTimer)) + "%";
        progressTimer(timeleft);
        timer--;
        if (timer < 0) {
            unanswered();
        }
    }

    function finalScreen() {
        qCounter = 0;
        console.log(qCounter);
        getImage();
        $('#question').typeIt({
            strings: "Final Score",
            speed: 75,
            autoStart: false,
            cursor: false,
            lifeLike: true
        });
        $('#result').typeIt({
            strings: ["Correct Answers: " + correctCounter, "Incorrect Answers: " + incorrectCounter, "Unanswered Questions: " + unansweredCounter],
            speed: 50,
            autoStart: false,
            lifeLike: true
        });
        $("#result").append("<br> <img src='assets/images/dwight.gif'>");
        $("#result").append("<br> <button id='reset' class='btn-lg btn-danger'>New Game</button>");
        $("#reset").click(function() {
            resetGame();
        });
    }

    function resetTimer() {
        timer = 20;
        qTimer = setInterval(questionCountDown, 1000);
    }

    function resetGame() {
        qCounter = 0;
        correctCounter = 0;
        incorrectCounter = 0;
        unansweredCounter = 0;
        timer = 20;
        totalTimer = timer;
        $("#result").empty();
        $("#picture").show();
        $(".choices").show();
        appendQuestion();
        resetTimer();
        questionCountDown();
    }

    function applyClickHandlers(triviaQ) {
        $(".wrongAnswer").click(function() {
            wrongAnswer(triviaQ);
        });
        $("#answer").click(function() {
            rightAnswer(triviaQ);
        });
    }

    function start() {

        appendQuestion();
        applyClickHandlers();
        randomizeChoices();
        resetTimer();
        questionCountDown();
        getImage();
    }

    whichGame();
});
