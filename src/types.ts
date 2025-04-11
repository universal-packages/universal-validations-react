export type ValidationErrors<A> = {
  [K in keyof A]?: string[]
} & {
  [key: string]: string[]
}

export interface UseValidationReturn<A> {
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
