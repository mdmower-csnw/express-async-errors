# @csnw/express-async-errors

An async/await patch for [Express](https://expressjs.com/) error handlers. Async functions already work fine in Express, this module improves support for thrown errors.

This package is compatible with both ESM and CommonJS projects. It additionally differs from [express-async-errors](https://www.npmjs.com/package/express-async-errors) by expecting the patch function be called explicitly instead of when the module is `require`'d.

This is a fork of a fork; thank you to the original authors:

- [MadRabbit/express-yields](https://github.com/MadRabbit/express-yields)
- [davidbanham/express-async-errors](https://github.com/davidbanham/express-async-errors)

## Usage

```sh
npm install @csnw/express-async-errors --save
```

Run the patch before building `express()`. For example:

```js
import express from 'express';
import expressAsyncErrors from '@csnw/express-async-errors';

// Apply patch and then build express
expressAsyncErrors();
const app = express();

app.get('/version', async (req, res) => {
  const version = parseInt(req.query.v);
  if (isNaN(version)) {
    // Throw error from async request handler
    throw new Error('version should be a number');
  }
  res.status(200).json({ version });
});

// Request error handler receives the thrown error
app.use((err, req, res, next) => {
  if (err.message === 'version should be a number') {
    res.status(400).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: 'unexpected error' });
});

app.listen(3000, () => {
  console.info('Server running at http://localhost:3000');
});
```

## How Does This Work?

This is a minimalistic and unintrusive hack. Instead of patching all methods on an express `Router`, it wraps the `Layer#handle` property in one place, leaving all the rest of express as-is. Apply the patch once and then freely throw errors from all your async request handlers!

## License

All code in this repository is released under the terms of the ISC license.
