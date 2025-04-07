export function extractDates(content) {
    // Extract the two dates separated by a dash
    const match = content.match(/(\d{2}\.\d{2}\.(\d{2}))-(\d{2}\.\d{2}\.\d{4})/);
    
    if (match) {
        // Extract day, month, and two-digit year for the first date
        let firstDate = match[1];
        const secondDate = match[3];
        
        // Extract the year part from the first date
        const yearSuffix = parseInt(match[2], 10);
        
        // Determine the full year for the first date
        if (yearSuffix > 25) {
            firstDate = `${firstDate.slice(0, 6)}19${yearSuffix.toString().padStart(2, '0')}`;
        } else {
            firstDate = `${firstDate.slice(0, 6)}20${yearSuffix.toString().padStart(2, '0')}`;
        }
        
        return [firstDate, secondDate];
    } else {
        return [null, null];
    }
}

export function romanianToLatin(input) {
  const romanianToLatinMap = {
    'ă': 'a',
    'Ă': 'A',
    'â': 'a',
    'Â': 'A',
    'î': 'i',
    'Î': 'I',
    'ș': 's',
    'ş': 's',
    'Ș': 'S',
    'Ş': 'S',
    'ț': 't',
    'ţ': 't',
    'Ț': 'T',
    'Ţ': 'T'
  };

  return input.split('').map(char => romanianToLatinMap[char] || char).join('');
}

// replace the new line with a dash
export function replaceNewLineWithDash(input) {
  return input.replace(/\n/g, '-');
}
