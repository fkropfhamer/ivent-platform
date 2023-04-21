interface PasswordValidationErrors {
  hasErrors: boolean
  length: string | null
  specialCharCount: string | null
  numberCount: string | null
}

export const validatePassword = (password: string): PasswordValidationErrors => {
  const errors: PasswordValidationErrors = {
    hasErrors: false,
    length: null,
    specialCharCount: null,
    numberCount: null
  }

  if (password.length < 12) {
    errors.length = 'password has to be atleast 12 characters long'
  }

  const { numberCount, specialCharCount } = [...password].reduce((p, c) => {
    if (isNumber(c)) {
      return { ...p, numberCount: p.numberCount + 1 }
    }

    if (isSpecial(c)) {
      return { ...p, specialCharCount: p.specialCharCount + 1 }
    }

    return p
  }, { numberCount: 0, specialCharCount: 0 })

  if (numberCount < 1) {
    errors.numberCount = 'password has to contain atleast 1 number'
  }

  if (specialCharCount < 1) {
    errors.specialCharCount = 'password has to contain atleast 1 special character'
  }

  errors.hasErrors = errors.specialCharCount !== null || errors.length !== null || errors.numberCount !== null

  return errors
}

const isSpecial = (char: string): boolean => {
  return !/^[^a-zA-Z0-9]+$/.test(char)
}

const isNumber = (char: string): boolean => {
  return char >= '0' && char <= '9'
}
