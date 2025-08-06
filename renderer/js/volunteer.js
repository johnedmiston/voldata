// Volunteer management functions

// Function to show add volunteer modal
function showAddVolunteerModal() {
  const modal = document.getElementById('addVolunteerModal');
  modal.style.display = 'flex';
  
  // Reset form
  document.getElementById('addVolunteerForm').reset();
}

// Function to close add volunteer modal
function closeAddVolunteerModal() {
  const modal = document.getElementById('addVolunteerModal');
  modal.style.display = 'none';
}

// Function to add new volunteer
async function addNewVolunteer() {
  const form = document.getElementById('addVolunteerForm');
  const formData = new FormData(form);
  
  // Create volunteer object from form data
  const newVolunteer = {};
  for (let [key, value] of formData.entries()) {
    newVolunteer[key] = value;
  }
  
  try {
    // Add to database
    const result = await window.electronAPI.addVolunteer(newVolunteer);
    
    if (result.success) {
      // Add the new volunteer to allRecords and filteredRecords
      const addedVolunteer = result.volunteer;
      allRecords.push(addedVolunteer);
      filteredRecords = [...allRecords];
      
      // Re-render the table to show new data
      renderTable(filteredRecords);
      
      // Show success message
      showMessage('Volunteer added successfully!', 'success');
      
      // Close the modal
      closeAddVolunteerModal();
    } else {
      // Show error message
      showMessage(`Error adding volunteer: ${result.error}`, 'error');
    }
  } catch (error) {
    console.error('Error adding volunteer:', error);
    showMessage('Error adding volunteer. Please try again.', 'error');
  }
}

// Function to clean phone numbers in the database
async function cleanPhoneNumbers() {
  const button = document.getElementById('cleanPhoneNumbersBtn');
  const originalText = button.innerHTML;
  
  try {
    // Show loading state
    button.innerHTML = '⏳ Cleaning...';
    button.disabled = true;
    
    // Call the backend function
    const result = await window.electronAPI.cleanPhoneNumbers();
    
    if (result.success) {
      showMessage('Phone numbers cleaned successfully!', 'success');
      
      // Reload the records to show updated data
      if (allRecords.length > 0) {
        allRecords = await window.electronAPI.getVolunteers();
        filteredRecords = [...allRecords];
        
        // Re-render the table
        renderTable(filteredRecords);
      }
    } else {
      showMessage(`Error cleaning phone numbers: ${result.error}`, 'error');
    }
  } catch (error) {
    console.error('Error cleaning phone numbers:', error);
    showMessage('Error cleaning phone numbers. Please try again.', 'error');
  } finally {
    // Restore button
    button.innerHTML = originalText;
    button.disabled = false;
  }
} 