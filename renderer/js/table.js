// Table rendering functions

// Function to render table with pagination
function renderTable(records) {
  const container = document.getElementById('recordsContainer');
  
  if (records.length === 0) {
    container.innerHTML = '<div class="no-records">No records found.</div>';
    return;
  }

  // Calculate pagination
  let currentPageRecords;
  if (recordsPerPage === Infinity) {
    // Show all records when "All" is selected
    totalPages = 1;
    currentPage = 1;
    currentPageRecords = records;
  } else {
    totalPages = Math.ceil(records.length / recordsPerPage);
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }
    if (currentPage < 1) {
      currentPage = 1;
    }

    // Get records for current page
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    currentPageRecords = records.slice(startIndex, endIndex);
  }

  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'table-wrapper';

  const table = document.createElement('table');

  // Header
  const headerRow = document.createElement('tr');
  Object.keys(records[0]).forEach(key => {
    const th = document.createElement('th');
    th.className = 'sortable-header';
    th.style.cursor = 'pointer';
    
    // Create header content with sort indicator
    const headerContent = document.createElement('div');
    headerContent.style.display = 'flex';
    headerContent.style.alignItems = 'center';
    headerContent.style.justifyContent = 'space-between';
    
    const headerText = document.createElement('span');
    headerText.textContent = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    const sortIndicator = document.createElement('span');
    sortIndicator.className = 'sort-indicator';
    sortIndicator.innerHTML = '↕';
    sortIndicator.style.fontSize = '12px';
    sortIndicator.style.marginLeft = '5px';
    sortIndicator.style.opacity = '0.5';
    
    // Update sort indicator if this column is currently sorted
    if (currentSortColumn === key) {
      sortIndicator.innerHTML = currentSortDirection === 'asc' ? '↑' : '↓';
      sortIndicator.style.opacity = '1';
      th.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    }
    
    headerContent.appendChild(headerText);
    headerContent.appendChild(sortIndicator);
    th.appendChild(headerContent);
    
    // Add click event for sorting
    th.onclick = function() {
      if (currentSortColumn === key) {
        // Toggle direction if same column
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        // New column, start with ascending
        currentSortColumn = key;
        currentSortDirection = 'asc';
      }
      
      // Sort the records
      const sortedRecords = sortRecords([...filteredRecords], key, currentSortDirection);
      filteredRecords = sortedRecords;
      
      // Reset to first page when sorting
      currentPage = 1;
      
      // Re-render the table
      renderTable(filteredRecords);
    };
    
    // Set specific widths for different column types
    if (key.toLowerCase().includes('email')) {
      th.style.width = '200px';
      th.style.minWidth = '200px';
    } else if (key.toLowerCase().includes('name')) {
      th.style.width = '150px';
      th.style.minWidth = '150px';
    } else if (key.toLowerCase().includes('phone')) {
      th.style.width = '130px';
      th.style.minWidth = '130px';
    } else if (key.toLowerCase().includes('date')) {
      th.style.width = '120px';
      th.style.minWidth = '120px';
    } else if (key.toLowerCase().includes('address')) {
      th.style.width = '180px';
      th.style.minWidth = '180px';
    } else if (key.toLowerCase().includes('comment')) {
      th.style.width = '300px';
      th.style.minWidth = '150px';
      th.classList.add('comment-column');
    } else {
      th.style.width = '120px';
      th.style.minWidth = '120px';
    }
    headerRow.appendChild(th);
  });
   
  // Add Actions header
  const actionsTh = document.createElement('th');
  actionsTh.textContent = 'Actions';
  actionsTh.style.width = '120px';
  actionsTh.style.minWidth = '120px';
  actionsTh.style.textAlign = 'center';
  headerRow.appendChild(actionsTh);
  table.appendChild(headerRow);

  // Rows
  currentPageRecords.forEach(record => {
    const row = document.createElement('tr');
    Object.values(record).forEach((value, index) => {
      const td = document.createElement('td');
      const key = Object.keys(records[0])[index];

      // Special treatment for comment columns
      if (key.toLowerCase().includes('comment')) {
        td.style.width = '300px';
        td.style.minWidth = '150px';
        td.classList.add('comment-column');

        if (value && value !== '-') {
          const maxLength = 100; // Maximum characters to display

          if (value.length > maxLength) {
            // Create container for truncated text
            const textContainer = document.createElement('div');
            textContainer.className = 'comment-text-container';

            // Truncated text
            const truncatedText = document.createElement('span');
            truncatedText.className = 'comment-text-truncated';
            truncatedText.textContent = value.substring(0, maxLength) + '...';

            // Full text (initially hidden)
            const fullText = document.createElement('span');
            fullText.className = 'comment-text-full';
            fullText.textContent = value;
            fullText.style.display = 'none';

            // Expand button
            const expandBtn = document.createElement('button');
            expandBtn.className = 'expand-comment-btn';
            expandBtn.textContent = 'See More';
            expandBtn.onclick = function () {
              if (fullText.style.display === 'none') {
                fullText.style.display = 'inline';
                truncatedText.style.display = 'none';
                expandBtn.textContent = 'See Less';
              } else {
                fullText.style.display = 'none';
                truncatedText.style.display = 'inline';
                expandBtn.textContent = 'See More';
              }
            };

            textContainer.appendChild(truncatedText);
            textContainer.appendChild(fullText);
            textContainer.appendChild(expandBtn);
            td.appendChild(textContainer);
          } else {
            td.textContent = value;
          }
        } else {
          td.textContent = '-';
        }
      } else {
        // Format date values to remove 'T' and time component
        let displayValue = value || '-';
        if (key.toLowerCase().includes('date') && value && value !== '-') {
          // Remove 'T' and time component from date strings
          if (typeof value === 'string' && value.includes('T')) {
            displayValue = value.split('T')[0];
          }
        }
        
        td.textContent = displayValue;
        // Apply same widths as headers
        if (key.toLowerCase().includes('email')) {
          td.style.width = '200px';
          td.style.minWidth = '200px';
        } else if (key.toLowerCase().includes('name')) {
          td.style.width = '150px';
          td.style.minWidth = '150px';
        } else if (key.toLowerCase().includes('phone')) {
          td.style.width = '130px';
          td.style.minWidth = '130px';
        } else if (key.toLowerCase().includes('date')) {
          td.style.width = '120px';
          td.style.minWidth = '120px';
        } else if (key.toLowerCase().includes('address')) {
          td.style.width = '180px';
          td.style.minWidth = '180px';
        } else {
          td.style.width = '120px';
          td.style.minWidth = '120px';
        }
      }
      row.appendChild(td);
    });
    
    // Add View Profile button
    const actionTd = document.createElement('td');
    actionTd.style.width = '120px';
    actionTd.style.minWidth = '120px';
    actionTd.style.textAlign = 'center';
    
    const viewProfileBtn = document.createElement('button');
    viewProfileBtn.className = 'view-profile-btn';
    viewProfileBtn.textContent = '👤 View Profile';
    viewProfileBtn.onclick = function() {
      showVolunteerProfile(record);
    };
    
    actionTd.appendChild(viewProfileBtn);
    row.appendChild(actionTd);
    table.appendChild(row);
  });

  tableWrapper.appendChild(table);
  
  // Add pagination controls
  const paginationContainer = createPaginationControls(records.length);
  
  container.innerHTML = '';
  container.appendChild(tableWrapper);
  container.appendChild(paginationContainer);
} 