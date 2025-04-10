# Validations React

[![npm version](https://badge.fury.io/js/@universal-packages%2Fvalidations-react.svg)](https://www.npmjs.com/package/@universal-packages/validations-react)
[![Testing](https://github.com/universal-packages/universal-validations-react/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-validations-react/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-validations-react/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-validations-react)

React bindings for [Universal Validations](https://github.com/universal-packages/universal-validations), to use validations also in React applications.

## Install

```shell
npm install @universal-packages/validations-react
```

> Validations react uses exclusively teh react hooks API so make sure you are using a recent version of React.

## Hooks

#### **`useValidation(attributes: Object, Validation: ValidationClass, schema?: string | string[])`**

It validates the attributes every time they change, and returns the validation result. The values when first called the hook will be considered as the initial values.

The optional `schema` parameter allows you to specify which validation schema to use. This corresponds to the schema option in the Validator decorator.

```jsx
import { useValidation } from '@universal-packages/validations-react'

import FormValidation from './FormValidation'

const HappyComponent = () => {
  const [name, setName] = useState('david')
  const validation = useValidation({ name }, FormValidation)

  const handleSubmit = () => {
    if (validation.isValid) {
      api.post('/users', { name }).then((data) => {
        if (data.status === 'success') {
          console.log('User created')
        } else {
          // Now we know the backend does not like the current name value so wer do not admit it again
          // In other words we do not send the same request again
          validation.setKnownErrors({ name: [data.validation.errors.name] })
        }
      })
    } else {
      validation.setShowErrors(true)
    }
  }

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
      {!validation.isValid && validation.showErrors && (
        <div>
          {validation.errors.name.map((error) => (
            <span>{error}</span>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Using Schemas

```jsx
import { useValidation } from '@universal-packages/validations-react'
import UserValidation from './UserValidation'

const EditUserForm = () => {
  const [userData, setUserData] = useState({ email: 'user@example.com', name: 'John' })
  // Use the 'update' schema for validations specific to updating a user
  const validation = useValidation(userData, UserValidation, 'update')
  
  // Rest of component...
}
```

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
