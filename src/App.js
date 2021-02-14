import kittay from './kittay.jpg'
import React, { useReducer, useState } from 'react';
import './App.css';
import FullPlan from './FullPlan.js'
const util = require('util')

// TODO:
// * form validaiton


const initialPlanState = {
  name: "",
  plan: "",
  options: {},
}

const formReducer = (state, event) => {
  console.log(JSON.stringify(state))
  if (event.type === "option") {
    let options = Object.assign({}, state.options)
    if (options[event.name] === undefined) {
      options[event.name] = {}
    }
    if (event.isvalue === "true") {
      console.log("found value")
      options[event.name].value = event.value
    } else {
      options[event.name].name = event.value
    }

    return {
     ...state,
      options
    }
  }
  return {
   ...state,
   [event.name]: event.value
  }
}

function App() {
  const [formData, setFormData] = useReducer(formReducer, initialPlanState);
  const [submitting, setSubmitting] = useState(false)
  const [planId, setPlanId] = useState(Date.now())

  const handleSubmit = event => {
    console.log(JSON.stringify(formData))
    event.preventDefault();

    var rBody = {
      id: planId,
      isComplete: false,
      planName: formData.plan,
      list1: JSON.stringify(formData.options),
      list2: "",
      name1: formData.name,
      name2: "",
      timestamp: Date.now().toString(),
    }
     // generate new planId
    setPlanId(Date.now())

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rBody),
    };

    console.log("sending" + util.inspect(requestOptions))
    fetch('http://mmyf.ca/api/v1/plan/',  requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data)
        });

   setSubmitting(true);
 }

  const handleChange = event => {
    setFormData({
      name: event.target.name,
      value: event.target.value,
    });
  }

  const handleChangeOption = event => {
    console.log("handle change opt!", event)
    setFormData({
      name: event.target.name,
      value: event.target.value,
      type: "option",
      isvalue: event.target.attributes.isvalue !== undefined ? "true" : false
    });
  }

  const buildOptions = numOptions => {
    let optForms = []
    for (let i = 0 ; i < numOptions; i++) {
      optForms[i] = (
        <li key={i}>  <input name={i} placeholder={"Option "+i} onChange={handleChangeOption}/> <input isvalue="true" name={i} placeholder="Score from 1-10" onChange={handleChangeOption}/> </li>
      )
    }
    return optForms
  }


  let fullPlanLoaded = false

  const handleGetPlan = () => {
    var xhr = new XMLHttpRequest()

    xhr.addEventListener('load', () => {
      console.log(xhr.responseText)
    })
    fullPlanLoaded = true
    xhr.open('GET', 'http://mmyf.ca/api/v1/plan/' + formData.joinId)
    xhr.send()
  }



  return (
    <div className="wrapper">
      <img src={kittay} alt="" width="80px"/>
      <h1>Mmyf</h1>
      {submitting &&
       <div>
         You are submitting the following:
          <ul style={{"listStyleType": "none", "padding": "0"}}>
            <li>planId: {planId} </li>
           {Object.entries(formData).map(([name, value]) => (
             <li key={name}><strong>{name}</strong>:{util.inspect(value)}</li>
           ))}
         </ul>
        </div>
       }
      <p>
      Join an Existing Plan?
      </p>
    { fullPlanLoaded &&
      <FullPlan props={formData}></FullPlan>
    }
      <form>
        <fieldset>
         <input name="joinId" placeholder="plan id" onChange={handleChange}/>

         <button type="button" onClick={handleGetPlan} >Join a Plan!</button>
        </fieldset>
      </form>

      <form onSubmit={handleSubmit}>
      <fieldset>
         <label>
           <p>Your Name</p>
           <input name="name" placeholder="Are you MontaMonta or Yifei?"size="50" onChange={handleChange}/>
           <p>Plan Name</p>
           <input name="plan" placeholder="Let's go exploring!" size="50" onChange={handleChange}/>
           <p>Options</p>
	  <ul style={{"listStyleType": "none"}}>
	    {buildOptions(10)}
	      </ul>
         </label>
       <button type="button" onClick={handleSubmit}>Make a New Plan!</button>
       </fieldset>
      </form>
    </div>
  );
}




export default App;
