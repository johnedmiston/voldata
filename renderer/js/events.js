// Event listeners and initialization

// Main event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', function () {
  // Event listener for apply filters button
  const applyFiltersBtn = document.getElementById('applyFiltersBtn');
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', applyFilters);
  }

  // Event listener for clear filters button
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', clearFilters);
  }

  // Event listener for toggle filters button
  const toggleFiltersBtn = document.getElementById('toggleFiltersBtn');
  if (toggleFiltersBtn) {
    toggleFiltersBtn.addEventListener('click', toggleFilters);
  }

  // Event listener for close profile button
  const closeProfileBtn = document.getElementById('closeProfileBtn');
  if (closeProfileBtn) {
    closeProfileBtn.addEventListener('click', closeVolunteerProfile);
  }

  // Close modal when clicking outside
  const profileModal = document.getElementById('profileModal');
  if (profileModal) {
    profileModal.addEventListener('click', function(event) {
      if (event.target === profileModal) {
        closeVolunteerProfile();
      }
    });
  }

  // Add event listeners for profile form
  document.addEventListener('click', function(event) {
    // Cancel button
    if (event.target.id === 'cancelProfileBtn') {
      closeVolunteerProfile();
    }
    
    // Save button
    if (event.target.id === 'saveProfileBtn') {
      event.preventDefault();
      const form = document.getElementById('profileForm');
      if (form) {
        // Get the original volunteer data from the modal
        const modal = document.getElementById('profileModal');
        const originalVolunteer = modal.dataset.volunteer ? JSON.parse(modal.dataset.volunteer) : null;
        if (originalVolunteer) {
          saveVolunteerProfile(originalVolunteer);
        }
      }
    }
  });

  // Add event listener for records per page selector
  document.addEventListener('change', function(event) {
    if (event.target.id === 'recordsPerPageSelect') {
      changeRecordsPerPage(event.target.value);
    }
  });

  // Add event listener for add volunteer button
  const addVolunteerBtn = document.getElementById('addVolunteerBtn');
  if (addVolunteerBtn) {
    addVolunteerBtn.addEventListener('click', showAddVolunteerModal);
  }

  // Add event listener for close add volunteer button
  const closeAddVolunteerBtn = document.getElementById('closeAddVolunteerBtn');
  if (closeAddVolunteerBtn) {
    closeAddVolunteerBtn.addEventListener('click', closeAddVolunteerModal);
  }

  // Close add volunteer modal when clicking outside
  const addVolunteerModal = document.getElementById('addVolunteerModal');
  if (addVolunteerModal) {
    addVolunteerModal.addEventListener('click', function(event) {
      if (event.target === addVolunteerModal) {
        closeAddVolunteerModal();
      }
    });
  }

  // Add event listeners for add volunteer form
  document.addEventListener('click', function(event) {
    // Cancel button for add volunteer
    if (event.target.id === 'cancelAddVolunteerBtn') {
      closeAddVolunteerModal();
    }
    
    // Save button for add volunteer
    if (event.target.id === 'saveAddVolunteerBtn') {
      event.preventDefault();
      addNewVolunteer();
    }
  });

  // Add event listener for clean phone numbers button
  const cleanPhoneNumbersBtn = document.getElementById('cleanPhoneNumbersBtn');
  if (cleanPhoneNumbersBtn) {
    cleanPhoneNumbersBtn.addEventListener('click', cleanPhoneNumbers);
  }
});

// Event listener for view records button
document.getElementById('viewRecordsBtn').addEventListener('click', async () => {
  const container = document.getElementById('recordsContainer');
  container.innerHTML = '<div class="loading">Loading records...</div>';

  try {
    allRecords = await window.electronAPI.getVolunteers();

    if (allRecords.length === 0) {
      container.innerHTML = '<div class="no-records">No records found.</div>';
      return;
    }

    // Populate status options
    populateStatusOptions(allRecords);

    // Initialize filtered records with all records
    filteredRecords = [...allRecords];

    // Apply current sorting if any
    if (currentSortColumn) {
      filteredRecords = sortRecords(filteredRecords, currentSortColumn, currentSortDirection);
    }

    // Render initial table
    currentPage = 1; // Reset to first page when loading records
    renderTable(filteredRecords);

  } catch (error) {
    container.innerHTML = `<div class="error-message">Error loading records: ${error.message}</div>`;
  }
}); 