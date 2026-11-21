import { assert, assertEquals, assertThrows } from "@std/assert";
import {
  genChars,
  getRandom,
  letters,
  level1,
  level1CharSet,
  level2,
  level2CharSet,
  level3,
  level3CharSet,
  numbers,
} from "./main.ts";

Deno.test("getRandom() will return all integers", () => {
  const expected = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const actual = new Set();

  for (let i = 0; i < 1000; i++) {
    actual.add(getRandom(10));
  }
  assertEquals(actual, expected);
});

Deno.test("getRandom() will return binary", () => {
  const expected = new Set([0, 1]);

  const actual = new Set();

  for (let i = 0; i < 200; i++) {
    actual.add(getRandom(2));
  }

  assertEquals(actual, expected);
});

Deno.test("getRandom() will return all chars", () => {
  const expected = new Set("hello".split(""));

  const actual = new Set();

  for (let i = 0; i < 1000; i++) {
    actual.add(getRandom("hello"));
  }
  assertEquals(actual, expected);
});

Deno.test("genChars() password", () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const symbols = "!@#$%^&*";
  const numbers = "0123456789";

  const pass = genChars(10, [
    { charSet: lowercase, min: 1 },
    { charSet: uppercase, min: 1 },
    { charSet: symbols, min: 1 },
    { charSet: numbers, min: 1 },
  ]);

  assertEquals(pass.length, 10);

  const passSet = new Set(pass);

  const lowerSet = new Set(lowercase);

  assert(passSet.intersection(lowerSet).size >= 1);

  const upperSet = new Set(uppercase);

  assert(passSet.intersection(upperSet).size >= 1);

  const symbolSet = new Set(symbols);

  assert(passSet.intersection(symbolSet).size >= 1);

  const numberSet = new Set(numbers);

  assert(passSet.intersection(numberSet).size >= 1);
});

Deno.test("genChars() default min is 1", () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";

  const pass = genChars(2, [{ charSet: lowercase }, { charSet: numbers }]);

  assertEquals(pass.length, 2);

  assert(/[0-9]/.test(pass));
  assert(/[a-z]/.test(pass));
});

Deno.test("genChars() min 0 works", () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";

  let zeroNums = false;

  for (let i = 0; i < 100; i++) {
    const pass = genChars(10, [
      { charSet: lowercase, min: 9 },
      { charSet: numbers, min: 0 },
    ]);

    assertEquals(pass.length, 10);
    if (!/[0-9]/.test(pass)) {
      zeroNums = true;
      break;
    }
  }

  assert(zeroNums);
});

Deno.test("genChars() different mins", () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const symbols = "!@#$%^&*";
  const numbers = "0123456789";

  const pass = genChars(10, [
    { charSet: lowercase, min: 1 },
    { charSet: uppercase, min: 2 },
    { charSet: symbols, min: 3 },
    { charSet: numbers, min: 4 },
  ]);

  assertEquals(pass.length, 10);

  const lowerExp = new RegExp(`[${lowercase}]`, "g");

  assert((pass.match(lowerExp)?.length ?? 0) >= 1);

  const upperExp = new RegExp(`[${uppercase}]`, "g");

  assert((pass.match(upperExp)?.length ?? 0) >= 2);

  const symbolExp = new RegExp(`[\!\@\#\$\%\^\&\*]`, "g");

  assert((pass.match(symbolExp)?.length ?? 0) >= 3);

  const numberExp = new RegExp(`[${numbers}]`, "g");

  assert((pass.match(numberExp)?.length ?? 0) >= 4);
});

Deno.test("genChars() maxes", () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const symbols = "!@#$%^&*";
  const numbers = "0123456789";
  const pass = genChars(20, [
    { charSet: lowercase, min: 1 },
    { charSet: uppercase, min: 2, max: 2 },
    { charSet: symbols, min: 3, max: 3 },
    { charSet: numbers, min: 4, max: 4 },
  ]);

  assertEquals(pass.length, 20);

  const lowerExp = new RegExp(`[${lowercase}]`, "g");

  assert((pass.match(lowerExp)?.length ?? 0) >= 1);

  const upperExp = new RegExp(`[${uppercase}]`, "g");

  assert(pass.match(upperExp)?.length === 2);

  const symbolExp = new RegExp(`[\!\@\#\$\%\^\&\*]`, "g");

  assert(pass.match(symbolExp)?.length === 3);

  const numberExp = new RegExp(`[${numbers}]`, "g");

  assert(pass.match(numberExp)?.length === 4);
});

Deno.test("genChars() will throw error for too low maxes", () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const symbols = "!@#$%^&*";
  const numbers = "0123456789";

  assertThrows(
    () =>
      genChars(5, [
        { charSet: lowercase, min: 1, max: 1 },
        { charSet: uppercase, min: 1, max: 1 },
        { charSet: symbols, min: 1, max: 1 },
        { charSet: numbers, min: 1, max: 1 },
      ]),
    RangeError,
    "Argument length is 5, but requirements only allow a max length of 4",
  );
});

Deno.test("genChars() will throw error for too high mins", () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const symbols = "!@#$%^&*";
  const numbers = "0123456789";

  assertThrows(
    () =>
      genChars(5, [
        { charSet: lowercase, min: 5 },
        { charSet: uppercase, min: 5 },
        { charSet: symbols, min: 5 },
        { charSet: numbers, min: 5 },
      ]),
    RangeError,
    "Argument length is 5, but requirements prescribe a min length of 20",
  );
});

Deno.test("genChars() will throw error for a min < 0", () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const symbols = "!@#$%^&*";
  const numbers = "0123456789";

  assertThrows(
    () =>
      genChars(10, [
        { charSet: lowercase, min: 1 },
        { charSet: uppercase, min: 1 },
        { charSet: symbols, min: -1 },
        { charSet: numbers, min: 1 },
      ]),
    RangeError,
    "min for [2] (!@#$%^&*) must be greater than 0, but received -1",
  );
});

Deno.test("genChars() will throw error for a max < 0", () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const symbols = "!@#$%^&*";
  const numbers = "0123456789";

  assertThrows(
    () =>
      genChars(10, [
        { charSet: lowercase, min: 1 },
        { charSet: uppercase, min: 1 },
        { charSet: symbols, min: 1 },
        { charSet: numbers, min: 1, max: -2 },
      ]),
    RangeError,
    "max for [3] (0123456789) must be greater than 0, but received -2",
  );
});

Deno.test("genChars() will throw error when min > max", () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const symbols = "!@#$%^&*";
  const numbers = "0123456789";

  assertThrows(
    () =>
      genChars(10, [
        { charSet: lowercase, min: 1 },
        { charSet: uppercase, min: 3, max: 1 },
        { charSet: symbols, min: 1 },
        { charSet: numbers, min: 1, max: 3 },
      ]),
    RangeError,
    "min (3) is greater than max (1) for [1] (ABCDEFGHIJKLMNOPQRSTUVWXYZ)",
  );
});

Deno.test("genChars() min and max range will vary", () => {
  const numbers = "0123456789";
  const letters = "abcdefghij";

  // with no max, expect 1,2,3,4 numbers
  const expectedNumMatches = new Set([1, 2, 3, 4]);
  const actualNumMatches = new Set();

  for (let i = 0; i < 100; i++) {
    const pass = genChars(5, [{ charSet: numbers }, { charSet: letters }]);
    const numMatches = pass.match(/[0-9]/g)?.length;
    actualNumMatches.add(numMatches);
  }

  assertEquals(expectedNumMatches, actualNumMatches);
});

Deno.test("genChars() min and max range will vary 2", () => {
  const numbers = "0123456789";
  const letters = "abcdefghij";

  const expectedNumMatches = new Set([2, 3, 4, 5, 6, 7, 8]);
  const actualNumMatches = new Set();

  for (let i = 0; i < 1000; i++) {
    const pass = genChars(10, [
      { charSet: numbers, min: 2, max: 8 },
      { charSet: letters },
    ]);
    const numMatches = pass.match(/[0-9]/g)?.length;
    actualNumMatches.add(numMatches);
  }

  assertEquals(expectedNumMatches, actualNumMatches);
});

Deno.test("genChars() does not edit the argument array", () => {
  const numbers = "0123456789";
  const letters = "abcdefghijklmnopqrstuvwxyz";

  const requirements = [
    { charSet: numbers, min: 2, max: 8 },
    { charSet: letters, min: 1, max: 1 },
  ];

  const clone = [...requirements];

  const passes: string[] = [];

  for (let i = 0; i < 100; i++) {
    passes.push(genChars(8, requirements));
  }

  assertEquals(requirements, clone);

  for (const pass of passes) {
    assert(/\d{1}/.test(pass));
  }
});

Deno.test("genChars() will randomly shuffle", () => {
  const expectedNumMatches = new Set([
    "abc",
    "acb",
    "bac",
    "bca",
    "cab",
    "cba",
  ]);
  const actualNumMatches = new Set();

  for (let i = 0; i < 100; i++) {
    const pass = genChars(3, [
      { charSet: "a" },
      { charSet: "b" },
      { charSet: "c" },
    ]);
    actualNumMatches.add(pass);
  }

  assertEquals(expectedNumMatches, actualNumMatches);
});

Deno.test("genChars() has good distribution - 10", () => {
  const numbers = "0123456789";

  const set = new Set();

  for (let i = 0; i < 100; i++) {
    const char = genChars(1, [{ charSet: numbers, min: 1 }]);
    assertEquals(char.length, 1);
    set.add(char);
  }

  assertEquals(set.size, 10);
});

Deno.test("genChars() has a good distribution - 1000", () => {
  const numbers = "0123456789";

  const set = new Set();

  for (let i = 0; i < 30000; i++) {
    const char = genChars(3, [{ charSet: numbers, min: 1 }]);
    assertEquals(char.length, 3);
    set.add(char);
  }

  assertEquals(set.size, 1000);
});

Deno.test("letters() only matches letters", () => {
  const pass = letters();

  assert(pass.match(/[a-zA-Z]/g)?.length === 12);
});

Deno.test("numbers() only matches numbers", () => {
  const pass = numbers();

  assert(pass.match(/[0-9]/g)?.length === 8);
});

Deno.test("level1() matches level1 chars", () => {
  const charSets = level1CharSet.map(({ charSet }) => charSet).join("");

  const pass = level1();

  assertEquals(pass.length, 12);

  for (const char of pass) {
    const included = charSets.indexOf(char) >= 0;
    assert(included);
  }
});

Deno.test("level2() matches level2 chars", () => {
  const charSets = level2CharSet.map(({ charSet }) => charSet).join("");

  const pass = level2();

  assertEquals(pass.length, 12);

  for (const char of pass) {
    const included = charSets.indexOf(char) >= 0;
    assert(included);
  }
});

Deno.test("level3() matches level3 chars", () => {
  const charSets = level3CharSet.map(({ charSet }) => charSet).join("");

  const pass = level3();

  assertEquals(pass.length, 16);

  for (const char of pass) {
    const included = charSets.indexOf(char) >= 0;
    assert(included);
  }
});
