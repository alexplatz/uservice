import { getAllUsers } from './client'
console.log(await getAllUsers())
console.log('sqlite does not need a server. leaving structure in place for future dbs like surrealdb')
