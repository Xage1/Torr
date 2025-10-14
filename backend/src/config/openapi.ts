import { z } from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';


// This patches z globally with OpenAPI methods
extendZodWithOpenApi(z);

export { z };