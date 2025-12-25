import mysql from 'mysql2/promise';

const pool = mysql.createPool({
       host: "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
       port: 4000,
       user: "2tYVDvLNQCZJTYD.root",
       password:"mP1y9el6IpFraXrA",
       database: "test",
       waitForConnections: true,
       connectionLimit: 10,
       queueLimit: 0,
       ssl: {
              rejectUnauthorized: true
       }
});

export default pool;