document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/settings/viewSettings');

        if (!response.ok) {
            throw new Error('Failed to fetch settings');
        }

        const data = await response.json();

        console.log(data);
        if (data.exists) {
            displaySettings(data.settings);
        } else {
            showSettingsForm();
        }
    } catch (error) {
        handleError('Error fetching settings:', error);
    }
});

function displaySettings(settings) {
    const container = document.getElementById('mainContent');

    container.innerHTML = '';

    if (!settings) {
        console.error('Settings object is null or undefined');
        return;
    }

    const logoHtml = settings.logo
        ? `<img src="${settings.logo}" alt="School Logo" class="school-logo">`
        : '<p class="settings-item">No logo available</p>';

    const settingsHtml = `
        <div class="settings-view">
            <h2 class="settings-title">${settings.name || 'School Name Not Available'}</h2>
            <p class="settings-item"><strong>Phone:</strong> ${settings.phone || 'N/A'}</p>
            <p class="settings-item"><strong>Email:</strong> ${settings.email || 'N/A'}</p>
            <p class="settings-item"><strong>Address:</strong> ${settings.address || 'N/A'}</p>
            <p class="settings-item"><strong>Motto:</strong> ${settings.motto || 'N/A'}</p>
            <p class="settings-item"><strong>Vision:</strong> ${settings.vision || 'N/A'}</p>
            <p class="settings-item"><strong>Type:</strong> ${settings.schoolType || 'N/A'}</p>
            <p class="settings-item"><strong>Gender:</strong> ${settings.gender || 'N/A'}</p>
            ${logoHtml}
            <button class="settings-edit-btn" onclick="showSettingsForm()">Edit Settings</button>
        </div>
    `;

    container.innerHTML = settingsHtml;
}

function showSettingsForm() {
    const container = document.getElementById('mainContent');
    const formHtml = document.querySelector('.school-settings-container')?.outerHTML;

    container.innerHTML = formHtml || `
        <div>
            <p>Error: Unable to load settings form. Please refresh the page.</p>
        </div>
    `;
}


function handleError(message, error) {
    console.error(message, error);
    alert(`${message} Please try again later.`);
}


async function addSettings() {
    const name = document.getElementById('addName').value;
    const phone = document.getElementById('addPhone').value;
    const email = document.getElementById('addEmail').value;
    const address = document.getElementById('addAddress').value;
    const motto = document.getElementById('addMotto').value;
    const vision = document.getElementById('addVision').value;
    const logoFile = document.getElementById('addLogo').files[0];
    const schoolType = document.getElementById('addSchoolType').value;
    const gender = document.getElementById('addGender').value;

    if (!name || !phone || !email || !address || !schoolType || !gender) {
        alert('Please fill in all required fields.');
        return;
    }

    let logo = null; 

    if (logoFile) {
        try {
            logo = await fileToBlob(logoFile);
        } catch (error) {
            console.error('Error converting file to Blob:', error);
            alert('Failed to process logo file. Please try a different file.');
        }
    }


    const payload = {
        name,
        phone,
        email,
        address,
        motto,
        vision,
        logo,
        schoolType,
        gender
    };

    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/settings/create', payload);

        if (response.ok) {
            alert('Settings added successfully');
            /* loadSettings(); */
            resetSettings();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add settings');
        }
    } catch (error) {
        console.error('Error adding settings:', error);
        alert('Failed to add settings. Please try again.');
    }
}

async function fileToBlob(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const blob = new Blob([reader.result], { type: file.type });
            resolve(blob);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
}


function resetSettings(){
    document.getElementById('addName').value = '';
    document.getElementById('addPhone').value = '';
    document.getElementById('addEmail').value = '';
    document.getElementById('addAddress').value = '';
    document.getElementById('addMotto').value = '';
    document.getElementById('addVision').value = '';
    document.getElementById('addLogo').value = '';
    document.getElementById('addSchoolType').selectedIndex = 0; 
document.getElementById('addGender').selectedIndex = 0;
}


/* async function editSettings() {
    const id = document.getElementById('editId').value;
    const name = document.getElementById('editName').value;
    const phone = document.getElementById('editPhone').value;
    const email = document.getElementById('editEmail').value;
    const address = document.getElementById('editAddress').value;
    const motto = document.getElementById('editMotto').value;
    const vision = document.getElementById('editVision').value;
    const logoFile = document.getElementById('editLogo').files[0];
    const schoolType = document.getElementById('editSchoolType').value;
    const gender = document.getElementById('editGender').value;
    const currentYear = document.getElementById('editCurrentYear').value;
    const currentTerm = document.getElementById('editCurrentTerm').value;

    if (!id || !name || !phone || !email || !address || !schoolType || !gender || !currentYear || !currentTerm) {
        alert('Please fill in all required fields.');
        return;
    }

    let logo = '';
    if (logoFile) {
        logo = await fileToBase64(logoFile);
    }

    try {
        const token = getAuthToken();
        const response = await fetchRequest('http://localhost:3000/api/settings/edit', {
            id,
            name,
            phone,
            email,
            address,
            motto,
            vision,
            logo,
            schoolType,
            gender,
            currentYear,
            currentTerm,
            token: JSON.stringify({ token }),
        });

        if (response.ok) {
            alert('Settings updated successfully');
            loadSettings();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update settings');
        }
    } catch (error) {
        console.error('Error updating settings:', error);
        alert('Failed to update settings. Please try again.');
    }
}

async function loadSettings() {
    try {
        const token = getAuthToken();
        const response = await fetchRequest('http://localhost:3000/api/settings/viewAll', {
            token: JSON.stringify({ token }),
        });

        if (response.ok) {
            const settings = await response.json();
            renderSettingsTable(settings); // Assume a function to render the settings data
        } else {
            console.error('Failed to load settings.');
        }
    } catch (error) {
        console.error('Error fetching settings:', error);
    }
}

async function deleteSettings(id) {
    try {
        if (!confirm('Are you sure you want to delete this settings record?')) return;

        const token = getAuthToken();
        const response = await fetchRequest('http://localhost:3000/api/settings/delete', {
            id,
            token: JSON.stringify({ token }),
        });

        if (response.ok) {
            alert('Settings deleted successfully!');
            loadSettings();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete settings');
        }
    } catch (error) {
        console.error('Error deleting settings:', error);
        alert('Failed to delete settings.');
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function fetchRequest(url, body = {}) {
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

function getAuthToken() {
    // Logic to retrieve the user's authentication token
    return localStorage.getItem('authToken') || '';
}

// Initialize the settings page
loadSettings();
 */
