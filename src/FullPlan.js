import React  from 'react';

class FullPlan extends React.Component {

  constructor(props) {
    super(props)
  }

  renderOptions() {
    var data = this.props.data
    return <h1> {data.name} </h1>
  }


  render() {
    var opts = this.renderOptions()
    return (
      {opts}
    )
  }
}

export default FullPlan;
