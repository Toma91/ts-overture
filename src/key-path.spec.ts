import { get, KeyPath, set } from './key-path'

describe('Basic Key Path', () => {
  type AreEqual<Actual, Expected> = Actual extends Expected
    ? Expected extends Actual
      ? true
      : { diff1: Exclude<Expected, Actual>; a: Actual; e: Expected }
    : { diff2: Exclude<Actual, Expected>; a: Actual; e: Expected }

  const keyPathHelpers = {
    expect: function <Actual> (value: Actual) {
      return {
        toBe: function <Expected> (): AreEqual<Actual, Expected> {
          return value as any
        },
      }
    },
  }

  it('should be read & write', () => {
    interface Pet {
      age: number
      name: string
    }

    interface User {
      name: string
      pet: Pet
    }

    const user: User = {
      name: 'Username',
      pet: {
        age: 3,
        name: 'Fuffi',
      },
    }

    const kpUser = KeyPath<User>()
    const kpUserName = KeyPath<User>().name
    const kpUserPet = KeyPath<User>().pet
    const kpUserPetAge = KeyPath<User>().pet.age
    const kpUserPetName = KeyPath<User>().pet.name

    expect(kpUser[get](user)).toEqual({
      name: 'Username',
      pet: {
        age: 3,
        name: 'Fuffi',
      },
    })

    expect(kpUserName[get](user)).toBe('Username')

    expect(kpUserPet[get](user)).toEqual({
      age: 3,
      name: 'Fuffi',
    })

    expect(kpUserPetAge[get](user)).toBe(3)
    expect(kpUserPetName[get](user)).toBe('Fuffi')

    kpUserPetName[set](user, 'Kitty')
    expect(kpUserPetName[get](user)).toBe('Kitty')

    kpUserPetAge[set](user, 5)
    expect(kpUserPetAge[get](user)).toBe(5)

    kpUserPet[set](user, { age: 7, name: 'Kleos' })
    expect(kpUserPet[get](user)).toEqual({ age: 7, name: 'Kleos' })

    kpUserName[set](user, 'New user')
    expect(kpUserName[get](user)).toBe('New user')

    expect(user).toEqual({
      name: 'New user',
      pet: {
        age: 7,
        name: 'Kleos',
      },
    })

    kpUser[set](user, {
      name: 'User 2',
      pet: {
        age: 2,
        name: 'Titti',
      },
    })

    expect(user).toEqual({
      name: 'User 2',
      pet: {
        age: 2,
        name: 'Titti',
      },
    })

    expect(kpUser[get](user)).toEqual({
      name: 'User 2',
      pet: {
        age: 2,
        name: 'Titti',
      },
    })
  })

  it('should test arrays read & write', () => {
    interface Pet {
      name: string
    }

    interface User {
      pets: Pet[]
    }

    const user: User = {
      pets: [
        { name: 'Fuffi' },
        { name: 'Titti' },
        { name: 'Kleos' },
      ],
    }

    const kpUserPets = KeyPath<User>().pets
    const kpUserPets0 = KeyPath<User>().pets[0]
    const kpUserPets1 = KeyPath<User>().pets[1]
    const kpUserPets2 = KeyPath<User>().pets[2]
    const kpUserPets3 = KeyPath<User>().pets[3]

    expect(kpUserPets[get](user)).toEqual([
      { name: 'Fuffi' },
      { name: 'Titti' },
      { name: 'Kleos' },
    ])

    expect(kpUserPets0[get](user)).toEqual({ name: 'Fuffi' })
    expect(kpUserPets1[get](user)).toEqual({ name: 'Titti' })
    expect(kpUserPets2[get](user)).toEqual({ name: 'Kleos' })
    expect(kpUserPets3[get](user)).toBeUndefined()

    kpUserPets0[set](user, { name: 'Pet 0' })
    expect(kpUserPets0[get](user)).toEqual({ name: 'Pet 0' })
    expect(user.pets[0]).toEqual({ name: 'Pet 0' })

    kpUserPets1[set](user, { name: 'Pet 1' })
    expect(kpUserPets1[get](user)).toEqual({ name: 'Pet 1' })
    expect(user.pets[1]).toEqual({ name: 'Pet 1' })

    kpUserPets2[set](user, { name: 'Pet 2' })
    expect(kpUserPets2[get](user)).toEqual({ name: 'Pet 2' })
    expect(user.pets[2]).toEqual({ name: 'Pet 2' })

    kpUserPets[set](user, [{ name: 'Rico' }])
    expect(kpUserPets[get](user)).toEqual([{ name: 'Rico' }])
    expect(user.pets).toEqual([{ name: 'Rico' }])
  })

  it('should be read-only', () => {
    interface User {
      readonly name: string
    }

    expect(keyPathHelpers.expect(KeyPath<User>().name).toBe<KeyPath<User, string>>()).toBe(true)
  })
})
