// const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQePGwcJ5VJmMFp1qVMYVl0RpwfV3v2ipiN4fkys9HQlJjKTIhzHI56kqOdXyvpPNLs4BpTsRaVLemG/pub?output=csv';


let currentIndex = 0;
let statuses = [];

// Function to load statuses from Google Sheets CSV
function loadStatusesFromCSV() {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQePGwcJ5VJmMFp1qVMYVl0RpwfV3v2ipiN4fkys9HQlJjKTIhzHI56kqOdXyvpPNLs4BpTsRaVLemG/pub?output=csv';
    
    showLoading(true);  // Show loading indicator

    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            statuses = parseCSV(data); // Parse the CSV data
            updateStatus();  // Display the first status after loading
            showLoading(false);  // Hide loading indicator once data is loaded
        })
        .catch(error => {
            console.error('Error fetching CSV:', error);
            showLoading(false);  // Hide loading even if there's an error
        });
}

// Custom function to parse CSV data and handle commas in quoted text
function parseCSV(data) {
    const lines = data.split('\n');  // Split the CSV into lines
    const result = [];

    // Extract the header row to know which fields are which (e.g., "text", "backgroundColor", "source")
    const headers = lines[0].split(',');

    // Loop through the remaining rows and process each one
    for (let i = 1; i < lines.length; i++) {
        
        let line = lines[i];
        console.log(line)
        // Handle fields enclosed in double quotes (which may contain commas)
        let fields = [];
        let inQuotes = false;
        let field = '';

        for (let char of line) {
            if (char === '"') {
                inQuotes = !inQuotes;  // Toggle whether we're inside a quoted field
            } else if (char === ',' && !inQuotes) {
                // If we hit a comma and we're not inside a quoted field, end the field
                fields.push(field);
                field = '';
            } else {
                field += char;  // Add the character to the current field
            }
        }
        fields.push(field);  // Add the last field
        console.log(fields)
        // Create an object for each row
        let status = {};
        for (let j = 0; j < headers.length; j++) {
            status[headers[j].trim()] = fields[j].replace(/"/g, '').trim();  // Remove any extra quotes
        }
        result.push(status);
    }

    return result;
}

// Function to show or hide the loading indicator
function showLoading(isLoading) {
    console.log(isLoading)
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = isLoading ? 'block' : 'none';
}

// Function to update the displayed status
function updateStatus() {
    const statusText = document.getElementById('statusText');
    const statusSource = document.getElementById('statusSource');  // Element to show the source
    const statusContainer = document.querySelector('.status-container');

    const status = statuses[currentIndex];
    if (status) {
        statusText.innerHTML = status.text; // Display the main text
        statusSource.innerHTML = "Source: " + status.source; // Display the source in smaller font
        statusContainer.style.backgroundColor = status.backgroundColor;
    }
}

function nextStatus() {
    if (statuses.length > 0) {
        currentIndex = (currentIndex + 1) % statuses.length;
        updateStatus();
    }
}

function prevStatus() {
    if (statuses.length > 0) {
        currentIndex = (currentIndex - 1 + statuses.length) % statuses.length;
        updateStatus();
    }
}

// Initialize the statuses from CSV when the page loads
document.addEventListener('DOMContentLoaded', loadStatusesFromCSV);
