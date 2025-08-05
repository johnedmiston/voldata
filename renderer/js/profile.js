// Profile-related functions

// Function to show volunteer profile
function showVolunteerProfile(volunteer) {
  const modal = document.getElementById('profileModal');
  const profileDetails = document.getElementById('profileDetails');
  
  // Create editable profile content
  const profileHTML = `
    <form id="profileForm">
      <div class="profile-section">
        <h3>${volunteer.first_name || ''} ${volunteer.last_name || ''}</h3>
        <p class="profile-subtitle">Volunteer</p>
      </div>
      
      <div class="profile-section">
        <h4>👤 Personal Information</h4>
        <div class="info-item">
          <span class="info-label">First Name:</span>
          <input type="text" class="info-input" name="first_name" value="${volunteer.first_name || ''}" placeholder="Enter first name">
        </div>
        <div class="info-item">
          <span class="info-label">Last Name:</span>
          <input type="text" class="info-input" name="last_name" value="${volunteer.last_name || ''}" placeholder="Enter last name">
        </div>
      </div>
      
      <div class="profile-section">
        <h4>📧 Contact Information</h4>
        <div class="info-item">
          <span class="info-label">Email:</span>
          <input type="email" class="info-input" name="email" value="${volunteer.email || ''}" placeholder="Enter email">
        </div>
        <div class="info-item">
          <span class="info-label">Phone:</span>
          <input type="tel" class="info-input" name="phone" value="${volunteer.phone || ''}" placeholder="Enter phone">
        </div>
      </div>
      
      <div class="profile-section">
        <h4>🏢 Opportunity Details</h4>
        <div class="info-item">
          <span class="info-label">Opportunity:</span>
          <input type="text" class="info-input" name="opportunity_title" value="${volunteer.opportunity_title || ''}" placeholder="Enter opportunity">
        </div>
        <div class="info-item">
          <span class="info-label">Status:</span>
          <select class="info-input" name="connection_status">
            <option value="">Select status</option>
            <option value="Active" ${volunteer.connection_status === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Inactive" ${volunteer.connection_status === 'Inactive' ? 'selected' : ''}>Inactive</option>
            <option value="Pending" ${volunteer.connection_status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Completed" ${volunteer.connection_status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </div>
        <div class="info-item">
          <span class="info-label">Connection Date:</span>
          <input type="date" class="info-input" name="connection_date" value="${volunteer.connection_date ? volunteer.connection_date.split('T')[0] : ''}">
        </div>
        <div class="info-item">
          <span class="info-label">Shifts Selected:</span>
          <input type="text" class="info-input" name="shifts_selected" value="${volunteer.shifts_selected || ''}" placeholder="Enter shifts">
        </div>
      </div>
      
      <div class="profile-section">
        <h4>📍 Address Information</h4>
        <div class="info-item">
          <span class="info-label">Street Address:</span>
          <input type="text" class="info-input" name="street_address" value="${volunteer.street_address || ''}" placeholder="Enter street address">
        </div>
        <div class="info-item">
          <span class="info-label">Street Address 2:</span>
          <input type="text" class="info-input" name="street_address2" value="${volunteer.street_address2 || ''}" placeholder="Enter street address 2">
        </div>
        <div class="info-item">
          <span class="info-label">City:</span>
          <input type="text" class="info-input" name="city" value="${volunteer.city || ''}" placeholder="Enter city">
        </div>
        <div class="info-item">
          <span class="info-label">State:</span>
          <input type="text" class="info-input" name="state" value="${volunteer.state || ''}" placeholder="Enter state">
        </div>
        <div class="info-item">
          <span class="info-label">ZIP:</span>
          <input type="text" class="info-input" name="zip" value="${volunteer.zip || ''}" placeholder="Enter ZIP">
        </div>
        <div class="info-item">
          <span class="info-label">Country:</span>
          <input type="text" class="info-input" name="country" value="${volunteer.country || ''}" placeholder="Enter country">
        </div>
      </div>
      
      <div class="profile-section">
        <h4>💬 Comments</h4>
        <div class="comments-input-container">
          <textarea class="comments-input" name="comments" placeholder="Enter comments">${volunteer.comments || ''}</textarea>
        </div>
      </div>
      
      <div class="profile-actions">
        <button type="button" id="cancelProfileBtn" class="cancel-profile-btn">Cancel</button>
        <button type="submit" id="saveProfileBtn" class="save-profile-btn">Save Changes</button>
      </div>
    </form>
  `;
 
  profileDetails.innerHTML = profileHTML;
  modal.style.display = 'flex';
  
  // Store original volunteer data for comparison
  modal.dataset.volunteer = JSON.stringify(volunteer);
}

// Function to close volunteer profile
function closeVolunteerProfile() {
  const modal = document.getElementById('profileModal');
  modal.style.display = 'none';
}

// Function to save volunteer profile changes
async function saveVolunteerProfile(originalVolunteer) {
  const form = document.getElementById('profileForm');
  const formData = new FormData(form);
  
  // Create updated volunteer object
  const updatedVolunteer = { ...originalVolunteer };
  
  // Update fields from form data
  for (let [key, value] of formData.entries()) {
    updatedVolunteer[key] = value;
  }
  
  try {
    // Save to database
    const result = await window.electronAPI.updateVolunteer(updatedVolunteer);
    
    if (result.success) {
      // Update the record in allRecords and filteredRecords
      const recordIndex = allRecords.findIndex(record => record.id === originalVolunteer.id);
      if (recordIndex !== -1) {
        allRecords[recordIndex] = updatedVolunteer;
        filteredRecords = [...allRecords];
        
        // Re-render the table to show updated data
        renderTable(filteredRecords);
        
        // Show success message
        showMessage('Profile updated successfully!', 'success');
      }
      
      // Close the modal
      closeVolunteerProfile();
    } else {
      // Show error message
      showMessage(`Error updating profile: ${result.error}`, 'error');
    }
  } catch (error) {
    console.error('Error saving volunteer profile:', error);
    showMessage('Error updating profile. Please try again.', 'error');
  }
}

// Function to show message
function showMessage(message, type = 'info') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}-message`;
  messageDiv.textContent = message;
  
  document.body.appendChild(messageDiv);
  
  // Remove message after 3 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
} 