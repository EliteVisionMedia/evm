const mongoose = require('mongoose');

/** Removes credentials / full URI from any text before it is logged. */
function redact(text, uri) {
  let out = String(text ?? '');
  if (uri) out = out.split(uri).join('<MONGODB_URI>');
  return out.replace(/(mongodb(?:\+srv)?:\/\/)[^@\s/]*@/gi, '$1<credentials>@');
}

/** Safe, specific explanation of a connection failure (no secrets). */
function describeError(err, uri) {
  const lines = [`${err.name}${err.code ? ` (code ${err.code})` : ''}: ${redact(err.message, uri)}`];
  const msg = String(err.message);
  if (/bad auth|authentication failed/i.test(msg)) lines.push('Hint: username/password rejected. Check the Atlas database user and URL-encode special characters in the password.');
  else if (/querySrv|ENOTFOUND|EREFUSED/i.test(msg)) lines.push('Hint: DNS lookup for the cluster hostname failed. Check the hostname in MONGODB_URI and your network/DNS.');
  else if (/whitelist|IP.*not allowed|Could not connect to any servers/i.test(msg)) lines.push('Hint: Atlas refused the connection. Check Network Access and that the cluster is not paused.');
  if (err.reason?.servers) {
    for (const [host, desc] of err.reason.servers) lines.push(`  ${host}: ${desc.type}${desc.error ? ` - ${redact(desc.error.message, uri)}` : ''}`);
  }
  return lines.join('\n');
}

function safeTarget(uri) {
  try {
    const u = new URL(uri);
    return `${u.protocol}//${u.hostname}${u.pathname && u.pathname !== '/' ? u.pathname : ''}`;
  } catch {
    return '<unparseable MONGODB_URI>';
  }
}

async function connectDB(uri) {
  mongoose.set('strictQuery', true);
  mongoose.connection.on('disconnected', () => console.warn('[db] MongoDB disconnected'));
  mongoose.connection.on('reconnected', () => console.log('[db] MongoDB reconnected'));
  mongoose.connection.on('error', (err) => console.error('[db] MongoDB error:', describeError(err, uri)));

  console.log(`[db] connecting to ${safeTarget(uri)} ...`);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  } catch (err) {
    const wrapped = new Error(`MongoDB connection failed.\n${describeError(err, uri)}`);
    wrapped.name = 'DatabaseConnectionError';
    throw wrapped;
  }
  // Log host/db only, never the full URI (it may contain credentials).
  console.log(`[db] MongoDB connected (${mongoose.connection.host}/${mongoose.connection.name})`);
}

async function disconnectDB() {
  await mongoose.connection.close();
}

module.exports = { connectDB, disconnectDB };
