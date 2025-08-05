// Filter-related functions

// Function to sort records
function sortRecords(records, column, direction) {
  return records.sort((a, b) => {
    let aValue = a[column] || '';
    let bValue = b[column] || '';
    
    // Convert to string for comparison
    aValue = String(aValue).toLowerCase();
    bValue = String(bValue).toLowerCase();
    
    if (direction === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });
}

// Function to apply filters
function applyFilters() {
  const emailFilter = document.getElementById('emailFilter').value.toLowerCase();
  const phoneFilter = document.getElementById('phoneFilter').value.toLowerCase();
  const firstNameFilter = document.getElementById('firstNameFilter').value.toLowerCase();
  const lastNameFilter = document.getElementById('lastNameFilter').value.toLowerCase();
  const opportunityFilter = document.getElementById('opportunityFilter').value.toLowerCase();
  const statusFilter = document.getElementById('statusFilter').value.toLowerCase();
  const cityFilter = document.getElementById('cityFilter').value.toLowerCase();
  const stateFilter = document.getElementById('stateFilter').value.toLowerCase();
  const countryFilter = document.getElementById('countryFilter').value.toLowerCase();
  const commentsFilter = document.getElementById('commentsFilter').value.toLowerCase();
  const dateFromFilter = document.getElementById('dateFromFilter').value;
  const dateToFilter = document.getElementById('dateToFilter').value;

  filteredRecords = allRecords.filter(record => {
    // Email filter
    if (emailFilter && !record.email?.toLowerCase().includes(emailFilter)) return false;
    
    // Phone filter
    if (phoneFilter && !record.phone?.toLowerCase().includes(phoneFilter)) return false;
    
    // First name filter
    if (firstNameFilter && !record.first_name?.toLowerCase().includes(firstNameFilter)) return false;
    
    // Last name filter
    if (lastNameFilter && !record.last_name?.toLowerCase().includes(lastNameFilter)) return false;
    
    // Opportunity filter
    if (opportunityFilter && !record.opportunity_title?.toLowerCase().includes(opportunityFilter)) return false;
    
    // Status filter
    if (statusFilter && record.connection_status?.toLowerCase() !== statusFilter) return false;
    
    // City filter
    if (cityFilter && !record.city?.toLowerCase().includes(cityFilter)) return false;
    
    // State filter
    if (stateFilter && !record.state?.toLowerCase().includes(stateFilter)) return false;
    
    // Country filter
    if (countryFilter && !record.country?.toLowerCase().includes(countryFilter)) return false;
    
    // Comments filter
    if (commentsFilter && !record.comments?.toLowerCase().includes(commentsFilter)) return false;
    
    // Date filter
    if (dateFromFilter || dateToFilter) {
      const connectionDate = new Date(record.connection_date);
      if (dateFromFilter && connectionDate < new Date(dateFromFilter)) return false;
      if (dateToFilter && connectionDate > new Date(dateToFilter + 'T23:59:59')) return false;
    }
    
    return true;
  });

  currentPage = 1;
  
  // Apply current sorting if any
  if (currentSortColumn) {
    filteredRecords = sortRecords(filteredRecords, currentSortColumn, currentSortDirection);
  }
  
  renderTable(filteredRecords);
}

// Function to clear filters
function clearFilters() {
  document.getElementById('emailFilter').value = '';
  document.getElementById('phoneFilter').value = '';
  document.getElementById('firstNameFilter').value = '';
  document.getElementById('lastNameFilter').value = '';
  document.getElementById('opportunityFilter').value = '';
  document.getElementById('statusFilter').value = '';
  document.getElementById('cityFilter').value = '';
  document.getElementById('stateFilter').value = '';
  document.getElementById('countryFilter').value = '';
  document.getElementById('commentsFilter').value = '';
  document.getElementById('dateFromFilter').value = '';
  document.getElementById('dateToFilter').value = '';
  
  filteredRecords = [...allRecords];
  currentPage = 1; // Reset to first page when clearing filters
  
  // Apply current sorting if any
  if (currentSortColumn) {
    filteredRecords = sortRecords(filteredRecords, currentSortColumn, currentSortDirection);
  }
  
  renderTable(filteredRecords);
}

// Function to toggle filters visibility
function toggleFilters() {
  const filtersContent = document.getElementById('filtersContent');
  const toggleBtn = document.getElementById('toggleFiltersBtn');
  
  if (filtersContent.classList.contains('collapsed')) {
    filtersContent.classList.remove('collapsed');
    toggleBtn.textContent = '▼ Hide Filters';
  } else {
    filtersContent.classList.add('collapsed');
    toggleBtn.textContent = '▶ Show Filters';
  }
}

// Function to populate status options
function populateStatusOptions(records) {
  const statusFilter = document.getElementById('statusFilter');
  const statuses = [...new Set(records.map(record => record.connection_status).filter(Boolean))];
  
  // Clear existing options (except the first one)
  while (statusFilter.children.length > 1) {
    statusFilter.removeChild(statusFilter.lastChild);
  }
  
  // Add new options
  statuses.forEach(status => {
    const option = document.createElement('option');
    option.value = status.toLowerCase();
    option.textContent = status;
    statusFilter.appendChild(option);
  });
} 