// Updated school.js

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/settings/viewSettings');

        if (!response.ok) {
            throw new Error('Failed to fetch settings');
        }

        const data = await response.json();

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

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('address', address);
    formData.append('motto', motto);
    formData.append('vision', vision);
    formData.append('schoolType', schoolType);
    formData.append('gender', gender);

    if (logoFile) {
        formData.append('logo', logoFile);
    }

    try {
        const response = await fetch('http://localhost:3000/api/simba-systems/settings/create', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert('Settings added successfully');
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

function resetSettings() {
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
