import React  from 'react';
const util = require('util')

class FullPlan extends React.Component {

  constructor(props) {
    console.log(props)
    super(props)
    this.state = {
      list2: {},
      name2: {},
    }
  }

  renderOptions() {
    var data = this.props
    console.log(this.state)
    console.log(data)
    console.log(data.list1)
    let list = JSON.parse(data.list1)
    console.log(list)

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
          return (
            <div>
             Enter your rating for the options:
            <ul style={{"listStyleType": "none", "padding": "0"}}>
           {Object.entries(list).map(([key, entry]) => (
             <li key={key}><input name={key} value={entry.name} readOnly={true} /><input name={key} onChange={handleValue} placeholder="value from 0-10"/> </li>
           ))}
          </ul>
        </div>)
    }
    return JSON.stringify(data)
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

   }

    const onChangeName  = event => {
      this.setState({name2:event.target.value})
    }

    const opts = this.renderOptions()
    return (
      <div>
      Your name: <input name="name2" onChange={onChangeName} placeholder="Your name here"/>
      <br/>
      For plan:  <strong>{this.props.planName}</strong>
      <br/>
      Planning With: <strong>{this.props.name1}</strong>


      {opts}
       <button onClick={handleSubmit} type="button">Show plan results!</button>
      <br/>
      </div>
    )
  }
}

export default FullPlan;
