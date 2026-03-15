process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mappe_giuridiche';
process.env.JWT_SECRET = 'test-jwt-secret-that-is-long-enough-for-testing-purposes-only-64chars';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-also-long-enough-for-testing-purposes-64';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.NODE_ENV = 'test';
process.env.PORT = '3911';
