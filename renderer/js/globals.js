// Global variables for the application
let allRecords = []; // Global variable to store all records
let filteredRecords = []; // Global variable to store filtered records
let currentPage = 1; // Current page
let recordsPerPage = 20; // Records per page
let totalPages = 1; // Total pages
let currentSortColumn = null; // Current column being sorted
let currentSortDirection = 'asc'; // Sort direction (asc/desc)

// Export to Excel function
async function exportToExcel() {
  const exportBtn = document.getElementById('exportDataBtn');
  const originalText = exportBtn ? exportBtn.textContent : '📊 Export to Excel';
  
  try {
    // Show loading state
    if (exportBtn) {
      exportBtn.textContent = '📊 Exporting...';
      exportBtn.disabled = true;
    }

    // Call the export function
    const result = await window.electronAPI.exportToExcel();

    if (result.success) {
      // Show success message
      showNotification(result.message, 'success');
    } else {
      // Show error message
      showNotification(result.error, 'error');
    }
  } catch (error) {
    showNotification(`Export failed: ${error.message}`, 'error');
  } finally {
    // Always restore button state, even if there was an error
    if (exportBtn) {
      exportBtn.textContent = originalText;
      exportBtn.disabled = false;
    }
  }
}

// Notification function
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 6px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    max-width: 400px;
    word-wrap: break-word;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease-out;
  `;
  
  // Set background color based on type
  if (type === 'success') {
    notification.style.backgroundColor = '#4caf50';
  } else if (type === 'error') {
    notification.style.backgroundColor = '#f44336';
  } else {
    notification.style.backgroundColor = '#2196f3';
  }
  
  // Add to page
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, 5000);
}

// Add CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
} 