var qCounter = 0;
var correctCounter = 0;
var incorrectCounter = 0;
var unansweredCounter = 0;
var timer = 20;
var totalTimer = timer;
var qTimer;


var questions = [

    {
        question: "Which country did Bibimbap originate from?",
        answer: "Korea",
        choice1: "Japan",
        choice2: "Thailand",
        choice3: "Singapore",
        picture: "bibimbap.jpg"
    }, {
        question: "Which country did Chicken Satay originate from?",
        answer: "Indonesia",
        choice1: "Malaysia",
        choice2: "Philippines",
        choice3: "Thailand",
        picture: "chickensatay.jpg"
    }, {
        question: "Which country did this broken rice dish originate from?",
        answer: "Vietnam",
        choice1: "Singapore",
        choice2: "Thailand",
        choice3: "Cambodia",
        picture: "comtam.jpg"
    }, {
        question: "Where did Dim Sum originate from?",
        answer: "Taiwan",
        choice1: "Hong Kong",
        choice2: "Southern California",
        choice3: "Singapore",
        picture: "dimsum.jpg"
    }, {
        question: "What raw meat is commonly eaten in Japan?",
        answer: "Horse",
        choice1: "Veal",
        choice2: "Sheep",
        choice3: "Lamb",
        picture: "meat.jpg"
    }, {
        question: "Hainan Chicken is considered one of the national dishes of which country?",
        answer: "Singapore",
        choice1: "China",
        choice2: "Thailand",
        choice3: "Cambodia",
        picture: "hainanchicken.jpg"
    }, {
        question: "Around how many different variations of Kimchi are there in Korea?",
        answer: "200",
        choice1: "150",
        choice2: "100",
        choice3: "50",
        picture: "kimchi.jpg"
    }, {
        question: "Where do people eat Natto, fermented beans, for breakfast?",
        answer: "Japan",
        choice1: "Malaysia",
        choice2: "Hong Kong",
        choice3: "Vietnam",
        picture: "natto.jpg"
    }, {
        question: "What are the rice balls from Japan called?",
        answer: "Onigiri",
        choice1: "Baogiri",
        choice2: "Banh Bao",
        choice3: "Irigino",
        picture: "onigiri.jpg"
    }, {
        question: "Where did Pho originate from?",
        answer: "Vietnam",
        choice1: "China",
        choice2: "Thailand",
        choice3: "Indonesia",
        picture: "pho.jpg"
    }, {
        question: "Where did Shabu Shabu originate from?",
        answer: "Japan",
        choice1: "Taiwan",
        choice2: "Thailand",
        choice3: "Indonesia",
        picture: "shabu.jpg"
    }, {
        question: "Sukiyaki originated from which country?",
        answer: "Japan",
        choice1: "Cambodia",
        choice2: "South Korea",
        choice3: "Thailand",
        picture: "sukiyaki.jpg"
    }, {
        question: "What is this sour and spicy soup called?",
        answer: "Tom Yum",
        choice1: "Yum Tom",
        choice2: "Ting Ling",
        choice3: "Yum Ting",
        picture: "thaitomyum.jpg"
    }


];

$(document).ready(function() {

    function appendQuestion() {
        $('#question').typeIt({
            strings: questions[qCounter].question,
            speed: 75,
            autoStart: false,
            cursor: false,
            lifeLike: true
        });
        $("#answer").html(questions[qCounter].answer);
        $("#choice1").html(questions[qCounter].choice1);
        $("#choice2").html(questions[qCounter].choice2);
        $("#choice3").html(questions[qCounter].choice3);
        $('#picture').css({ "background-image": "url(assets/images/" + questions[qCounter].picture + ")", "background-position": "cover" });
    }


    //Fisher-Yates Shuffle
    function randomizeQuestions(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
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
        $("#showAnswer").html(questions[qCounter].answer).typeIt({ speed: 100, lifeLike: true });
        clearInterval(qTimer);
        nextQuestionTimer();
    }

    function nextQuestionTimer() {
        qCounter++;
        console.log(qCounter);
        if (qCounter != questions.length) {
            setTimeout(function() {
                $("#result").empty();
                $("#picture").show();
                nextQuestion();
                resetTimer();
            }, 4000);
        } else {

            setTimeout(function() {
                $("#result").empty();
                finalScreen();
            }, 4000);
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
        if (timer == 0) {
            unanswered();
        }
    }

    function finalScreen() {
        if (qCounter == questions.length) {
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
            $("#result").append("<br> <img src='assets/images/dwight.gif'>")
            $("#result").append("<br> <button id='reset' class='btn-lg btn-danger'>New Game</button>")
            $("#reset").click(function() {
                resetGame();
            });
        }
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
        randomizeQuestions(questions);
        appendQuestion();
        resetTimer();
        questionCountDown();
    }

    function applyClickHandlers() {
        $(".wrongAnswer").click(function() {
            wrongAnswer();
        });
        $("#answer").click(function() {
            rightAnswer();
        });
    }

    function start() {
        randomizeQuestions(questions);
        appendQuestion();
        applyClickHandlers();
        randomizeChoices();
        resetTimer();
        questionCountDown();
        finalScreen();
    }

    start();

});
