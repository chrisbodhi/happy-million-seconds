// Main application logic
import { getWasmModule } from './wasm_loader.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Wait for WASM to load
  document.addEventListener('wasm-loaded', initApp);
  
  // Try to initialize right away in case WASM is already loaded
  if (await getWasmModule()) {
    initApp();
  }
});

async function initApp() {
  const wasmModule = await getWasmModule();
  
  // Populate the timezone dropdown
  populateTimezones(wasmModule);
  
  // Handle form submission
  document.getElementById('birthday-form').addEventListener('submit', (event) => {
    event.preventDefault();
    calculateMilestones(wasmModule);
  });
  
  // Set up copy link button
  document.getElementById('copy-link').addEventListener('click', () => {
    const linkInput = document.getElementById('share-link');
    linkInput.select();
    document.execCommand('copy');
    
    // Change button text temporarily to provide feedback
    const copyBtn = document.getElementById('copy-link');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  });
  
  // Check for URL params and load data if present
  loadFromUrlParams();
}

function populateTimezones(wasmModule) {
  try {
    const timezones = wasmModule.get_all_timezones();
    const select = document.getElementById('birth-timezone');
    
    // Clear existing options
    select.innerHTML = '';
    
    // Add a placeholder
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select a timezone';
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);
    
    // Add the timezones
    timezones.forEach(timezone => {
      const option = document.createElement('option');
      option.value = timezone;
      option.textContent = timezone.replace(/_/g, ' ');
      
      // Set browser timezone as default
      if (timezone === getBrowserTimezone()) {
        option.selected = true;
      }
      
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to populate timezones:', error);
  }
}

function getBrowserTimezone() {
  // Try to get a standardized timezone name
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timezone;
  } catch (error) {
    console.error('Failed to get browser timezone:', error);
    return 'UTC';
  }
}

async function calculateMilestones(wasmModule) {
  const birthDate = document.getElementById('birth-date').value;
  const birthTime = document.getElementById('birth-time').value;
  const birthTimezone = document.getElementById('birth-timezone').value;
  
  // Get current date and time in local timezone
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const currentTime = now.toTimeString().substring(0, 5); // HH:MM
  const currentTimezone = getBrowserTimezone();
  
  try {
    // Call the Rust function
    const result = wasmModule.calculate_seconds_diff(
      birthDate,
      birthTime,
      birthTimezone,
      currentDate,
      currentTime,
      currentTimezone
    );
    
    // Format and display results
    displayResults(wasmModule, result, birthDate, birthTime, birthTimezone);
    
    // Update URL for sharing
    updateUrlParams(birthDate, birthTime, birthTimezone);
    
    // Show results section
    document.getElementById('results-section').classList.remove('hidden');
    
    // Scroll to results
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error('Error calculating milestones:', error);
    alert(`Error: ${error.message || 'Failed to calculate milestones. Please try again.'}`);
  }
}

function displayResults(wasmModule, result, birthDate, birthTime, birthTimezone) {
  const currentTimezone = getBrowserTimezone();
  
  // Format milestone dates
  const milestones = [
    {
      id: 'million',
      seconds: 1000000,
      diff: result.million
    },
    {
      id: 'billion',
      seconds: 1000000000,
      diff: result.billion
    },
    {
      id: 'trillion',
      seconds: 1000000000000,
      diff: result.trillion
    }
  ];
  
  // Display each milestone
  milestones.forEach(milestone => {
    try {
      // Get formatted date for the milestone
      const formattedDate = wasmModule.format_milestone_date(
        birthDate,
        birthTime,
        birthTimezone,
        milestone.seconds,
        currentTimezone
      );
      
      // Set the date
      document.getElementById(`${milestone.id}-time`).textContent = 
        `Date: ${formattedDate}`;
      
      // Set the countdown/up
      const countdownEl = document.getElementById(`${milestone.id}-countdown`);
      
      if (milestone.diff > 0) {
        // Future event
        countdownEl.textContent = `${formatTimeRemaining(milestone.diff)} from now`;
        countdownEl.classList.add('future-event');
        countdownEl.classList.remove('past-event');
      } else {
        // Past event
        countdownEl.textContent = `${formatTimeRemaining(Math.abs(milestone.diff))} ago`;
        countdownEl.classList.add('past-event');
        countdownEl.classList.remove('future-event');
      }
    } catch (error) {
      console.error(`Error formatting ${milestone.id} milestone:`, error);
      document.getElementById(`${milestone.id}-time`).textContent = 'Error calculating date';
      document.getElementById(`${milestone.id}-countdown`).textContent = '';
    }
  });
  
  // Update share link
  const shareUrl = window.location.href;
  document.getElementById('share-link').value = shareUrl;
}

function formatTimeRemaining(seconds) {
  if (seconds < 60) {
    return `${seconds} seconds`;
  }
  
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  if (seconds < 2592000) { // ~30 days
    const days = Math.floor(seconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
  
  if (seconds < 31536000) { // ~365 days
    const months = Math.floor(seconds / 2592000);
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  
  const years = Math.floor(seconds / 31536000);
  return `${years} year${years !== 1 ? 's' : ''}`;
}

function updateUrlParams(birthDate, birthTime, birthTimezone) {
  // Create URL parameters
  const params = new URLSearchParams();
  params.set('date', birthDate);
  params.set('time', birthTime);
  params.set('tz', birthTimezone);
  
  // Update URL without reloading the page
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({ path: newUrl }, '', newUrl);
}

function loadFromUrlParams() {
  const params = new URLSearchParams(window.location.search);
  
  const date = params.get('date');
  const time = params.get('time');
  const timezone = params.get('tz');
  
  if (date && time && timezone) {
    // Set form values
    document.getElementById('birth-date').value = date;
    document.getElementById('birth-time').value = time;
    
    // Wait for timezones to be populated, then set the timezone
    const timezoneInterval = setInterval(() => {
      const timezoneSelect = document.getElementById('birth-timezone');
      
      if (timezoneSelect.options.length > 1) {
        clearInterval(timezoneInterval);
        
        // Find and select the matching timezone
        for (let i = 0; i < timezoneSelect.options.length; i++) {
          if (timezoneSelect.options[i].value === timezone) {
            timezoneSelect.selectedIndex = i;
            break;
          }
        }
        
        // Automatically calculate results
        document.getElementById('birthday-form').dispatchEvent(new Event('submit'));
      }
    }, 100);
  }
}
