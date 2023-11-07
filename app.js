// https://opentdb.com/api.php?amount=10&type=multiple
let category = document.querySelector(".categ");
let numberQuestion = document.querySelector(".count");
let question = document.querySelector(".question h2");
let answers = document.querySelector(".answers")
let prog = document.querySelector(".quiz-prog");
let progArr = document.querySelectorAll(".quiz-prog span");
let spanArr = Array.from(progArr)
let button = document.querySelector("button");
let radioInputs = document.getElementsByName("question");
let timer = document.querySelector(".time-left")
let points = 0;
let QuestionNumber = 0;




fetch("https://opentdb.com/api.php?amount=10&category=32")
.then(response=>response.json())
.then(data=>{
if(data.results){
    countDown()
    putQuestionAnswer(data);
    genAnswers(data);
    button.addEventListener("click",()=>{
        checkedAnswer(data.results[QuestionNumber].correct_answer);
        question.innerHTML = "";
        answers.innerHTML = "";
        if(QuestionNumber !== data.results.length-1){
            QuestionNumber++;
            putQuestionAnswer(data);
            genAnswers(data);
            
        }else{
            button.remove();
            prog.remove();
            showResult();
            clearInterval(countDownInterval);
        }
        
    })
}
})
function putQuestionAnswer(arr){
    if(arr.results[QuestionNumber].type == "multiple"){
        category.innerHTML = arr.results[QuestionNumber].category;
        numberQuestion.innerHTML = arr.results.length;
        question.innerHTML = arr.results[QuestionNumber].question;
        progSpan(arr)
    }
}
function progSpan(arr){
    prog.innerHTML = "";
    for(let i=0;i<arr.results.length;i++){
        let span = document.createElement("span");
        prog.appendChild(span);
        if(i==QuestionNumber){
            span.className = "active"
        }
        
    }
}
function genAnswers(arr){
    const incorrect = arr.results[QuestionNumber].incorrect_answers;
    const correct = arr.results[QuestionNumber].correct_answer;
    let randomIndex = Math.floor(Math.random()*(incorrect.length+1));
    incorrect.splice(randomIndex ,0 ,correct)
    addAnswers(incorrect);
}
function addAnswers(array){
    answers.innerHTML = "";
for(let i=0;i<array.length;i++){
        let div = document.createElement("div");
        div.className = "answer";
        let radioInput = document.createElement("input");
        radioInput.type = "radio"
        radioInput.name = "question";
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = array[i];
        //create The label
        let theLabel = document.createElement("label");
        theLabel.htmlFor = `answer_${i}`;
        theLabel.innerHTML = array[i];
        div.appendChild(radioInput)
        div.appendChild(theLabel)
        answers.appendChild(div);
    }
    
}
function checkedAnswer(correct){
    let chosenAnswer = "";
    for(let i=0;i<radioInputs.length;i++){
        if(radioInputs[i].checked){
            chosenAnswer = radioInputs[i].dataset.answer;
           if(correct == chosenAnswer){
            points++;
           }
        }
    }
}
function showResult(){
    if(points<3){
        let finish = document.querySelector(".finish");
        finish.classList.add("bad");
        finish.innerHTML = `Your <span>Result is </span><span class="result">${points}</span> out of 10`
    }else if(points<7){
        let finish = document.querySelector(".finish");
        finish.classList.add("medium");
        finish.innerHTML = `Your <span>Result is </span><span class="result">${points}</span> out of 10`
    }else{
        let finish = document.querySelector(".finish");
        finish.classList.add("good");
        finish.innerHTML = `Your <span>Result is </span><span class="result">${points}</span> out of 10` 
    }
}

let countDownTime =2*60;

function updateTimer(){
    const minutes = Math.floor(countDownTime/60);
    const seconds = countDownTime%60;
    timer.textContent = `${minutes}:${seconds < 10? "0":""}${seconds}`
}
let countDownInterval;
function countDown(){
      countDownInterval = setInterval(()=>{
        if(countDownTime>0){
            countDownTime--;
            updateTimer();
        }else{
            clearInterval(countDownInterval);
            button.remove();
            prog.remove();
            question.remove();
            answers.remove();
            showResult();
        }
     },1000)
}