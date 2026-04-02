const fs = require('fs');
const readline = require('readline');

const inputFile = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\b2de37be-9e67-4e52-96e0-02a56136b8ab\\.system_generated\\steps\\27\\content.md';
const outputFile = 'C:\\Users\\User\\.gemini\\antigravity\\artifacts\\formatted_leads_ready_for_import.csv';

async function processLeads() {
  const fileStream = fs.createReadStream(inputFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let skipLines = 4; // Skip the metadata from markdown
  const rows = [];
  
  for await (const line of rl) {
    if (skipLines > 0) {
      if (line.startsWith('---')) skipLines--; // Just find the beginning of data or skip manually
      // Actually, line 1-4 is markdown info, data starts at line 5
      continue;
    }
    
    // Check if it's the start of the data
    if (line.startsWith('Source: ') || line.trim() === '---' || line.trim() === '') {
        continue;
    }
    
    // Stop at the bottom artifact notes
    if (line.includes('The above content shows')) break;

    // Remove the line number prefix (e.g., "5: 3-March,,,,")
    const match = line.match(/^\d+:\s(.*)/);
    if (!match) continue;
    
    const actualLine = match[1];
    
    // Split by comma manually, respecting quotes if needed, 
    // but a simple regex is better for rudimentary CSVs or just split
    // Actually, splitting CSV with quotes is tricky. 
    // Let's use a basic regex or just split and clean.
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

    if (cols.length < 5) continue; // skip bad lines

    // Date header rows like "3-March,,,,,"
    if (cols[0].includes('-March') && cols[1] === '') continue;

    const rawName = cols[0].trim();
    const rawCompany = cols[1].trim();
    const rawSource = cols[2].trim();
    const rawPhone = cols[3].trim();
    let rawStatus = cols[4] ? cols[4].trim() : '';

    if (!rawCompany && !rawName) continue; // Empty row

    // Logic:
    // Name: If none, use Company. Or "Unknown"
    const name = rawName || rawCompany || 'Unknown';
    const company = rawCompany;
    const phone = rawPhone || '0000000000';
    const email = `no-email-${Math.floor(Math.random()*10000)}@placeholder.com`; // Placeholder
    const source = rawSource || 'Bulk Upload';
    
    // Map status:
    // Expected: 'New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'
    let status = 'New';
    const sLower = rawStatus.toLowerCase();
    if (sLower.includes('done') || sLower.includes('won')) status = 'Won';
    else if (sLower.includes('not interested') || sLower.includes('switch off') || sLower.includes('wrong num') || sLower.includes('cut the call') || sLower.includes('out of service')) status = 'Lost';
    else if (sLower.includes('call back') || sLower.includes('if need call') || sLower.includes('waiting') || sLower.includes('rnr') || sLower.includes('busy')) status = 'Contacted';
    
    rows.push(`"${name}","${email}","${phone}","${company}","${source}","${status}"`);
  }

  // Write header
  const out = fs.createWriteStream(outputFile);
  out.write('name,email,phone,company,source,status\n');
  rows.forEach(r => out.write(r + '\n'));
  out.end();
  
  console.log('Successfully written', rows.length, 'leads to', outputFile);
}

processLeads().catch(console.error);
