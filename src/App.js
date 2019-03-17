import React, { Component, useState, useEffect, useRef } from 'react';
import './App.css';

function Form(props) {
  const formRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault()
    const formItems = Array.from(formRef.current.querySelectorAll('[data-input ="true"]'))
    console.log('form items ', formItems)
    const formData = formItems.map(item => ({name: item.name, value: item.value}))
    e.formData = formData
    props.onSubmit(e)
  }

  return (
    <form className='Form' ref={formRef} onSubmit={handleSubmit}>
      {props.children}
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
      <input {...props} data-input onChange={handleChange} value={value}/>
    </>
  )
}

function RadioGroup(props) {
  const { defaultChecked, name } = props;
  const divRef = useRef(null);
  const [checked, setChecked] = useState(defaultChecked);
  const [value, setValue] = useState(null)

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
        if(child.props.id === defaultChecked && value !== child.props.value) setValue(child.props.value)
        return React.cloneElement(child, { onChange: e => handleChange(e, child.props.onChange), checked: checked === child.props.id})
      }
      )}
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

class App extends Component {
  handleSubmit = e => {
    console.log(e.formData)
  }
  
  render() {
    return (
      <div className="App">
        <Form onSubmit={this.handleSubmit}>
          <TextInput label="this is input 1" name="text-input" id='text-input' value="alphabet" />
          <TextInput label="this is input 2" name="text-input2" id='text-input2' value="beta" />
          <RadioGroup name="radio" defaultChecked="one">
            <Radio onChange={ e =>console.log('line 99 ', e)} name="one" id="one" label="One" value="one"/>
            <Radio name="one" id="two" label="Two" value="two"/>
            <Radio name="one" id="three" label="Three" value="three"/>
          </RadioGroup>
          <button type="submit">Submit</button>
        </Form> 
        
      </div>
    );
  }
}

export default App;
