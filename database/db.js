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
});

// Function to insert data
function insertVolunteers(volunteers) {
  const stmt = db.prepare(`
    INSERT INTO volunteers (
      email, phone, first_name, last_name, opportunity_title,
      connection_date, connection_status, shifts_selected,
      comments, street_address, street_address2,
      city, state, zip, country
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  volunteers.forEach(v => {
    stmt.run(
      v['Email'] || '',
      v['Phone'] || '',
      v['First Name'] || '',
      v['Last Name'] || '',
      v['Opportunity Title'] || '',
      v['Connection Date'] || '',
      v['Connection Status'] || '',
      v['Shifts Selected'] || '',
      v['Comments'] || '',
      v['Street Address'] || '',
      v['Street Address 2'] || '',
      v['City'] || '',
      v['State'] || '',
      v['ZIP'] || '',
      v['Country'] || ''
    );
  });

  stmt.finalize();
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

module.exports = { insertVolunteers, updateVolunteer, addVolunteer };
