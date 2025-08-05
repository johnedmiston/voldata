# Volunteer Management System

A comprehensive Electron application for managing volunteer data with advanced filtering, sorting, and editing capabilities.

## Features

- **Data Import**: Import volunteer data from Excel files
- **Advanced Filtering**: Filter by email, phone, name, opportunity, status, location, and date ranges
- **Column Sorting**: Click on column headers to sort data alphabetically
- **Pagination**: Navigate through large datasets with customizable records per page
- **Profile Management**: View and edit volunteer profiles in a modal interface
- **Add New Volunteers**: Manually add new volunteers through a form interface
- **Responsive Design**: Works on different screen sizes
- **Database Persistence**: All changes are saved to SQLite database

## Project Structure

```
Application/
├── database/
│   └── db.js                 # SQLite database operations
├── renderer/
│   ├── js/                   # JavaScript modules
│   │   ├── globals.js        # Global variables
│   │   ├── filters.js        # Filter functionality
│   │   ├── table.js          # Table rendering and sorting
│   │   ├── pagination.js     # Pagination controls
│   │   ├── profile.js        # Profile modal and editing
│   │   ├── volunteer.js      # Volunteer management
│   │   └── events.js         # Event listeners
│   ├── index.html            # Main HTML structure
│   ├── style.css             # Styling
│   └── script.js             # File import functionality
├── main.js                   # Electron main process
├── preload.js                # IPC bridge
└── package.json              # Dependencies and scripts
```

## JavaScript Modules

### `globals.js`
Contains all global variables used throughout the application:
- `allRecords`: All volunteer records
- `filteredRecords`: Currently filtered records
- `currentPage`, `recordsPerPage`, `totalPages`: Pagination state
- `currentSortColumn`, `currentSortDirection`: Sorting state

### `filters.js`
Handles all filtering functionality:
- `applyFilters()`: Apply current filter criteria
- `clearFilters()`: Reset all filters
- `toggleFilters()`: Show/hide filter section
- `populateStatusOptions()`: Populate status dropdown
- `sortRecords()`: Sort records by column

### `table.js`
Manages table rendering and display:
- `renderTable()`: Main table rendering function
- Handles comment truncation with expand/collapse
- Creates sortable headers with visual indicators
- Adds "View Profile" buttons to each row

### `pagination.js`
Controls pagination functionality:
- `createPaginationControls()`: Generate pagination UI
- `goToPage()`: Navigate to specific page
- `changeRecordsPerPage()`: Change records per page

### `profile.js`
Manages volunteer profile functionality:
- `showVolunteerProfile()`: Display profile modal
- `closeVolunteerProfile()`: Close profile modal
- `saveVolunteerProfile()`: Save profile changes to database
- `showMessage()`: Display user feedback messages

### `volunteer.js`
Handles new volunteer creation:
- `showAddVolunteerModal()`: Display add volunteer modal
- `closeAddVolunteerModal()`: Close add volunteer modal
- `addNewVolunteer()`: Add new volunteer to database

### `events.js`
Contains all event listeners and initialization:
- DOM content loaded event listeners
- Button click handlers
- Form submission handlers
- Modal interaction handlers

## Key Features

### Filtering System
- Real-time filtering across multiple fields
- Date range filtering
- Status dropdown with dynamic options
- Collapsible filter interface

### Sorting System
- Click any column header to sort
- Visual indicators show sort direction
- Maintains sorting when applying filters

### Pagination
- Configurable records per page (10, 20, 50, 100, All)
- Page navigation with ellipsis for large datasets
- Records counter showing current range

### Profile Management
- Editable volunteer profiles
- Form validation
- Database persistence
- Success/error feedback

### Responsive Design
- Mobile-friendly layout
- Collapsible filter section
- Adaptive modal sizing

## Usage

1. **Import Data**: Click "Select Excel File" to import volunteer data
2. **View Records**: Click "View Records" to load data from database
3. **Filter Data**: Use the filter section to narrow down results
4. **Sort Data**: Click column headers to sort by that field
5. **Navigate**: Use pagination controls to browse large datasets
6. **Edit Profiles**: Click "View Profile" to edit volunteer information
7. **Add Volunteers**: Click "Add New Volunteer" to create new records

## Technical Details

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Electron with Node.js
- **Database**: SQLite with sqlite3 module
- **File Processing**: xlsx module for Excel file parsing
- **Architecture**: Modular JavaScript with separation of concerns

## Development

The project has been refactored for better maintainability:
- Separated concerns into logical modules
- Clean HTML structure without embedded JavaScript
- Reusable functions across modules
- Clear naming conventions
- Comprehensive error handling 