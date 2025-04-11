import { BaseValidation } from '@universal-packages/validations'
import React from 'react'

import { UseValidationReturn, ValidationErrors } from './types'

export function useValidation<A extends Record<string, any>>(attributes: Partial<A>, ValidationClass: typeof BaseValidation, schema?: string | string[]): UseValidationReturn<A> {
  const [errors, setErrors] = React.useState<ValidationErrors<A>>({})
  const [showErrors, setShowErrors] = React.useState(false)
  const [knownErrors, setKnownErrors] = React.useState<ValidationErrors<A>>({})
  const [knownErrorsMatches, setKnownErrorsMatches] = React.useState<Partial<A>>({})
  const [extraErrorsMatches, setExtraErrorsMatches] = React.useState<Record<string, Partial<A>>>({})
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
      if (attributes[key] !== undefined) {
        knownErrorsMatchesProspects[key] = attributes[key]
      }
    }

    setKnownErrorsMatches(knownErrorsMatchesProspects)
  }, [knownErrors])

  React.useEffect(() => {
    const knownErrorKeys = Object.keys(knownErrors) as (keyof A)[]
    const extraErrorsMatchesProspects: Record<string, Partial<A>> = {}

    for (const key of knownErrorKeys) {
      if (attributes[key] === undefined) {
        extraErrorsMatchesProspects[key as string] = { ...attributes }
      }
    }

    setExtraErrorsMatches(extraErrorsMatchesProspects)
  }, [knownErrors])

  React.useEffect(() => {
    validationInstance.validate(attributes, schema).then((validationResult) => {
      const validationErrors = validationResult.errors as ValidationErrors<A>
      const knownErrorKeys = Object.keys(knownErrors) as (keyof A)[]

      for (const key of knownErrorKeys) {
        if (knownErrorsMatches[key]) {
          if (theyAreTheSame(knownErrorsMatches[key], attributes[key])) {
            if (validationErrors[key]) {
              validationErrors[key] = [...validationErrors[key], ...knownErrors[key]].filter((value, index, array) => {
                return array.indexOf(value) === index
              }) as any
            } else {
              validationErrors[key] = knownErrors[key]
            }
          }
        } else if (extraErrorsMatches[key as string]) {
          if (theyAreTheSame(extraErrorsMatches[key as string], attributes)) {
            validationErrors[key] = [...knownErrors[key]].filter((value, index, array) => {
              return array.indexOf(value) === index
            }) as any
          }
        }
      }

      setErrors(validationErrors)
    })
  }, [...Object.values(attributes), knownErrors, knownErrorsMatches, validationInstance, extraErrorsMatches, schema])

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
  } else if (typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a) === JSON.stringify(b)
  } else {
    return a === b
  }
}
