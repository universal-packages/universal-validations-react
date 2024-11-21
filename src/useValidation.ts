import { BaseValidation } from '@universal-packages/validations'
import React from 'react'

type ValidationErrors<A> = {
  [K in keyof A]?: string[]
} & {
  [key: string]: string[]
}

interface UseValidationReturn<A> {
  changedAttributes: Partial<A>
  thereAreChanges: boolean
  errors: ValidationErrors<A>
  isValid: boolean
  isInvalid: boolean
  showErrors: boolean
  setShowErrors: React.Dispatch<React.SetStateAction<boolean>>
  setKnownErrors: React.Dispatch<React.SetStateAction<ValidationErrors<A>>>
  reset: (newInitialValues: Partial<A>) => void
}

export function useValidation<A extends Record<string, any>>(attributes: Partial<A>, ValidationClass: typeof BaseValidation): UseValidationReturn<A> {
  const [errors, setErrors] = React.useState<ValidationErrors<A>>({})
  const [showErrors, setShowErrors] = React.useState(false)
  const [knownErrors, setKnownErrors] = React.useState<ValidationErrors<A>>({})
  const [knownErrorsMatches, setKnownErrorsMatches] = React.useState<Partial<A>>({})
  const [validationInstance, setValidationInstance] = React.useState(() => new ValidationClass(attributes))

  const reset = (newInitialValues: A) => {
    setValidationInstance(new ValidationClass(newInitialValues))
    setErrors({})
    setShowErrors(false)
    setKnownErrors({})
    setKnownErrorsMatches({})
  }

  React.useEffect(() => {
    const knownErrorKeys = Object.keys(knownErrors) as (keyof A)[]
    const knownErrorsMatchesProspects: Partial<A> = {}

    for (const key of knownErrorKeys) {
      knownErrorsMatchesProspects[key] = attributes[key]
    }

    setKnownErrorsMatches(knownErrorsMatchesProspects)
  }, [...Object.values(attributes), knownErrors])

  React.useEffect(() => {
    validationInstance.validate(attributes).then((validationResult) => {
      const validationErrors = validationResult.errors as ValidationErrors<A>
      const knownErrorKeys = Object.keys(knownErrors) as (keyof A)[]

      for (const key of knownErrorKeys) {
        if (theyAreTheSame(knownErrorsMatches[key], attributes[key])) {
          if (validationErrors[key]) {
            validationErrors[key] = [...validationErrors[key], ...knownErrors[key]].filter((value, index, array) => {
              return array.indexOf(value) === index
            }) as any
          } else {
            validationErrors[key] = knownErrors[key]
          }
        }
      }

      setErrors(validationErrors)
    })
  }, [...Object.values(attributes), knownErrors, knownErrorsMatches, validationInstance])

  const isValid = !Object.keys(errors).length
  const isInvalid = !isValid
  const changedAttributes: Partial<A> = Object.keys(attributes)
    .filter((key) => attributes[key] !== validationInstance.initialValues[key])
    .reduce((obj, key) => {
      obj[key] = attributes[key]
      return obj
    }, {})

  return { changedAttributes, thereAreChanges: !!Object.keys(changedAttributes).length, errors, isValid, isInvalid, showErrors, setShowErrors, setKnownErrors, reset }
}

function theyAreTheSame(a: any, b: any) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((value, index) => value === b[index])
  } else {
    return a === b
  }
}
