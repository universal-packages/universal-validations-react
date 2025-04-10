import { BaseValidation, Validator } from '@universal-packages/validations'
import React from 'react'

import { useValidation } from '../src'

class TestValidation extends BaseValidation {
  @Validator('name')
  public nameIsDavid(name: string, initialName: string): boolean {
    if (initialName === name) return true
    return name === 'David'
  }

  @Validator('name', { schema: 'admin' })
  public nameIsAdmin(name: string): boolean {
    return name === 'Admin'
  }
}

export default function TestApp(): React.ReactElement {
  const [name, setName] = React.useState('omar')
  const [schema, setSchema] = React.useState<string | string[] | undefined>(undefined)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const validation = useValidation({ name }, TestValidation, schema)

  const handleSubmit = () => {
    if (validation.isValid) {
      setShowSuccess(true)
    } else {
      validation.setShowErrors(true)
    }
  }

  const handleReset = () => {
    setName('omar')
    setSchema(undefined)
    setShowSuccess(false)
    validation.reset({ name: 'omar' })
  }

  const handleSetKnownErrors = () => {
    validation.setShowErrors(true)
    validation.setKnownErrors({ other: ['Extra errors'] })
  }

  const handleSetAdminSchema = () => {
    setSchema('admin')
  }

  return (
    <div>
      <h1>Test Component</h1>
      <label htmlFor="name">Name</label>
      <input data-testid="name-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleSubmit} data-testid="submit">
        Submit
      </button>
      <button onClick={handleReset} data-testid="reset">
        Reset
      </button>
      <button onClick={handleSetKnownErrors} data-testid="set-known-errors">
        Extra errors
      </button>
      <button onClick={handleSetAdminSchema} data-testid="set-admin-schema">
        Use Admin Schema
      </button>
      {schema && <p data-testid="schema">Using schema: {JSON.stringify(schema)}</p>}
      {showSuccess && <p data-testid="success">Success</p>}
      {validation.showErrors && validation.isInvalid && <p data-testid="errors">Errors: {JSON.stringify(validation.errors)}</p>}
      <p data-testid="changed">{JSON.stringify(validation.changedAttributes)}</p>
    </div>
  )
}
