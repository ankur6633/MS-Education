const { NextAuth } = require('next-auth');
const { authOptions } = require('../../lib/auth');

const handler = NextAuth(authOptions);

module.exports = { handler };
