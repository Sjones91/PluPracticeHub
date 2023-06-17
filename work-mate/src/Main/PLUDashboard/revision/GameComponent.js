import React, { useEffect, useState } from 'react'
import GameItem from "./GameItem.js"
function GameComponent(props,producePlus) {
    //game Logic Use States
    const [start,setStart] = useState(true)
    const [next,setNext] = useState(false)
    const [gameReady,setGameReady] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const [result,setResult] = useState("");
    //Game data states
    const [pluList,setPluList] = useState(props.producePlus)
    const [flashItem,setFlashItem]= useState(null);
    const [answers,setAnswers] = useState([]);

    //generate a random number
    const randomNumber= (value)=> {
        let randomPlu = Math.floor(Math.random() * value.length);
        return randomPlu
    }
    //shuffle an array
    const shuffleArray = (array) => {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
        };
        //grab a new game item
    const grabGameItem =() => {
        let items = pluList
        //grab all the plus from the list
        let answerList = []
        for(let i = 0; i <items.length; i++) {
            answerList.push(pluList[i].Plu)
        }
        let answerFlash; 
        //set a temp array of 3 answers
        let answerTemp = []
        const randomIndex = randomNumber(pluList)
        //set the actual test item
        answerFlash = pluList[randomIndex]
        answerTemp.push(answerFlash.Plu)
        setFlashItem(answerTemp)
        //filter out the answer list of the correct answer.
        answerList = answerList.filter((item) => item !== answerTemp[0]);
        //get a second answer for the array
        answerTemp.push(answerList[randomNumber(answerList)])
        answerList = answerList.filter((item) => item !== answerTemp[1]);
        answerTemp.push(answerList[randomNumber(answerList)])
        let shuffledAnswers = shuffleArray(answerTemp)
        //push the answers and test item to use state
        setAnswers(shuffledAnswers);
        setFlashItem(answerFlash)
    }
    //next click handler
    const nextClick = ()=> {
        setResult("");
        grabGameItem()
        setNext(false)
    }
    useEffect(()=>{
        grabGameItem()
    },[])
    useEffect(()=> {
        setGameReady(true)
    },[flashItem])
    return (
    <div className='d-f-col'>
        {start ? <h1 className='startButton' onClick={()=> {setStart(false); setTrigger(!trigger)}}> Start</h1> : 
        <div>
            <section>
                {gameReady ? <GameItem flashItem={flashItem} setFlashItem={setFlashItem}/> : null}
            </section>
            {result === ""? null: result ? <p className='answerCorrect'>Correct! {flashItem.Name} is {flashItem.Plu}</p> : <p className='answerWrong'>Incorrect, {flashItem.Name} is {flashItem.Plu}</p>}
            <section className='d-f-row answerList'>
            {answers.map((answer)=> {
                let trueAnswer = answer;
                const clickHandler = (e)=> {
                    console.log("flash item plu", flashItem.Plu)
                    console.log(trueAnswer)
                    if (trueAnswer === flashItem.Plu) {
                        setResult(true)
                        setNext(true);
                    } else if(trueAnswer !== flashItem.Plu) {
                        setResult(false)
                        setNext(true);
                    }
                }
                return (
                    <h1 className= "answer"
                    value={answer} 
                    onClick={(e)=> clickHandler(e)}
                    >{answer}</h1>
                )
            })}
            </section>
            {next ? <h1 className='nextButton' onClick={()=> nextClick()}>Next</h1>: null}
        </div>
        }
    </div>
  )
}

export default GameComponent