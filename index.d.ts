export = expressAsyncErrors;
/**
 * Applies async errors patch for Express. This should be called before building `express()`.
 *
 * Usage:
 * ```
 * import express from 'express';
 * import expressAsyncErrors from '@csnw/express-async-errors';
 * expressAsyncErrors();
 * const app = express();
 * ```
 */
declare function expressAsyncErrors(): void;
