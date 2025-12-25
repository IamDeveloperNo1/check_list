import { NextResponse } from 'next/server';
import pool from '@/lib/db';
// หรือ import { conn } from '@/lib/db';

export async function GET() {
       try {
              const [rows] = await pool.query(`
                     SELECT
                            emp_name,
                            time_scan,
                            role_access,
                            emp_id
                     FROM
                            test.employee;`
              );

              return NextResponse.json(rows);
       } catch (error) {
              console.error('Database error:', error);
              return NextResponse.json(
                     { error: 'Failed to fetch employees' },
                     { status: 500 }
              );
       }
}