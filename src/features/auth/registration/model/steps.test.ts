import { getRegistrationStepIndex } from './steps'

describe('getRegistrationStepIndex', () => {
  it.each([
    ['/register/account', 0],
    ['/register/account/', 0],
    ['/register/user/', 1],
    ['/rigister/user/', 1],
    ['/register/skill///', 2],
    ['/REGISTER/USER', 1],
    ['/register', -1],
    ['/unknown', -1],
  ])('%s -> %i', (pathname, expected) => {
    expect(getRegistrationStepIndex(pathname)).toBe(expected)
  })
})
