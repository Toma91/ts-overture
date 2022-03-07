import { get, set } from "./accessors"
import { KeyPath } from "./readonly"

interface User {
    name: string
}

describe('Test 2', () => {
    it('should pass', () => {
        const keyPath = KeyPath<User>().name

        const user: User = { name: 'Andrea' }

        expect(keyPath[get](user)).toBe('Andrea')
        keyPath[set](user, 'Giuseppe')
        expect(keyPath[get](user)).toBe('Giuseppa')
    })
})
