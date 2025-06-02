import { getCountryCallingCode, parsePhoneNumberFromString, AsYouType, CountryCode as LibPhoneNumberCountryCode } from 'libphonenumber-js';
import ALL_FLAGS from 'country-flag-emoji-json'; // Make sure you've installed this: npm install country-flag-emoji-json

// Define a more specific type for your country objects
export interface CountryData {
  code: string; // The phone calling code, e.g., "1", "33", "212"
  name: string; // The full country name, e.g., "United States", "France", "Morocco"
  flag: string; // The flag emoji, e.g., "🇺🇸", "🇫🇷", "🇲🇦"
  iso2: LibPhoneNumberCountryCode; // The ISO 3166-1 alpha-2 code, e.g., "US", "FR", "MA"
}

// Map ALL_FLAGS to your desired format, adding the calling code from libphonenumber-js
export const countryCodes: CountryData[] = ALL_FLAGS.map(country => {
  let callingCode = '';
  try {
    // Corrected: Use country.code which is the ISO 3166-1 alpha-2 code from country-flag-emoji-json
    callingCode = getCountryCallingCode(country.code as LibPhoneNumberCountryCode);
  } catch (error) {
    // Some ISO codes might not have a direct calling code in libphonenumber-js (e.g., Antarctica, non-standard territories)
    // console.warn(`No calling code found for ${country.name} (${country.code}):`, error);
    // Filter out countries for which libphonenumber-js does not have a calling code
    return null;
  }

  return {
    code: callingCode,
    name: country.name,
    flag: country.emoji,
    iso2: country.code as LibPhoneNumberCountryCode, // Corrected: use country.code for iso2
  };
}).filter(country => country !== null) as CountryData[]; // Filter out nulls and assert type

// Helper to detect country from phone input string using libphonenumber-js
export const detectCountryFromPhone = (phone: string): CountryData | null => {
    // Attempt to parse the phone number with strict validation
    // Try with no default country first, then with selected country if available
    // Changed 'let phoneNumber' to 'const phoneNumber'
    const phoneNumber = parsePhoneNumberFromString(phone);

    if (phoneNumber && phoneNumber.isValid()) {
        const foundCountry = countryCodes.find(c => c.iso2 === phoneNumber.country);
        if (foundCountry) {
             return foundCountry;
        }
    }

    // Fallback: If strict parsing fails (e.g., partial number, or missing leading '+'),
    // try to find a country based on leading digits of the cleaned phone number.
    // This is less reliable for full validation but can give an initial hint for the dropdown.
    const cleanedPhone = phone.replace(/\D/g, ''); // Remove all non-digits

    // Iterate through country codes, prioritizing longer matches to avoid false positives
    // (e.g., if +1 is US, but +1242 is Bahamas, we want Bahamas if number starts with +1242)
    const sortedCountryCodes = [...countryCodes].sort((a, b) => b.code.length - a.code.length);

    for (const country of sortedCountryCodes) {
        // Ensure the cleaned phone number starts with the country's calling code
        // and is longer than just the code itself (implying a national number follows)
        if (cleanedPhone.startsWith(country.code) && cleanedPhone.length > country.code.length) {
            return country;
        }
    }

    return null;
};

// You might also want a formatter instance available if needed in other parts of your app
export const phoneNumberFormatter = new AsYouType();