const fs = require('fs');

const inputFile = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\b2de37be-9e67-4e52-96e0-02a56136b8ab\\.system_generated\\steps\\27\\content.md';
const content = fs.readFileSync(inputFile, 'utf-8');
const lines = content.split('\n');

const rows = [];
let count = 0;

for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    if (line.includes('The above content shows')) break;
    
    count++;
    const actualLine = line; // No line numbers in actual file!
    
    if (actualLine.startsWith('Source:') || actualLine.startsWith('---') || actualLine === '') continue;

    const cols = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < actualLine.length; i++) {
        const char = actualLine[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            cols.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    cols.push(current);

    if (cols.length < 5) continue;
    if (cols[0].includes('-March') && cols[1] === '') continue;

    const rawName = cols[0].trim();
    const rawCompany = cols[1].trim();
    const rawSource = cols[2].trim();
    const rawPhone = cols[3].trim();
    let rawStatus = cols[4] ? cols[4].trim() : '';

    if (!rawCompany && !rawName) continue; // Empty row

    // Name: If none, use Company.
    const name = rawName || rawCompany || 'Unknown';
    const company = rawCompany;
    let phone = rawPhone.trim();
    
    // If phone is missing or 'DM', use a placeholder
    if (!phone || phone.toLowerCase() === 'dm') {
        phone = '00000000dm';
    }
    
    const email = `no-email-${Math.floor(Math.random()*10000)}@placeholder.com`; 
    const source = rawSource || 'Bulk Upload';
    
    let status = 'New';
    const sLower = rawStatus.toLowerCase();
    if (sLower.includes('done') || sLower.includes('won')) status = 'Won';
    else if (sLower.includes('not interested') || sLower.includes('switch off') || sLower.includes('wrong num') || sLower.includes('cut the call') || sLower.includes('out of service')) status = 'Lost';
    else if (sLower.includes('call back') || sLower.includes('if need call') || sLower.includes('waiting') || sLower.includes('rnr') || sLower.includes('busy')) status = 'Contacted';
    
    rows.push(`"${name}","${email}","${phone}","${company}","${source}","${status}"`);
}

const outputFile = 'C:\\Users\\User\\.gemini\\antigravity\\artifacts\\formatted_leads_ready_for_import.csv';
// Ensure dir exists
if (!fs.existsSync('C:\\Users\\User\\.gemini\\antigravity\\artifacts')) {
    fs.mkdirSync('C:\\Users\\User\\.gemini\\antigravity\\artifacts', { recursive: true });
}
fs.writeFileSync(outputFile, 'name,email,phone,company,source,status\n' + rows.join('\n'));
console.log('Processed', count, 'lines.');
console.log('Successfully written', rows.length, 'leads to', outputFile);
