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