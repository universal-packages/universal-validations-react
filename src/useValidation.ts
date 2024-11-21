import { BaseValidation } from '@universal-packages/validations'
import React from 'react'

interface UseValidationResult {
  errors: Record<string, string[]>
  isValid: boolean
  isInvalid: boolean
  showErrors: boolean
  setShowErrors: (showErrors: boolean) => void
  setKnownErrors: (knownErrors: Record<string, string[]>) => void
}

export function useValidation(attributes: Record<string, any>, Validation: typeof BaseValidation): UseValidationResult {
  const [errors, setErrors] = React.useState<Record<string, string[]>>({})
  const [showErrors, setShowErrors] = React.useState(false)
  const [knownErrors, setKnownErrors] = React.useState<Record<string, string[]>>({})
  const [knownErrorsMatches, setKnownErrorsMatches] = React.useState<Record<string, any>>({})
  const validationInstance = React.useMemo(() => new Validation(attributes), [Validation])

  React.useEffect(() => {
    const knownErrorKeys = Object.keys(knownErrors)
    const knownErrorsMatchesProspects: Record<string, any> = {}

    for (const key of knownErrorKeys) {
      knownErrorsMatchesProspects[key] = attributes[key]
    }

    setKnownErrorsMatches(knownErrorsMatchesProspects)
  }, [...Object.values(attributes), knownErrors])

  React.useEffect(() => {
    validationInstance.validate(attributes).then(({ errors }) => {
      const knownErrorKeys = Object.keys(knownErrors)

      for (const key of knownErrorKeys) {
        if (theyAreTheSame(knownErrorsMatches[key], attributes[key])) {
          if (errors[key]) {
            errors[key] = [...errors[key], ...knownErrors[key]].filter((value, index, array) => {
              return array.indexOf(value) === index
            })
          } else {
            errors[key] = knownErrors[key]
          }
        }
      }

      setErrors(errors)
    })
  }, [...Object.values(attributes), knownErrors, knownErrorsMatches, validationInstance])

  const isValid = !Object.keys(errors).length
  const isInvalid = !isValid

  return { errors, isValid: !Object.keys(errors).length, isInvalid, showErrors, setShowErrors, setKnownErrors }
}

function theyAreTheSame(a: any, b: any) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((value, index) => value === b[index])
  } else {
    return a === b
  }
}
