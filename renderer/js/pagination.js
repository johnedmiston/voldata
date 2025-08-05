// Pagination-related functions

// Function to create pagination controls
function createPaginationControls(totalRecords) {
  const paginationContainer = document.createElement('div');
  paginationContainer.className = 'pagination-container';

  // Records info
  const recordsInfo = document.createElement('div');
  recordsInfo.className = 'records-info';
  
  let startRecord, endRecord;
  if (recordsPerPage === Infinity) {
    startRecord = 1;
    endRecord = totalRecords;
  } else {
    startRecord = (currentPage - 1) * recordsPerPage + 1;
    endRecord = Math.min(currentPage * recordsPerPage, totalRecords);
  }
  
  recordsInfo.innerHTML = `Showing ${startRecord}-${endRecord} of ${totalRecords} records`;
  paginationContainer.appendChild(recordsInfo);

  // Records per page selector
  const recordsPerPageContainer = document.createElement('div');
  recordsPerPageContainer.className = 'records-per-page';
  recordsPerPageContainer.innerHTML = `
    <label for="recordsPerPageSelect">Records per page:</label>
    <select id="recordsPerPageSelect">
      <option value="10" ${recordsPerPage === 10 ? 'selected' : ''}>10</option>
      <option value="20" ${recordsPerPage === 20 ? 'selected' : ''}>20</option>
      <option value="50" ${recordsPerPage === 50 ? 'selected' : ''}>50</option>
      <option value="100" ${recordsPerPage === 100 ? 'selected' : ''}>100</option>
      <option value="all" ${recordsPerPage === Infinity ? 'selected' : ''}>All</option>
    </select>
  `;
  paginationContainer.appendChild(recordsPerPageContainer);

  // Pagination controls
  const paginationControls = document.createElement('div');
  paginationControls.className = 'pagination-controls';

  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'pagination-btn';
  prevBtn.textContent = '← Previous';
  prevBtn.disabled = currentPage === 1 || recordsPerPage === Infinity;
  prevBtn.onclick = () => goToPage(currentPage - 1);
  paginationControls.appendChild(prevBtn);

  // Page numbers (only show when not showing all records)
  if (recordsPerPage !== Infinity) {
    const pageNumbersContainer = document.createElement('div');
    pageNumbersContainer.className = 'page-numbers';

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      const firstPageBtn = document.createElement('button');
      firstPageBtn.className = 'pagination-btn page-number';
      firstPageBtn.textContent = '1';
      firstPageBtn.onclick = () => goToPage(1);
      pageNumbersContainer.appendChild(firstPageBtn);

      if (startPage > 2) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'page-ellipsis';
        ellipsis.textContent = '...';
        pageNumbersContainer.appendChild(ellipsis);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `pagination-btn page-number ${i === currentPage ? 'active' : ''}`;
      pageBtn.textContent = i;
      pageBtn.onclick = () => goToPage(i);
      pageNumbersContainer.appendChild(pageBtn);
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'page-ellipsis';
        ellipsis.textContent = '...';
        pageNumbersContainer.appendChild(ellipsis);
      }

      const lastPageBtn = document.createElement('button');
      lastPageBtn.className = 'pagination-btn page-number';
      lastPageBtn.textContent = totalPages;
      lastPageBtn.onclick = () => goToPage(totalPages);
      pageNumbersContainer.appendChild(lastPageBtn);
    }

    paginationControls.appendChild(pageNumbersContainer);
  }

  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'pagination-btn';
  nextBtn.textContent = 'Next →';
  nextBtn.disabled = currentPage === totalPages || recordsPerPage === Infinity;
  nextBtn.onclick = () => goToPage(currentPage + 1);
  paginationControls.appendChild(nextBtn);

  paginationContainer.appendChild(paginationControls);

  return paginationContainer;
}

// Function to go to a specific page
function goToPage(page) {
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderTable(filteredRecords);
  }
}

// Function to change records per page
function changeRecordsPerPage(newRecordsPerPage) {
  if (newRecordsPerPage === 'all') {
    recordsPerPage = Infinity;
  } else {
    recordsPerPage = parseInt(newRecordsPerPage);
  }
  currentPage = 1; // Reset to first page
  renderTable(filteredRecords);
} 