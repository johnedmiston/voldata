const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '..', 'volunteers.db'));

// Create table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS volunteers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      phone TEXT,
      first_name TEXT,
      last_name TEXT,
      opportunity_title TEXT,
      connection_date TEXT,
      connection_status TEXT,
      shifts_selected TEXT,
      comments TEXT,
      street_address TEXT,
      street_address2 TEXT,
      city TEXT,
      state TEXT,
      zip TEXT,
      country TEXT
    )
  `);
  
  // Create indexes for better performance on duplicate checking
  db.run(`CREATE INDEX IF NOT EXISTS idx_email ON volunteers(email)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_phone ON volunteers(phone)`);
});

// Function to check for duplicate records
function checkDuplicate(volunteer) {
  return new Promise((resolve, reject) => {
    // Check for duplicates based on email or phone
    // A volunteer is considered duplicate if they have the same email OR phone
    const query = `
      SELECT id FROM volunteers 
      WHERE (email = ? AND email != '') 
         OR (phone = ? AND phone != '')
    `;
    
    db.get(query, [
      volunteer.email || '',
      volunteer.phone || ''
    ], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? true : false);
      }
    });
  });
}

// Function to check for exact duplicate (all fields match)
function checkExactDuplicate(volunteer) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id FROM volunteers 
      WHERE email = ? 
        AND phone = ? 
        AND first_name = ? 
        AND last_name = ? 
        AND opportunity_title = ? 
        AND connection_date = ? 
        AND connection_status = ? 
        AND shifts_selected = ? 
        AND comments = ? 
        AND street_address = ? 
        AND street_address2 = ? 
        AND city = ? 
        AND state = ? 
        AND zip = ? 
        AND country = ?
    `;
    
    db.get(query, [
      volunteer.email || '',
      volunteer.phone || '',
      volunteer.first_name || '',
      volunteer.last_name || '',
      volunteer.opportunity_title || '',
      volunteer.connection_date || '',
      volunteer.connection_status || '',
      volunteer.shifts_selected || '',
      volunteer.comments || '',
      volunteer.street_address || '',
      volunteer.street_address2 || '',
      volunteer.city || '',
      volunteer.state || '',
      volunteer.zip || '',
      volunteer.country || ''
    ], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? true : false);
      }
    });
  });
}

// Function to insert data with duplicate checking
function insertVolunteers(volunteers) {
  return new Promise(async (resolve, reject) => {
    try {
      let inserted = 0;
      let duplicates = 0;
      let exactDuplicates = 0;
      
      for (const volunteer of volunteers) {
        // Normalize volunteer data
        const normalizedVolunteer = {
          email: volunteer['Email'] || '',
          phone: volunteer['Phone'] || '',
          first_name: volunteer['First Name'] || '',
          last_name: volunteer['Last Name'] || '',
          opportunity_title: volunteer['Opportunity Title'] || '',
          connection_date: volunteer['Connection Date'] || '',
          connection_status: volunteer['Connection Status'] || '',
          shifts_selected: volunteer['Shifts Selected'] || '',
          comments: volunteer['Comments'] || '',
          street_address: volunteer['Street Address'] || '',
          street_address2: volunteer['Street Address 2'] || '',
          city: volunteer['City'] || '',
          state: volunteer['State'] || '',
          zip: volunteer['ZIP'] || '',
          country: volunteer['Country'] || ''
        };

        // Check for exact duplicate first
        const isExactDuplicate = await checkExactDuplicate(normalizedVolunteer);
        
        if (isExactDuplicate) {
          exactDuplicates++;
          continue;
        }

        // Check for potential duplicate (same email or phone)
        const isDuplicate = await checkDuplicate(normalizedVolunteer);
        
        if (isDuplicate) {
          duplicates++;
          continue;
        }

        // Insert new volunteer
        const stmt = db.prepare(`
          INSERT INTO volunteers (
            email, phone, first_name, last_name, opportunity_title,
            connection_date, connection_status, shifts_selected,
            comments, street_address, street_address2,
            city, state, zip, country
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
          normalizedVolunteer.email,
          normalizedVolunteer.phone,
          normalizedVolunteer.first_name,
          normalizedVolunteer.last_name,
          normalizedVolunteer.opportunity_title,
          normalizedVolunteer.connection_date,
          normalizedVolunteer.connection_status,
          normalizedVolunteer.shifts_selected,
          normalizedVolunteer.comments,
          normalizedVolunteer.street_address,
          normalizedVolunteer.street_address2,
          normalizedVolunteer.city,
          normalizedVolunteer.state,
          normalizedVolunteer.zip,
          normalizedVolunteer.country
        );

        stmt.finalize();
        inserted++;
      }

      resolve({
        success: true,
        inserted,
        duplicates,
        exactDuplicates,
        total: volunteers.length
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Function to add new volunteer
function addVolunteer(volunteer) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO volunteers (
        email, phone, first_name, last_name, opportunity_title,
        connection_date, connection_status, shifts_selected,
        comments, street_address, street_address2,
        city, state, zip, country
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      volunteer.email || '',
      volunteer.phone || '',
      volunteer.first_name || '',
      volunteer.last_name || '',
      volunteer.opportunity_title || '',
      volunteer.connection_date || '',
      volunteer.connection_status || '',
      volunteer.shifts_selected || '',
      volunteer.comments || '',
      volunteer.street_address || '',
      volunteer.street_address2 || '',
      volunteer.city || '',
      volunteer.state || '',
      volunteer.zip || '',
      volunteer.country || ''
    );

    stmt.finalize((err) => {
      if (err) {
        reject(err);
      } else {
        // Get the inserted volunteer with ID
        db.get('SELECT * FROM volunteers WHERE id = last_insert_rowid()', (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      }
    });
  });
}

// Function to update volunteer
function updateVolunteer(volunteer) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      UPDATE volunteers SET
        email = ?,
        phone = ?,
        first_name = ?,
        last_name = ?,
        opportunity_title = ?,
        connection_date = ?,
        connection_status = ?,
        shifts_selected = ?,
        comments = ?,
        street_address = ?,
        street_address2 = ?,
        city = ?,
        state = ?,
        zip = ?,
        country = ?
      WHERE id = ?
    `);

    stmt.run(
      volunteer.email || '',
      volunteer.phone || '',
      volunteer.first_name || '',
      volunteer.last_name || '',
      volunteer.opportunity_title || '',
      volunteer.connection_date || '',
      volunteer.connection_status || '',
      volunteer.shifts_selected || '',
      volunteer.comments || '',
      volunteer.street_address || '',
      volunteer.street_address2 || '',
      volunteer.city || '',
      volunteer.state || '',
      volunteer.zip || '',
      volunteer.country || '',
      volunteer.id
    );

    stmt.finalize((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Function to get import statistics
function getImportStats() {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as total FROM volunteers', (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.total);
      }
    });
  });
}

module.exports = { insertVolunteers, updateVolunteer, addVolunteer, getImportStats };
