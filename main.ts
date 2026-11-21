/**
 * A requirement genChars() must fulfill
 *
 * @property {string} charSet - A string of characters
 * @property {number|undefined} [min = 1] - The minimum instances one of the characters from the charSet may appear
 * @property {number|undefined} [max = undefined] - The maximum instances one of the characters from the charSet may appear
 */
export interface Requirement {
  charSet: string;
  min?: number;
  max?: number;
}

interface Slot {
  chars: string[];
  max: number | undefined;
  used: number;
}

/**
 * Generates a random string of characters with requirements defined based on character sets
 *
 * @param length The length of the desired character string
 * @param requirements An array of Requirement objects that determine a character set, as well as the maximum and minimum instances from that set
 * @returns A random character string
 * @example
 * genChars(8, [{charSet: 'abcd'}]) // 'bccbadda'
 * @example
 * genChars(4, [{charSet: '01'}]) // '1101'
 * @example
 * genChars(2, [{charSet: 'abc'}, {charSet: '123'}]) // '1b'
 * @example
 * genChars(10, [{charSet: 'abc', max: 2}, {charSet: '123'}]) // '2123a212c3'
 * @example
 * genChars(10, [{charSet: 'abc', min: 3}, {charSet: '123'}]) // '23b2c13aca'
 * @example
 * genChars(10, [{ charSet: "abc", min: 2, max: 6 }, { charSet: "123" }]) // 'cbbb2ab312'
 * @example
 * genChars(8, [{ charSet: "abc", min: 0 }, { charSet: "123", min: 8 }]) // '11333232'
 */
export function genChars(
  length: number,
  requirements: readonly Requirement[],
): string {
  // Private copies: the caller's objects (including exported presets) are never touched.
  const slots: Slot[] = [];
  let maxLength = 0;
  let minLength = 0;
  const result: string[] = [];

  for (let i = 0; i < requirements.length; i++) {
    const { charSet, min = 1, max } = requirements[i];

    if (typeof charSet !== "string") {
      throw new TypeError(`charSet for [${i}] must be a string`);
    }
    const chars = [...charSet];
    if (!chars.length) {
      throw new RangeError(`charSet for [${i}] must not be empty`);
    }
    if (!Number.isInteger(min) || min < 0) {
      throw new RangeError(
        `min for [${i}] (${charSet}) must be an integer greater than or equal to 0, but received ${min}`,
      );
    }
    if (max !== undefined && (!Number.isInteger(max) || max < 0)) {
      throw new RangeError(
        `max for [${i}] (${charSet}) must be an integer greater than or equal to 0, but received ${max}`,
      );
    }
    if (max !== undefined && min > max) {
      throw new RangeError(
        `min (${min}) is greater than max (${max}) for [${i}] (${charSet})`,
      );
    }

    maxLength += max === undefined ? Infinity : max;
    minLength += min;
    slots.push({ chars, max, used: min });
    for (let j = 0; j < min; j++) {
      result.push(pick(chars));
    }
  }

  if (maxLength < length) {
    throw new RangeError(
      `Argument length is ${length}, but requirements only allow a max length of ${maxLength}`,
    );
  }

  if (minLength > length) {
    throw new RangeError(
      `Argument length is ${length}, but requirements prescribe a min length of ${minLength}`,
    );
  }

  while (result.length < length) {
    const open = slots.filter(({ max, used }) =>
      max === undefined || used < max
    );
    // Weight each open set by its size so every pooled character is equally likely
    let n = getRandom(open.reduce((sum, { chars }) => sum + chars.length, 0));
    const slot = open.find(({ chars }) => (n -= chars.length) < 0)!;
    slot.used++;
    result.push(pick(slot.chars));
  }

  // Fisher-Yates
  let currentIndex = result.length;

  while (currentIndex != 0) {
    const randomIndex = getRandom(currentIndex);
    currentIndex--;

    [result[currentIndex], result[randomIndex]] = [
      result[randomIndex],
      result[currentIndex],
    ];
  }

  return result.join("");
}

function pick(chars: string[]): string {
  return chars[getRandom(chars.length)];
}

/**
 * Uses crypto.getRandomValues to derive a random number [0 - (input - 1)] or a random character from a string
 *
 * @param {number|string} input - The max number or a string character set
 * @returns {number|string} A random number or a single random character
 * @example
 * getRandom(2) // 0 | 1
 * @example
 * getRandom(3) // 0 | 1 | 2
 * @example
 * getRandom('abc') // 'a' | 'b' | 'c'
 */
export function getRandom<T extends number | string>(
  input: T,
): T extends number ? number : string {
  const chars = typeof input === "string" ? [...input] : null;
  const n = chars ? chars.length : (input as number);
  if (!Number.isInteger(n) || n < 1 || n > 2 ** 32) {
    throw new RangeError(
      `getRandom requires an integer from 1 to 2^32 or a non-empty string, but received ${
        chars ? "an empty string" : input
      }`,
    );
  }
  // Rejection sampling: discard draws from the uneven tail so each value is equally likely
  const limit = 2 ** 32 - (2 ** 32 % n);
  const buf = new Uint32Array(1);
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  const idx = buf[0] % n;
  return (chars ? chars[idx] : idx) as T extends number ? number : string;
}

const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numberStrings = "0123456789";
const simpleChars = "!@#$%^&*";
const specialChars = simpleChars + "()-=_+[]{}|;':\",./<>? ";
const diacritics1 =
  "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ";
const diacritics2 =
  "ĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſƀƁƂƃƄƅƆƇƈƉƊƋƌƍƎƏƐƑƒƓƔƕƖƗƘƙƚƛƜƝƞƟƠơƢƣƤƥƦƧƨƩƪƫƬƭƮƯưƱƲƳƴƵƶƷƸƹƺƻƼƽƾƿǀǁǂǃǄǅǆǇǈǉǊǋǌǍǎǏǐǑǒǓǔǕǖǗǘǙǚǛǜǝǞǟǠǡǢǣǤǥǦǧǨǩǪǫǬǭǮǯǰǱǲǳǴǵǶǷǸǹǺǻǼǽǾǿ";
const extended =
  "ȀȁȂȃȄȅȆȇȈȉȊȋȌȍȎȏȐȑȒȓȔȕȖȗȘșȚțȜȝȞȟȠȡȢȣȤȥȦȧȨȩȪȫȬȭȮȯȰȱȲȳȴȵȶȷȸȹȺȻȼȽȾȿɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏɐɑɒɓɔɕɖɗɘəɚɛɜɝɞɟɠɡɢɣɤɥɦɧɨɩɪɫɬɭɮɯɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿʀʁʂʃʄʅʆʇʈʉʊʋʌʍʎʏʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟʠʡʢʣʤʥʦʧʨʩʪʫʬʭʮʯʰʱʲʳʴʵʶʷʸʹʺʻʼʽʾʿˀˁ˂˃˄˅ˆˇˈˉˊˋˌˍˎˏːˑ˒˓˔˕˖˗˘˙˚˛˜˝˞˟ˠˡˢˣˤ˥˦˧˨˩˪˫ˬ˭ˮ˯˰˱˲˳˴˵˶˷˸˹˺˻˼˽˾˿";

/**
 * Standard 26 letter lowercase and uppercase latin letters
 */
export const lettersCharSet: Requirement[] = [
  { charSet: lowercaseLetters },
  { charSet: uppercaseLetters },
];

/**
 * Digits 0-9 as strings
 */
export const numbersCharSet: Requirement[] = [{ charSet: numberStrings }];

/**
 * Upper and lowercase letters, with numbers, and symbols !@#$%^&*
 */
export const level1CharSet: Requirement[] = [
  { charSet: lowercaseLetters },
  { charSet: uppercaseLetters },
  { charSet: numberStrings },
  { charSet: simpleChars },
];

/**
 * Upper and lowercase letters, with numbers, and symbols !@#$%^&*()-=_+[]{}|;':\",./<>?
 */
export const level2CharSet: Requirement[] = [
  { charSet: lowercaseLetters },
  { charSet: uppercaseLetters },
  { charSet: numberStrings },
  { charSet: specialChars },
];

/**
 * A large character set including diacritics, special symbols and phonetic characters
 */
export const level3CharSet: Requirement[] = [
  { charSet: lowercaseLetters },
  { charSet: uppercaseLetters },
  { charSet: numberStrings },
  { charSet: specialChars },
  { charSet: diacritics1 },
  { charSet: diacritics2 },
  { charSet: extended },
];

/**
 * Calls genChars with predefined arguments. Length can be overwritten, requirements can be added.
 * Includes uppercase and lowercase letters
 *
 * @param {number} [length = 12] - Length of string. Default is 12.
 * @param {Requirement[]} additionalReqs - Additional requirements
 * @returns {string} A random character string
 * @example
 */
export function letters(
  length: number = 12,
  additionalReqs: Requirement[] = [],
): string {
  if (length === null) {
    length = 12;
  }

  return genChars(length, [...lettersCharSet, ...additionalReqs]);
}

/**
 * Calls genChars with predefined arguments. Length can be overwritten, requirements can be added.
 * Includes numbers
 *
 * @param {number} [length = 8] - Length of string. Default is 8.
 * @param {Requirement[]} additionalReqs - Additional requirements
 * @returns {string} A random character string
 */
export function numbers(
  length: number = 8,
  additionalReqs: Requirement[] = [],
): string {
  if (length === null) {
    length = 8;
  }

  const reqs = [{ charSet: "0123456789", min: 1 }];

  return genChars(length, [...reqs, ...additionalReqs]);
}

/**
 * Calls genChars with predefined arguments. Length can be overwritten, requirements can be added.
 * Includes uppercase and lowercase letters
 * Includes numbers
 * Includes special characters: !@#$%^&*
 *
 * @param {number} [length = 12] - Length of string. Default is 12.
 * @param {Requirement[]} additionalReqs - Additional requirements
 * @returns {string} A random character string
 */
export function level1(
  length: number = 12,
  additionalReqs: Requirement[] = [],
): string {
  if (length === null) {
    length = 12;
  }

  return genChars(length, [...level1CharSet, ...additionalReqs]);
}

/**
 * Calls genChars with predefined arguments. Length can be overwritten, requirements can be added.
 * Includes uppercase and lowercase letters
 * Includes numbers
 * Includes special characters: !@#$%^&*()-=_+[]{}|;':\",./<>?[SPACE]
 *
 * @param {number} [length = 12] - Length of string. Default is 12.
 * @param {Requirement[]} additionalReqs - Additional requirements
 * @returns {string} A random character string
 */
export function level2(
  length: number = 12,
  additionalReqs: Requirement[] = [],
): string {
  if (length === null) {
    length = 12;
  }

  return genChars(length, [...level2CharSet, ...additionalReqs]);
}

/**
 * Calls genChars with predefined arguments. Length can be overwritten, requirements can be added.
 * Includes everything from level2
 * Includes diacritics, more symbols and extended characters
 *
 * @param {number} [length = 16] - Length of string. Default is 16.
 * @param {Requirement[]} additionalReqs - Additional requirements
 * @returns {string} A random character string
 */
export function level3(
  length: number = 16,
  additionalReqs: Requirement[] = [],
): string {
  if (length === null) {
    length = 16;
  }

  return genChars(length, [...level3CharSet, ...additionalReqs]);
}
