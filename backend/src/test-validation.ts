// src/test-validation.ts
// Use: npx tsx src/test-validation.ts

// Since we cannot easily spin up the full server + mongo in this environment without env vars,
// We will unit test the schema validation logic directly using Zod.
// This proves the validation logic works as expected.

import { z } from 'zod';
import { registerSchema } from './schemas/auth.schema';

console.log("🧪 Testing Zod Validation Logic...\n");

const testCases = [
  {
    name: "Valid User Registration",
    input: {
      body: {
        firstName: "Alice",
        lastName: "Smith",
        email: "alice@example.com",
        password: "password123"
      }
    },
    expected: true
  },
  {
    name: "Missing Email",
    input: {
      body: {
        firstName: "Bob",
        lastName: "Smith",
        // email missing
        password: "password123"
      }
    },
    expected: false
  },
  {
    name: "Invalid Email Format",
    input: {
      body: {
        firstName: "Charlie",
        lastName: "Brown",
        email: "not-an-email",
        password: "password123"
      }
    },
    expected: false
  },
  {
    name: "Short Password",
    input: {
      body: {
        firstName: "Dave",
        lastName: "Jones",
        email: "dave@example.com",
        password: "123" // Too short
      }
    },
    expected: false
  },
  {
    name: "Missing Names",
    input: {
      body: {
        // names missing
        email: "eve@example.com",
        password: "password123"
      }
    },
    expected: false
  }
];

let passed = 0;
let failed = 0;

for (const test of testCases) {
  try {
    registerSchema.parse(test.input);
    if (test.expected) {
      console.log(`✅ [PASS] ${test.name}`);
      passed++;
    } else {
      console.log(`❌ [FAIL] ${test.name} - Expected failure but passed`);
      failed++;
    }
  } catch (error) {
    if (!test.expected) {
      console.log(`✅ [PASS] ${test.name} - Caught expected validation error`);
      passed++;
    } else {
      console.log(`❌ [FAIL] ${test.name} - Expected pass but failed`);
      if (error instanceof z.ZodError) {
        console.log(JSON.stringify(error.flatten().fieldErrors, null, 2));
      } else {
        console.log(error);
      }
      failed++;
    }
  }
}

console.log(`\nResults: ${passed} Passed, ${failed} Failed`);

if (failed > 0) process.exit(1);
