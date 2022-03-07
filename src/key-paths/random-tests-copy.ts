import { get, KeyPath, set, WritableKeyPath } from ".";

type AreEqual<A, E> = A extends E
  ? E extends A
  ? true
  : { diff1: Exclude<E, A>; a: A; e: E }
  : { diff2: Exclude<A, E>; a: A; e: E };

function expect<Actual>(value: Actual) {
  return {
    toBe: function <Expected>(): AreEqual<Actual, Expected> {
      return value as any;
    },
  };
}

interface Toy {
  name: string;
}

interface Pet {
  name: string;
  random(): number;
  readWriteAll: any;
  readonly readAll: any;
  toy: Toy;
  toys: Toy[]
}

interface User {
  name: string;
  unit: null;
  fakeUnit: undefined;

  readWriteAll: any;
  readonly readAll: any;
  pet: Pet;
  nulPet: Pet | null;
  optPet?: Pet;
  undPet: Pet | undefined;

  pets: Pet[];
  nulPets: (Pet | null)[];
  optPets?: Pet[];
  undPets: (Pet | undefined)[];

  random(): number;
  twoPets: [Pet, Pet];
}

// ------------------------------------------------------------------------------------

export const tests: true[] = [
  expect(KeyPath<User>()).toBe<WritableKeyPath<User, User>>(),

  expect(KeyPath<User>().name).toBe<WritableKeyPath<User, string>>(),
  expect(KeyPath<User>().unit).toBe<WritableKeyPath<User, null>>(),
  expect(KeyPath<User>().fakeUnit).toBe<WritableKeyPath<User, undefined>>(),

  expect(KeyPath<User>().readWriteAll).toBe<WritableKeyPath<User, any>>(),
  expect(KeyPath<User>().readAll).toBe<KeyPath<User, any>>(),

  expect(KeyPath<User>().pet).toBe<WritableKeyPath<User, Pet>>(),
  expect(KeyPath<User>().nulPet).toBe<WritableKeyPath<User, Pet | null>>(),
  expect(KeyPath<User>().optPet).toBe<WritableKeyPath<User, Pet | undefined>>(),
  expect(KeyPath<User>().undPet).toBe<WritableKeyPath<User, Pet | undefined>>(),

  expect(KeyPath<User>().pets).toBe<WritableKeyPath<User, Pet[]>>(),
  expect(KeyPath<User>().nulPets).toBe<WritableKeyPath<User, (Pet | null)[]>>(),
  expect(KeyPath<User>().optPets).toBe<WritableKeyPath<User, Pet[] | undefined>>(),
  expect(KeyPath<User>().undPets).toBe<WritableKeyPath<User, (Pet | undefined)[]>>(),

  expect(KeyPath<User>().pet.name).toBe<WritableKeyPath<User, string>>(),
  expect(KeyPath<User>().pet.toy).toBe<WritableKeyPath<User, Toy>>(),
  expect(KeyPath<User>().pet.toy.name).toBe<WritableKeyPath<User, string>>(),
  expect(KeyPath<User>().pet.toys).toBe<WritableKeyPath<User, Toy[]>>(),
  expect(KeyPath<User>().pet.toys[0]).toBe<WritableKeyPath<User, Toy>>(),
  expect(KeyPath<User>().pet.toys[0].name).toBe<WritableKeyPath<User, string>>(),
  expect(KeyPath<User>().pet.readWriteAll).toBe<WritableKeyPath<User, any>>(),
  expect(KeyPath<User>().pet.readAll).toBe<KeyPath<User, any>>(),

  expect(KeyPath<User>().nulPet.name).toBe<KeyPath<User, string | null>>(),
  expect(KeyPath<User>().nulPet.toy).toBe<KeyPath<User, Toy | null>>(),
  expect(KeyPath<User>().nulPet.toy.name).toBe<KeyPath<User, string | null>>(),
  expect(KeyPath<User>().nulPet.toys).toBe<KeyPath<User, Toy[] | null>>(),
  expect(KeyPath<User>().nulPet.toys[0]).toBe<KeyPath<User, Toy | null>>(),
  expect(KeyPath<User>().nulPet.toys[0].name).toBe<KeyPath<User, string | null>>(),
  expect(KeyPath<User>().nulPet.readWriteAll).toBe<KeyPath<User, any>>(),
  expect(KeyPath<User>().nulPet.readAll).toBe<KeyPath<User, any>>(),

  expect(KeyPath<User>().optPet.name).toBe<KeyPath<User, string | undefined>>(),
  expect(KeyPath<User>().optPet.toy).toBe<KeyPath<User, Toy | undefined>>(),
  expect(KeyPath<User>().optPet.toy.name).toBe<KeyPath<User, string | undefined>>(),
  expect(KeyPath<User>().optPet.toys).toBe<KeyPath<User, Toy[] | undefined>>(),
  expect(KeyPath<User>().optPet.toys[0]).toBe<KeyPath<User, Toy | undefined>>(),
  expect(KeyPath<User>().optPet.toys[0].name).toBe<KeyPath<User, string | undefined>>(),
  expect(KeyPath<User>().optPet.readWriteAll).toBe<KeyPath<User, any>>(),
  expect(KeyPath<User>().optPet.readAll).toBe<KeyPath<User, any>>(),

  expect(KeyPath<User>().undPet.name).toBe<KeyPath<User, string | undefined>>(),
  expect(KeyPath<User>().undPet.toy).toBe<KeyPath<User, Toy | undefined>>(),
  expect(KeyPath<User>().undPet.toy.name).toBe<KeyPath<User, string | undefined>>(),
  expect(KeyPath<User>().undPet.toys).toBe<KeyPath<User, Toy[] | undefined>>(),
  expect(KeyPath<User>().undPet.toys[0]).toBe<KeyPath<User, Toy | undefined>>(),
  expect(KeyPath<User>().undPet.toys[0].name).toBe<KeyPath<User, string | undefined>>(),
  expect(KeyPath<User>().undPet.readWriteAll).toBe<KeyPath<User, any>>(),
  expect(KeyPath<User>().undPet.readAll).toBe<KeyPath<User, any>>(),

  expect(KeyPath<User>().pets).toBe<WritableKeyPath<User, Pet[]>>(),
  expect(KeyPath<User>().nulPets).toBe<WritableKeyPath<User, (Pet | null)[]>>(),
  expect(KeyPath<User>().optPets).toBe<WritableKeyPath<User, Pet[] | undefined>>(),
  expect(KeyPath<User>().undPets).toBe<WritableKeyPath<User, (Pet | undefined)[]>>(),
  expect(KeyPath<User>().twoPets).toBe<WritableKeyPath<User, [Pet, Pet]>>(),

  expect(KeyPath<User>().pets[0]).toBe<WritableKeyPath<User, Pet>>(),
  expect(KeyPath<User>().pets[0].toys[0].name).toBe<WritableKeyPath<User, string>>(),
  expect(KeyPath<User>().nulPets[0]).toBe<WritableKeyPath<User, Pet | null>>(),
  expect(KeyPath<User>().nulPets[0].toys[0].name).toBe<KeyPath<User, string | null>>(),
  expect(KeyPath<User>().optPets[0]).toBe<KeyPath<User, Pet | undefined>>(),
  expect(KeyPath<User>().optPets[0].toys[0].name).toBe<KeyPath<User, string | undefined>>(),
  expect(KeyPath<User>().undPets[0]).toBe<WritableKeyPath<User, Pet | undefined>>(),
  expect(KeyPath<User>().undPets[0].toys[0].name).toBe<KeyPath<User, string | undefined>>(),
  expect(KeyPath<User>().twoPets[0]).toBe<WritableKeyPath<User, Pet>>(),
  expect(KeyPath<User>().twoPets[0].toys[0].name).toBe<WritableKeyPath<User, string>>(),
  expect(KeyPath<User>().twoPets[1]).toBe<WritableKeyPath<User, Pet>>(),
  expect(KeyPath<User>().twoPets[1].toys[0].name).toBe<WritableKeyPath<User, string>>(),
  expect(KeyPath<User>().twoPets[1].readAll).toBe<KeyPath<User, any>>(),

  expect(KeyPath<User>().pets[0].name).toBe<WritableKeyPath<User, string>>(),
  expect(KeyPath<User>().pets[0].toy).toBe<WritableKeyPath<User, Toy>>(),
  expect(KeyPath<User>().pets[0].toy.name).toBe<WritableKeyPath<User, string>>(),
  expect(KeyPath<User>().pets[0].toys).toBe<WritableKeyPath<User, Toy[]>>(),
  expect(KeyPath<User>().pets[0].toys[0]).toBe<WritableKeyPath<User, Toy>>(),
  expect(KeyPath<User>().pets[0].toys[0].name).toBe<WritableKeyPath<User, string>>(),

  expect(KeyPath<User>().nulPets[0].name).toBe<KeyPath<User, string | null>>(),
  expect(KeyPath<User>().nulPets[0].toy).toBe<KeyPath<User, Toy | null>>(),
  expect(KeyPath<User>().nulPets[0].toy.name).toBe<KeyPath<User, string | null>>(),
  expect(KeyPath<User>().nulPets[0].toys).toBe<KeyPath<User, Toy[] | null>>(),
  expect(KeyPath<User>().nulPets[0].toys[0]).toBe<KeyPath<User, Toy | null>>(),
  expect(KeyPath<User>().nulPets[0].toys[0].name).toBe<KeyPath<User, string | null>>(),

  expect(KeyPath<User>().optPets[0].name).toBe<KeyPath<User, string | undefined>>(),
  expect(KeyPath<User>().optPets[0].toy).toBe<KeyPath<User, Toy | undefined>>(),
  expect(KeyPath<User>().optPets[0].toy.name).toBe<KeyPath<User, string | undefined>>(),
  expect(KeyPath<User>().optPets[0].toys).toBe<KeyPath<User, Toy[] | undefined>>(),
  expect(KeyPath<User>().optPets[0].toys[0]).toBe<KeyPath<User, Toy | undefined>>(),
  expect(KeyPath<User>().optPets[0].toys[0].name).toBe<KeyPath<User, string | undefined>>(),

  expect(KeyPath<User>().undPets[0].name).toBe<KeyPath<User, string | undefined>>(),
  expect(KeyPath<User>().undPets[0].toy).toBe<KeyPath<User, Toy | undefined>>(),
  expect(KeyPath<User>().undPets[0].toy.name).toBe<KeyPath<User, string | undefined>>(),
  expect(KeyPath<User>().undPets[0].toys).toBe<KeyPath<User, Toy[] | undefined>>(),
  expect(KeyPath<User>().undPets[0].toys[0]).toBe<KeyPath<User, Toy | undefined>>(),
  expect(KeyPath<User>().undPets[0].toys[0].name).toBe<KeyPath<User, string | undefined>>(),
  expect(KeyPath<User>().twoPets[0].name).toBe<WritableKeyPath<User, string>>(),
  expect(KeyPath<User>().twoPets[0].toy).toBe<WritableKeyPath<User, Toy>>(),
  expect(KeyPath<User>().twoPets[0].toy.name).toBe<WritableKeyPath<User, string>>(),
  expect(KeyPath<User>().twoPets[0].toys).toBe<WritableKeyPath<User, Toy[]>>(),
  expect(KeyPath<User>().twoPets[0].toys[0]).toBe<WritableKeyPath<User, Toy>>(),
  expect(KeyPath<User>().twoPets[0].toys[0].name).toBe<WritableKeyPath<User, string>>(),
];

const user: User = {
  name: 'A User',
  unit: null,
  fakeUnit: undefined,
  readWriteAll: 42,
  readAll: 42,
  pet: {
    name: 'Pet',
    random: Math.random,
    readWriteAll: 42,
    readAll: 42,
    toy: { name: 'Pet Toy' },
    toys: [
      { name: 'Pet Toys[0]' },
      { name: 'Pet Toys[1]' },
    ],
  },
  nulPet: null,
  undPet: {
    name: 'Und Pet',
    random: Math.random,
    readWriteAll: 42,
    readAll: 42,
    toy: { name: 'Und Pet Toy' },
    toys: [
      { name: 'Und Pet Toys[0]' },
      { name: 'Und Pet Toys[1]' },
    ],
  },
  pets: [
    {
      name: 'Pets[0]',
      random: Math.random,
      readWriteAll: 42,
      readAll: 42,
      toy: { name: 'Pets[0] Toy' },
      toys: [
        { name: 'Pets[0] Toys[0]' },
        { name: 'Pets[0] Toys[1]' },
      ],
    },
  ],
  nulPets: [null],
  undPets: [undefined, undefined],
  random: Math.random,
  twoPets: [
    {
      name: 'TwoPets[0]',
      random: Math.random,
      readWriteAll: 42,
      readAll: 42,
      toy: { name: 'TwoPets[0] Toy' },
      toys: [
        { name: 'TwoPets[0] Toys[0]' },
        { name: 'TwoPets[0] Toys[1]' },
      ],
    },
    {
      name: 'TwoPets[1]',
      random: Math.random,
      readWriteAll: 42,
      readAll: 42,
      toy: { name: 'TwoPets[1] Toy' },
      toys: [
        { name: 'TwoPets[1] Toys[0]' },
        { name: 'TwoPets[1] Toys[1]' },
      ],
    },
  ],
}


console.log('\User.name', KeyPath<User>().name[get](user))
console.log('\User.unit', KeyPath<User>().unit[get](user))
console.log('\User.fakeUnit', KeyPath<User>().fakeUnit[get](user))

console.log('\User.pet', KeyPath<User>().pet[get](user))
console.log('\User.pet.name', KeyPath<User>().pet.name[get](user))
console.log('\User.pet.toy', KeyPath<User>().pet.toy[get](user))
console.log('\User.pet.toy.name', KeyPath<User>().pet.toy.name[get](user))
console.log('\User.pet.toys', KeyPath<User>().pet.toys[get](user))
console.log('\User.pet.toys[0]', KeyPath<User>().pet.toys[0][get](user))
console.log('\User.pet.toys[0].name', KeyPath<User>().pet.toys[0].name[get](user))
console.log('\User.pet.toys[1]', KeyPath<User>().pet.toys[1][get](user))
console.log('\User.pet.toys[1].name', KeyPath<User>().pet.toys[1].name[get](user))
console.log('\User.pet.toys[2]', KeyPath<User>().pet.toys[2][get](user))

console.log('\User.nulPet', KeyPath<User>().nulPet[get](user))
console.log('\User.nulPet.name', KeyPath<User>().nulPet.name[get](user))
console.log('\User.nulPet.toy', KeyPath<User>().nulPet.toy[get](user))
console.log('\User.nulPet.toy.name', KeyPath<User>().nulPet.toy.name[get](user))

console.log('\User.undPet', KeyPath<User>().undPet[get](user))
console.log('\User.undPet.name', KeyPath<User>().undPet.name[get](user))
console.log('\User.undPet.toy', KeyPath<User>().undPet.toy[get](user))
console.log('\User.undPet.toy.name', KeyPath<User>().undPet.toy.name[get](user))

console.log('\User.pets', KeyPath<User>().pets[get](user))
console.log('\User.pets[0]', KeyPath<User>().pets[0][get](user))
console.log('\User.pets[0].name', KeyPath<User>().pets[0].name[get](user))
console.log('\User.pets[0].toy', KeyPath<User>().pets[0].toy[get](user))
console.log('\User.pets[0].toy.name', KeyPath<User>().pets[0].toy.name[get](user))
console.log('\User.pets[0].toys', KeyPath<User>().pets[0].toys[get](user))
console.log('\User.pets[0].toys[0]', KeyPath<User>().pets[0].toys[0][get](user))
console.log('\User.pets[0].toys[0].name', KeyPath<User>().pets[0].toys[0].name[get](user))
console.log('\User.pets[0].toys[1]', KeyPath<User>().pets[0].toys[1][get](user))
console.log('\User.pets[0].toys[1].name', KeyPath<User>().pets[0].toys[1].name[get](user))

console.log('\User.undPets', KeyPath<User>().undPets[get](user))
console.log('\User.undPets[1]', KeyPath<User>().undPets[1][get](user))
console.log('\User.undPets[1].toys[1].name', KeyPath<User>().undPets[1].toys[1].name[get](user))

KeyPath<User>().undPets[1][set](user, {
  name: 'Und Pets[1]',
  random: Math.random,
  readWriteAll: 42,
  readAll: 42,
  toy: { name: 'Und Pets[1] Toy' },
  toys: [
    { name: 'Und Pets[1] Toys[0]' },
    { name: 'Und Pets[1] Toys[1]' },
  ],
})

console.log('\User.undPets', KeyPath<User>().undPets[get](user))
console.log('\User.undPets[1]', KeyPath<User>().undPets[1][get](user))
console.log('\User.undPets[1].toys[1].name', KeyPath<User>().undPets[1].toys[1].name[get](user))

KeyPath<User>().readWriteAll[set](user, 'hello world')

console.log('\User.self', KeyPath<User>()[get](user))
