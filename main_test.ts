import { assert, assertEquals, assertThrows } from "@std/assert";
import {
  genChars,
  getRandom,
  letters,
  lettersCharSet,
  level1,
  level1CharSet,
  level2,
  level2CharSet,
  level3,
  level3CharSet,
  numbers,
  numbersCharSet,
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
    "min for [2] (!@#$%^&*) must be an integer greater than or equal to 0, but received -1",
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
    "max for [3] (0123456789) must be an integer greater than or equal to 0, but received -2",
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
  const requirements = [
    { charSet: "0123456789", min: 2, max: 8 },
    { charSet: "abcdefghijklmnopqrstuvwxyz", min: 1, max: 1 },
  ];
  const snapshot = structuredClone(requirements);

  for (let i = 0; i < 100; i++) {
    assert(/\d/.test(genChars(8, requirements)));
  }

  assertEquals(requirements, snapshot);
});

Deno.test("genChars() does not edit the exported presets", () => {
  const presets = {
    letters: lettersCharSet,
    numbers: numbersCharSet,
    level1: level1CharSet,
    level2: level2CharSet,
    level3: level3CharSet,
  };
  const snapshot = structuredClone(presets);

  letters();
  numbers();
  level1();
  level2();
  level3();
  for (const preset of Object.values(presets)) genChars(20, preset);

  assertEquals(presets, snapshot);
});

Deno.test("genChars() accepts frozen requirements", () => {
  const requirements = Object.freeze([
    Object.freeze({ charSet: "abc", min: 1, max: 5 }),
    Object.freeze({ charSet: "123" }),
  ]);
  assertEquals(genChars(6, requirements).length, 6);
});

Deno.test("genChars() counts length in code points", () => {
  const pass = genChars(40, [{ charSet: "😀😁😂" }]);
  assert(pass.isWellFormed());
  assertEquals([...pass].length, 40);
  for (const char of pass) assert("😀😁😂".includes(char));
});

Deno.test("genChars() min/max count code points", () => {
  const pass = genChars(8, [
    { charSet: "😀", min: 3, max: 3 },
    { charSet: "ab" },
  ]);
  assertEquals([...pass].filter((c) => c === "😀").length, 3);
  assertEquals([...pass].length, 8);
});

Deno.test("genChars() throws on an empty or invalid charSet", () => {
  assertThrows(
    () => genChars(3, [{ charSet: "" }, { charSet: "ab" }]),
    RangeError,
    "must not be empty",
  );
  assertThrows(
    () => genChars(3, [{ charSet: "", min: 0 }, { charSet: "ab" }]),
    RangeError,
    "must not be empty",
  );
  assertThrows(
    () => genChars(3, [{ charSet: 123 as unknown as string }]),
    TypeError,
  );
});

Deno.test("genChars() allows lengths over 255 with unbounded sets", () => {
  assertEquals(genChars(300, [{ charSet: "ab" }]).length, 300);
  assertEquals(
    genChars(300, [{ charSet: "a", max: 2 }, { charSet: "b" }]).length,
    300,
  );
  assertEquals(
    genChars(300, [{ charSet: "b" }, { charSet: "a", max: 2 }]).length,
    300,
  );
});

Deno.test("genChars() max: 0 excludes a set", () => {
  for (let i = 0; i < 200; i++) {
    const pass = genChars(10, [
      { charSet: "abc", min: 0, max: 0 },
      { charSet: "123" },
    ]);
    assert(!/[abc]/.test(pass));
  }
});

Deno.test("genChars() validates min and max", () => {
  assertThrows(
    () => genChars(4, [{ charSet: "abc", max: 0 }, { charSet: "123" }]),
    RangeError,
    "min (1) is greater than max (0)",
  );
  assertThrows(
    () => genChars(4, [{ charSet: "abc", min: 1.5 }]),
    RangeError,
  );
  assertThrows(
    () => genChars(4, [{ charSet: "abc", max: NaN }]),
    RangeError,
  );
  assertThrows(
    () => genChars(4, [{ charSet: "abc", max: -1 }]),
    RangeError,
  );
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

Deno.test("getRandom() rejects biased draws (rejection sampling)", () => {
  const original = crypto.getRandomValues;
  const draws = [0xffffffff, 4];
  let calls = 0;
  Object.defineProperty(crypto, "getRandomValues", {
    configurable: true,
    value: (arr: Uint32Array) => {
      arr[0] = draws[calls++];
      return arr;
    },
  });
  try {
    // limit is 2^32 - 1, so 0xffffffff is rejected and 4 % 3 === 1
    assertEquals(getRandom(3), 1);
    assertEquals(calls, 2);
  } finally {
    Object.defineProperty(crypto, "getRandomValues", {
      configurable: true,
      value: original,
    });
  }
});

Deno.test("getRandom() throws on invalid input", () => {
  for (const bad of [0, -1, 1.5, NaN, 2 ** 32 + 1]) {
    assertThrows(() => getRandom(bad), RangeError);
  }
  assertThrows(() => getRandom(""), RangeError);
});

Deno.test("getRandom() edge values", () => {
  assertEquals(getRandom(1), 0);
  assert(getRandom(2 ** 32) < 2 ** 32);
  assertEquals(getRandom("😀"), "😀");
});

function shares(
  preset: readonly { charSet: string }[],
  buckets: Record<string, (c: number) => boolean>,
) {
  const reqs = preset.map((r) => ({ charSet: r.charSet, min: 0 }));
  const counts: Record<string, number> = {};
  let total = 0;
  for (let i = 0; i < 500; i++) {
    for (const char of genChars(100, reqs)) {
      const cp = char.codePointAt(0)!;
      for (const [name, test] of Object.entries(buckets)) {
        if (test(cp)) counts[name] = (counts[name] ?? 0) + 1;
      }
      total++;
    }
  }
  return Object.fromEntries(
    Object.keys(buckets).map((k) => [k, (counts[k] ?? 0) / total]),
  );
}

function assertShares(
  actual: Record<string, number>,
  expected: Record<string, number>,
) {
  // 50,000 draws: std error <= 0.0022, so 0.02 is ~9 sigma
  for (const [name, want] of Object.entries(expected)) {
    assert(
      Math.abs(actual[name] - want) < 0.02,
      `${name}: expected ~${want}, got ${actual[name]}`,
    );
  }
}

Deno.test("genChars() filler is uniform over the pooled characters - level3", () => {
  // 668 chars: 92 ascii, 64 diacritics1, 256 diacritics2, 256 extended
  assertShares(
    shares(level3CharSet, {
      ascii: (c) => c < 0x80,
      diacritics1: (c) => c >= 0xc0 && c <= 0xff,
      diacritics2: (c) => c >= 0x100 && c <= 0x1ff,
      extended: (c) => c >= 0x200 && c <= 0x2ff,
    }),
    {
      ascii: 92 / 668,
      diacritics1: 64 / 668,
      diacritics2: 256 / 668,
      extended: 256 / 668,
    },
  );
});

Deno.test("genChars() filler is uniform over the pooled characters - level1", () => {
  // 70 chars: 26 + 26 letters, 10 digits, 8 symbols
  assertShares(
    shares(level1CharSet, {
      digits: (c) => c >= 0x30 && c <= 0x39,
      symbols: (c) => "!@#$%^&*".includes(String.fromCodePoint(c)),
    }),
    { digits: 10 / 70, symbols: 8 / 70 },
  );
});

Deno.test("genChars() weighting still respects max", () => {
  for (let i = 0; i < 200; i++) {
    const pass = genChars(10, [
      { charSet: "abcdefghijklmnopqrstuvwxyz", min: 0, max: 2 },
      { charSet: "1" },
    ]);
    assert((pass.match(/[a-z]/g)?.length ?? 0) <= 2);
    assertEquals(pass.length, 10);
  }
});
