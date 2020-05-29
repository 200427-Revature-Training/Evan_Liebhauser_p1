/*
    This is a utility for creating connections to the database.  We will define credentials
    here (from environment variables). There are a few ways to manage database connections. We
    could create a new connection for each operation. However, this is resource intensive and
    can significantly limit traffic and request-response speed. Most applications instead create
    a connection pool.

    A connection pool is a reserve of connections that can be temporarily checked out. These
    connections are not closed, but rather are lent for temporary usage before they are given
    back to the pool for reuse in another task.
*/

import { Pool } from 'pg';

export const db = new Pool({
    database: 'postgres',
    host: process.env.NODE_APP_URL,
    port: 5432,
    user: process.env.NODE_APP_ROLE,
    password: process.env.NODE_APP_PASS
});

db.on('connect', (client) => {
    client.query(`SET search_path TO my_schema, public`);
});
