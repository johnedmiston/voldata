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
            showMessage('✅ File imported successfully!', 'success');
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
  