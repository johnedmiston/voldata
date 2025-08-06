const XLSX = require('xlsx');

function parseSpreadsheet(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  
  // Processar os dados para corrigir problemas com números de telefone
  return data.map(row => {
    const processedRow = { ...row };
    
    // Tratar especificamente a coluna de telefone
    if (processedRow['Phone'] !== undefined) {
      // Converter para string e remover .0 se presente
      let phoneStr = String(processedRow['Phone']);
      
      // Remover .0 no final se presente
      if (phoneStr.endsWith('.0')) {
        phoneStr = phoneStr.slice(0, -2);
      }
      
      // Se o número não começa com + mas deveria, adicionar
      if (phoneStr && !phoneStr.startsWith('+') && !phoneStr.startsWith('0') && phoneStr.length > 10) {
        // Assumir que é um número americano se não tiver código de país
        if (phoneStr.length === 11 && phoneStr.startsWith('1')) {
          phoneStr = '+' + phoneStr;
        } else if (phoneStr.length === 10) {
          phoneStr = '+1' + phoneStr;
        }
      }
      
      processedRow['Phone'] = phoneStr;
    }
    
    return processedRow;
  });
}

module.exports = { parseSpreadsheet };
