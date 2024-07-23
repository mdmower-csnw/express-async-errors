# @csnw/express-async-errors

This module patches [Express](https://expressjs.com/) to better support errors thrown from async request handlers. The primary difference of this package from [express-async-errors](https://www.npmjs.com/package/express-async-errors) is that you are expected to call the patch function explicitly, rather than it applying as soon as the module is `require`'d or `import`'ed. Both ESM and CommonJS projects are supported.

This is a fork of a fork; thank you to the original authors:

- [MadRabbit/express-yields](https://github.com/MadRabbit/express-yields)
- [davidbanham/express-async-errors](https://github.com/davidbanham/express-async-errors)

## Usage

```sh
npm install @csnw/express-async-errors --save
```

Run the patch before building `express()`.  
Example:

```js
import express from 'express';
import expressAsyncErrors from '@csnw/express-async-errors';

// Apply patch and then build express
expressAsyncErrors();
const app = express();

app.get('/delay', async (req, res) => {
  const ms = parseInt(req.query.ms);
  if (isNaN(ms)) {
    // Throw error from async request handler
    throw new Error('bad request: ms should be a number');
  }
  await new Promise((resolve) => setTimeout(resolve, ms));
  res.status(200).json({ success: true, ms });
});

app.use((err, req, res, next) => {
  // Request error handler receives the thrown error
  if (err.message?.startsWith('bad request:')) {
    res.status(400).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: 'unexpected error' });
});
```

## How Does This Work?

This is a minimalistic and unintrusive hack. Instead of patching all methods on an express `Router`, it wraps the `Layer#handle` property in one place. When a request handler is invoked, the wrapper evaluates the handler and then checks whether the returned value is a promise. If it is, a `catch` is appended to the promise: `.catch((err) => next(err))`. Your request error handler is then able to handle the error passed by `next(err)`. If no error occurs, the `catch` never evaluates.

## License

All code in this repository is released under the terms of the ISC license.
