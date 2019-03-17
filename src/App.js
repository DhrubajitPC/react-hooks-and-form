import React, { Component, useState, useEffect, useRef } from 'react';
import './App.css';

function Form(props) {
  const { validate } = props;
  const [errors, setErrors] = useState({})
  const formRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault()
    const formItems = Array.from(formRef.current.querySelectorAll('[data-input ="true"]'))
    const formData = formItems.map(item => ({name: item.name, value: item.value}))
    const validationReport = validate(formData);

    const errors = {};
    validationReport.errors.forEach(item => errors[item.name] = item.error)
    setErrors(errors)

    e.formData = formData
    e.validationReport = validationReport
    props.onSubmit(e)
  }

  return (
    <form className='Form' ref={formRef} onSubmit={handleSubmit}>
      {React.Children.map(props.children, child => 
        React.cloneElement(child, {errorMessage: errors[child.props.name]})
      )}
    </form>
  )
}

function TextInput(props) {
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  function handleChange(e) {
    setValue(e.target.value)
  }

  return (
    <>
      <label htmlFor={props.id}>{props.label || props.name}</label>
      <input data-input name={props.name} onChange={handleChange} value={value}/>
      {props.errorMessage && <p style={{color: 'red'}}>{props.errorMessage}</p>}
    </>
  )
}

function RadioGroup(props) {
  const { defaultValue, name, errorMessage } = props;
  const divRef = useRef(null);
  const [checked, setChecked] = useState(defaultValue);
  const [value, setValue] = useState(defaultValue);

  function handleChange (e, onChange) {
    setChecked(e.target.id)
    setValue(e.target.value)
    onChange && onChange(e) 
  }

  useEffect(() => {divRef.current.name = name}, [])
  useEffect(() => {
    divRef.current.value = value
  }, [value])

  return(
    <div data-input ref={divRef}>
      {React.Children.map(props.children, child => {
          return React.cloneElement(child, { onChange: e => handleChange(e, child.props.onChange), checked: checked === child.props.value })
        }
      )}
      {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}

    </div>
  )
}

function Radio(props) {
  const { name, id, value, label, onChange, checked } = props

  function handleChange(e) {
    onChange(e)
  }

  return(
    <>
      <input type="radio" id={id} name={name} value={value} onChange={handleChange} checked={checked} />
      <label htmlFor={id}>{label}</label>
    </>
  )
}

function validate(formData) {
  const errors = [];
  const errorItems = [];
  const errorMessages = [];
  formData.forEach(item => {
    if(!item.value) {
      errorItems.push(item.name);
      errorMessages.push(`${item.name} is a required field`)
    }
  })
  const textInput = formData.filter(item => item.name === 'text-input')[0]
  const radio = formData.filter(item => item.name === 'radio')[0]

  if(textInput.value === radio.value) {
    if(errorItems.includes('text-input')) {
      errorMessages[errorItems.indexOf('text-input')] = 'cannot be same as radio';
    } else {
      errorItems.push('text-input');
      errorMessages.push('cannot be same as radio');
    }
    if(errorItems.includes('radio')) {
      errorMessages[errorItems.indexOf('radio')] = 'cannot be same as text input 1';
    } else {
      errorItems.push('radio');
      errorMessages.push('cannot be same as text input 1')
    }
  }
  errorItems.forEach((item, index) => errors.push({name: item, error: errorMessages[index]}));
  return {isValid: errors.length === 0, errors}
}

class App extends Component {
  state={
    formData: [],
    validationReport: []
  }
  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      formData: e.formData,
      validationReport: e.validationReport
    })
  }
  
  render() {
    return (
      <div className="App">
        <Form onSubmit={this.handleSubmit} validate={validate}>
          <TextInput label="this is input 1" name="text-input" id='text-input' value="alphabet" />
          <TextInput label="this is input 2" name="text-input2" id='text-input2' value="beta" />
          <RadioGroup name="radio" defaultValue ="one">
            <Radio onChange={ e =>console.log('line 99 ', e)} name="one" id="one" label="One" value="one"/>
            <Radio name="one" id="two" label="Two" value="two"/>
            <Radio name="one" id="three" label="Three" value="three"/>
          </RadioGroup>
          <button type="submit">Submit</button>
        </Form> 

        <div style={{textAlign: 'left', background: 'gray'}}>
          <p>Form values</p>
          <pre>
            <code>{JSON.stringify(this.state.formData,null, 2)}</code>
            <code>{JSON.stringify(this.state.validationReport, null, 2)}</code>
          </pre>
        </div>
        
      </div>
    );
  }
}

export default App;
