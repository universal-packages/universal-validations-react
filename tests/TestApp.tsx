import { BaseValidation, Validator } from '@universal-packages/validations'
import React from 'react'

import { useValidation } from '../src'

class TestValidation extends BaseValidation {
  @Validator('name')
  public nameIsDavid(name: string, initialName: string): boolean {
    if (initialName === name) return true
    return name === 'David'
  }
}

export default function TestApp(): React.ReactElement {
  const [name, setName] = React.useState('omar')
  const [showSuccess, setShowSuccess] = React.useState(false)
  const validation = useValidation({ name }, TestValidation)

  const handleSubmit = () => {
    if (validation.isValid) {
      setShowSuccess(true)
    } else {
      validation.setShowErrors(true)
    }
  }

  return (
    <div>
      <h1>Test Component</h1>
      <label htmlFor="name">Name</label>
      <input data-testid="name-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleSubmit} data-testid="submit">
        Submit
      </button>
      {showSuccess && <p data-testid="success">Success</p>}
      {validation.showErrors && !validation.isValid && <p data-testid="errors">Errors: {JSON.stringify(validation.errors)}</p>}
      <p data-testid="changed">{JSON.stringify(validation.changedAttributes)}</p>
    </div>
  )
}
