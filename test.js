const crypto = require('crypto');
crypto.randomBytes(20, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
});