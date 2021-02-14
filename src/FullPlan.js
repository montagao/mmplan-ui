import React  from 'react';
import { create, all }  from 'mathjs';
const util = require('util')

const config = { }
const math = create(all, config)

class FullPlan extends React.Component {

  constructor(props) {
    console.log(props)
    super(props)
    this.state = {
      list2: !!props.list2 ? JSON.parse(props.list2) : {},
      name2: props.name2,
      planSubmitted: !!props.list2,
    }
  }

  renderOptions() {
    var data = this.props
    console.log(this.state)
    console.log(data)
    console.log(data.list1)

    const handleValue = event => {
      this.setState({
        list2: {
          ...this.state.list2,
          [event.target.name]: {
            "value": event.target.value,
          },
        },

      })
    }

    if (this.props.isComplete === false){
      let list = JSON.parse(data.list1)
      console.log(list)
          return (
            <div>
             Enter your rating for the options:
            <ul style={{"listStyleType": "none", "padding": "0"}}>
           {Object.entries(list).map(([key, entry]) => (
             <li key={key}><input name={key} value={entry.name} readOnly={true} /><input name={key} onChange={handleValue} placeholder="value from 0-10"/> </li>
           ))}
          </ul>
        </div>)
    } else {
      let list1 = JSON.parse(data.list1)
      console.log(list1)
      let list2 = Object.keys(this.props.list2).length === 0 ? JSON.parse(this.state.list2) : JSON.parse(this.props.list2)
      console.log(list2)

      let list1scores = []
      // calculate the zscore of each, and then calculate the sum of z-scores
      Object.entries(list1).map(([key, entry]) => (
        list1scores.push(parseInt(entry.value))
      ))

      let list2scores = []
      // calculate the zscore of each, and then calculate the sum of z-scores
      Object.entries(list2).map(([key, entry]) => (
        list2scores.push(parseInt(entry.value))
      ))


      let list1sd = math.std(list1scores)
      let list1mean = math.mean(list1scores)
      let list1zscores = list1scores.map( (score, i) => {
        return  (score - list1mean)/ list1sd
      })
      let list2sd = math.std(list2scores)
      let list2mean = math.mean(list2scores)
      let list2zscores = list2scores.map( (score, i) => {
        return  (score - list2mean)/ list2sd
      })

      let sumzscores = list2zscores.map( (score, i) => {
        return  score + list1zscores[i]
      })

      console.log(list1scores)
      console.log(list1zscores)
      console.log(list2zscores)
      console.log(sumzscores)
      let maxIndex = indexOfMax(sumzscores)
      return (
            <div>
             Planning already complete! Full Results Below:
            <ul style={{"listStyleType": "none", "padding": "0"}}>
            <div style={{"display": "inline-block"}}>
             <li key="options"><input style={{border: 0}} name="options" value="Options" readOnly={true} /> </li>
           {Object.entries(list1).map(([key, entry]) => (
             <li key={key}><input name={key} value={entry.name} readOnly={true} /> </li>
           ))}
           </div>
            <div style={{"display": "inline-block"}}>
             <li key="options"><input style={{border: 0}} name="options" value={this.props.name1 +  '\'s score'} readOnly={true} /> </li>
           {Object.entries(list1).map(([key, entry]) => (
             <li key={key}><input name={key} onChange={handleValue} value={entry.value}/> </li>
           ))}
           </div>
            <div style={{"display": "inline-block"}}>
             <li key="options"><input name="options" style={{border: 0}}  value={this.props.name2 + '\'s score'} readOnly={true} /> </li>
           {Object.entries(list2).map(([key, entry]) => (
             <li key={key}><input name={key} onChange={handleValue} value={entry.value}/> </li>
           ))}
           </div>
            <div style={{"display": "inline-block"}}>
             <li key="options"><input name="options" style={{border: 0}}  value="Sum of Z-scores" readOnly={true} /> </li>
           {sumzscores.map((entry, key) => (
             <li key={key}><input input="number" style={
                key === maxIndex ? {fontWeight: 'bold'} :{fontWeight: 'normal'}}
               step='0.01' name={key} onChange={handleValue} value={entry}/> </li>
           ))}
           </div>
          </ul>
        </div>
      )
    }
  }



  render() {
    const handleSubmit = event => {
      event.preventDefault();

      var rBody = {
        id: this.props.id,
        isComplete: true,
        planName: this.props.planName,
        list1:this.props.list1,
        list2:JSON.stringify(this.state.list2),
        name1:this.props.name1,
        name2:this.state.name2,
        timestamp: Date.now().toString(),
      }

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

      this.setState({planSubmitted: true})

   }

    const onChangeName  = event => {
      this.setState({name2:event.target.value})
    }

    const opts = this.renderOptions()
    return (
      <div>
      {!!!this.props.name2 &&
        <div>
      Your name: <input name="name2" onChange={onChangeName} placeholder="Your name here"/>
        </div>
      }
      <br/>
      For plan:  <strong>{this.props.planName}</strong>
      <br/>
      Planning With: <strong>{this.props.name1}</strong>


      {opts}
       <button onClick={handleSubmit} type="button">Submit your vote!</button>
      <br/>
      </div>
    )
  }
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

export default FullPlan;

