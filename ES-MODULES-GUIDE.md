# ES Modules Quick Reference Guide

## Import Syntax

### Default Import
```javascript
import express from 'express';
import User from './models/user.model.js';
import userService from './service/user.service.js';
```

### Named Import
```javascript
import { successResponse, errorResponse } from './responseHelper.js';
import { DataTypes } from 'sequelize';
import { createUserDto, updateUserDto } from './dto/user.dto.js';
```

### Mixed Import
```javascript
import jwt, { verify, sign } from 'jsonwebtoken';
```

### Import Everything
```javascript
import * as helpers from './helpers.js';
```

## Export Syntax

### Default Export
```javascript
// Single class/function
class UserService {
  // ...
}
export default UserService;

// Or inline
export default class UserService {
  // ...
}
```

### Named Export
```javascript
// Multiple exports
export const successResponse = (res, data) => { /* ... */ };
export const errorResponse = (res, message) => { /* ... */ };

// Or at the end
const successResponse = (res, data) => { /* ... */ };
const errorResponse = (res, message) => { /* ... */ };
export { successResponse, errorResponse };
```

### Mixed Export
```javascript
const UserService = class { /* ... */ };
const helper = () => { /* ... */ };

export default UserService;
export { helper };
```

## Important Rules

### 1. File Extensions Required
Always include `.js` extension for relative imports:
```javascript
// ✓ Correct
import User from './models/user.model.js';

// ✗ Wrong
import User from './models/user.model';
```

### 2. Package Imports Don't Need Extensions
```javascript
// ✓ Correct
import express from 'express';
import { Sequelize } from 'sequelize';
```

### 3. Directory Imports Need index.js
```javascript
// ✓ Correct
import db from './db/index.js';

// ✗ Wrong
import db from './db';
```

### 4. Top-Level Await
ES modules support top-level await:
```javascript
// This works in ES modules
await import('./src/models/associations.js');

const data = await fetchData();
```

## Common Patterns in This Project

### Controller Pattern
```javascript
import service from '../service/user.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';

class UserController {
  async create(req, res) {
    // ...
  }
}

export default new UserController();
```

### Service Pattern
```javascript
import Model from '../models/user.model.js';

class UserService {
  async createUser(data) {
    // ...
  }
}

export default new UserService();
```

### Model Pattern
```javascript
import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const User = db.sequelize.define('User', {
  // ...
});

export default User;
```

### Routes Pattern
```javascript
import express from 'express';
import controller from '../controller/user.controller.js';
import authenticate from '../../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, controller.create);

export default router;
```

### DTO Pattern
```javascript
import Joi from 'joi';

export const createUserDto = Joi.object({
  // ...
});

export const updateUserDto = Joi.object({
  // ...
});
```

## Troubleshooting

### Error: Cannot find module
**Problem:** Missing `.js` extension in import
```javascript
// ✗ Wrong
import User from './user.model';

// ✓ Correct
import User from './user.model.js';
```

### Error: ERR_MODULE_NOT_FOUND
**Problem:** Incorrect path or missing index.js
```javascript
// ✗ Wrong
import db from './db';

// ✓ Correct
import db from './db/index.js';
```

### Error: Must use import to load ES Module
**Problem:** Missing `"type": "module"` in package.json
```json
{
  "type": "module"
}
```

## Benefits

1. **Static Analysis**: Imports are analyzed at compile time
2. **Tree Shaking**: Unused exports can be eliminated
3. **Async Loading**: Native support for dynamic imports
4. **Better IDE Support**: Improved autocomplete and refactoring
5. **Future Standard**: Aligned with JavaScript ecosystem

## Migration from CommonJS

| CommonJS | ES Modules |
|----------|------------|
| `const x = require('x')` | `import x from 'x'` |
| `const { y } = require('x')` | `import { y } from 'x'` |
| `module.exports = x` | `export default x` |
| `module.exports = { x, y }` | `export { x, y }` |
| `exports.x = value` | `export const x = value` |

## Resources

- [Node.js ES Modules Documentation](https://nodejs.org/api/esm.html)
- [MDN Import Statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
- [MDN Export Statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
