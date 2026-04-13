import { getAllUsers } from './client/auth'
import { configure, getConsoleSink, getLogger } from '@logtape/logtape'

const isDevelopment = process.env.NODE_ENV === 'development'

await configure({
  sinks: {
    console: getConsoleSink(),
    // file: getFileSink(isDevelopment ? 'dev.log' : 'prod.log'),
  },
  loggers: [
    {
      category: 'template-db',
      lowestLevel: isDevelopment ? 'trace' : 'info',
      // odd formatting for symmetry across monorepo
      // in a real app, we'd log to console in dev and remote file in prod
      sinks: isDevelopment ? ['console'] : ['console'],
    },
    { category: ['logtape', 'meta'], sinks: ['console'], lowestLevel: 'warning' }
  ],
})

const logger = getLogger(["template-db", "index"]);
// logger.info`${await getAllUsers()}`
logger.info`sqlite does not need a server. leaving structure in place for future dbs like surrealdb`
