# Synthima

[![JSR @jakeave/synthima](https://jsr.io/badges/@jakeave)](https://jsr.io/@jakeave/synthima)

## Description

Synthima is a tiny Typescript library and CLI to create random strings suitable
to be used as strong passwords. Synthima wholly relies on
`crypto.getRandomValues` rather than `Math.random` to derive values. It is
completely customizable.

## Requirements

The `main.ts` is made with Deno 2, but has 0 dependencies and can be ran on the
web, Bun, or Node.

The script requires ~ Deno 1

## Exports

### `genChars(length, requirements)`

Generates a random string of characters with requirements defined based on
character sets.

```typescript
genChars(8, [{ charSet: "abcd" }]); // 'bccbadda'
genChars(4, [{ charSet: "01" }]); // '1101'
genChars(2, [{ charSet: "abc" }, { charSet: "123" }]); // '1b'
genChars(10, [{ charSet: "abc", max: 2 }, { charSet: "123" }]); // '2123a212c3'
genChars(10, [{ charSet: "abc", min: 3 }, { charSet: "123" }]); // '23b2c13aca'
genChars(10, [{ charSet: "abc", min: 2, max: 6 }, { charSet: "123" }]); // 'cbbb2ab312'
genChars(8, [
  { charSet: "abc", min: 0 },
  { charSet: "123", min: 8 },
]); // '11333232'
```

### `getRandom(input)`

Generates a random integer or returns a random character from a string.

```typescript
getRandom(2); // 0 | 1
getRandom(3); // 0 | 1 | 2
getRandom("abc"); // 'a' | 'b' | 'c'
```

### `letters(length, additionalReqs)`

Calls `genChars` with predefined arguments. Length can be overwritten,
requirements can be added.

```typescript
letters(); // 'WAynPsZSfTsN'
```

### `numbers(length, additionalReqs)`

Calls `genChars` with predefined arguments. Length can be overwritten,
requirements can be added.

```typescript
numbers(); // '65167892`
```

### `level1(length, additionalReqs)`

Calls `genChars` with predefined arguments. Length can be overwritten,
requirements can be added.

```typescript
level1(); // 'cTOzh*5OY1$6'
```

### `level2(length, additionalReqs)`

Calls `genChars` with predefined arguments. Length can be overwritten,
requirements can be added.

```typescript
level2(); // '13sH_O8]vA-r'
```

### `level3(length, additionalReqs)`

Calls `genChars` with predefined arguments. Length can be overwritten,
requirements can be added.

```typescript
level3(); // 'Ƭl^bÉưR19Ȯ1ɪĸBëƱ`
```

## CLI

You will need to clone the repo to access the CLI.

The CLI can be accessed with `deno run scripts/synthima.ts`. It can also be
exported as a raw executable with `deno compile scripts/synthima.ts`.

### Add as Alias

Open your `.bashrc` or similar and add the following:

```bashrc
# Password generator
alias synthima='deno run ~<path-to-scripts/synthima.ts>'
```

Restart shell

```bash
synthima
# Will generate 5 options
# 5O0+)M$D1N&z
# 5UH*23j=zS5d
# X_'17mb$4wC
# ^(8"&Vn3+/0f
# 7 D 2H;70nX9
```

### Add Deno compile executable as alias

To "install" it as a CLI program, you could do the following:

```bash
deno compile scripts/synthima.ts
# The new executable will be created
# mv the executable where you want it in your file system
```

Open your `.bashrc` or similar and add the following:

```bashrc
# Password generator
alias synthima='~<path>'
```

Restart shell

```bash
synthima
# Will generate 5 options
# 5O0+)M$D1N&z
# 5UH*23j=zS5d
# X_'17mb$4wC
# ^(8"&Vn3+/0f
# 7 D 2H;70nX9
```

### CLI Usage

Returns five possible password options using the specified requirements.

#### Variant

Can be `numbers`, `letters`, `level1`, `level2`, `level3`. Default is `level2`.
Other options can be added.

```bash
synthima # 13sH_O8]vA-r
synthima numbers # 65167892
synthima numbers -l 4 # 8347
synthima numbers -l 4 -s abcdefg # 3cg1
```

#### `-l` `--length`

Determines the length. Default is 12.

```bash
synthima # 13sH_O8]vA-r
synthima -l 12 # 1uS)Ox956NjF*
synthima --length 5 # 02R>t
```

#### `-s` `--set`

Adds a character set requirement. All characters are included, even quotes. If a
variant is included, these will be added in addition to the predetermined
requirements.

```bash
synthima -s 123 # 331313332121
synthima --set abc # aaaccababccc
synthima -s abc -s 123 # c32b1b33a231
```

#### `-m` `--min`

The min for the character set. Default is 1. The first min will apply to the
first set and so on.

```bash
synthima -l 4 -s abc -m 3 -s 123 # ca3b
synthima -s abc -s 123 --min 2 # c32b1b33a231
```

#### `-x` `--max`

The max for the character set. The first max will apply to the first set and so
on.

```bash
synthima -s 123 -s abc -x 1 # aabcabbabaa3
synthima -l 8 -s 123 -s abc --max 3 # c1c2caac
```

### `-h` `--help`

Pulls up the help.

## Development

```bash
deno task install:githooks # once per clone: check on commit, test on push
deno task check
deno task test
```

## Releasing

Merges to `main` don't publish. To release, bump `version` in `deno.json` in a
PR, merge it, then push a matching tag:

```bash
git tag v0.1.0 && git push origin v0.1.0
```

The publish workflow checks the tag matches `deno.json`, runs the checks and
tests, and publishes to JSR.
