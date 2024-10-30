import { randomUUID } from "crypto"

const createRandomName = () => {
    return randomUUID()
}

export {createRandomName}