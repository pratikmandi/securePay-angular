/** Strip non-digits from card number input */
function normalizeCardNumber(input) {
  if (input === undefined || input === null) return "";
  return String(input).replace(/\D/g, "");
}

function luhnCheck(digits) {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits.charAt(i), 10);
    if (Number.isNaN(n)) return false;
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

/** PAN length 13–19 and Luhn checksum (ISO/IEC 7812 style). */
function validateCardNumberDigits(normalized) {
  if (!normalized || normalized.length < 13 || normalized.length > 19) {
    return {
      ok: false,
      message: "Card number must be between 13 and 19 digits.",
    };
  }
  if (!luhnCheck(normalized)) {
    return {
      ok: false,
      message: "Card number is invalid (checksum failed).",
    };
  }
  return { ok: true };
}

/**
 * Expiry as MM/YY or MM/YYYY. Card is valid through the last moment of that month.
 */
function validateExpiry(expireDate) {
  const raw = String(expireDate || "").trim();
  const m = raw.match(/^(\d{2})\s*\/\s*(\d{2}|\d{4})$/);
  if (!m) {
    return { ok: false, message: "Expiry must be MM/YY (e.g. 09/28)." };
  }
  const month = parseInt(m[1], 10);
  let year = parseInt(m[2], 10);
  if (month < 1 || month > 12) {
    return { ok: false, message: "Invalid expiry month." };
  }
  if (m[2].length === 2) {
    year += 2000;
  }
  const expEnd = new Date(year, month, 0, 23, 59, 59, 999);
  if (Date.now() > expEnd.getTime()) {
    return { ok: false, message: "This card has expired." };
  }
  return { ok: true };
}

module.exports = {
  normalizeCardNumber,
  validateCardNumberDigits,
  validateExpiry,
  luhnCheck,
};
