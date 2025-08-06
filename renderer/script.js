// File import functionality
document.getElementById('fileInput').addEventListener('click', async (e) => {
    e.preventDefault();
    
    // Add loading state to button
    const button = e.target;
    const originalText = button.innerHTML;
    button.innerHTML = '⏳ Processing...';
    button.disabled = true;
    
    try {
        const result = await window.electronAPI.selectFile();
        if (result.success) {
            showMessage(result.message, 'success');
            
            // Show detailed information if available
            if (result.details) {
                const details = result.details;
                const detailMessage = `
                    📊 Import Summary:
                    • Total records processed: ${details.total}
                    • Records inserted: ${details.inserted}
                    • Duplicates found: ${details.duplicates}
                    • Identical records ignored: ${details.exactDuplicates}
                `;
                console.log(detailMessage);
                
                // Get updated database statistics
                try {
                    const stats = await window.electronAPI.getImportStats();
                    if (stats.success) {
                        console.log(`📈 Total records in database: ${stats.totalRecords}`);
                    }
                } catch (error) {
                    console.error('Error getting statistics:', error);
                }
            }
        } else {
            showMessage('❌ Error importing file: ' + result.error, 'error');
        }
    } catch (error) {
        showMessage('❌ Error processing file: ' + error.message, 'error');
    } finally {
        // Restore button
        button.innerHTML = originalText;
        button.disabled = false;
    }
});
  