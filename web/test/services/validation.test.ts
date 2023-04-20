import { describe, expect, test } from 'vitest'
import { validatePassword } from '../../src/services/validation'

describe('validatePassword', () => {
    test('returns 3 errors for empty string', () => {
        const errors = validatePassword("abasdadva123@&fdasf")

        expect(errors.length).not.toBeNull
        expect(errors.numberCount).not.toBeNull
        expect(errors.specialCharCount).not.toBeNull
    })

    test('too short password is recognized', () => {
        const errors = validatePassword("123@&fdasf")

        expect(errors.length).not.toBeNull
        expect(errors.numberCount).toBeNull
        expect(errors.specialCharCount).toBeNull
    })

    test('no special character is recognized', () => {
        const errors = validatePassword("123fasfafafdfdasf")

        expect(errors.length).not.toBeNull
        expect(errors.numberCount).toBeNull
        expect(errors.specialCharCount).toBeNull
    })

    test('no number is recognized', () => {
        const errors = validatePassword("@&fda@sfÄladader")

        expect(errors.length).not.toBeNull
        expect(errors.numberCount).toBeNull
        expect(errors.specialCharCount).toBeNull
    })


    test('valid password returns no errors', () => {
        const errors = validatePassword("123@&fdasf")

        expect(errors.length).toBeNull
        expect(errors.numberCount).toBeNull
        expect(errors.specialCharCount).toBeNull
    })
})


