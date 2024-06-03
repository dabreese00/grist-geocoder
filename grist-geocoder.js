// Register global error handler.
window.onerror = (message) => alert(String(message));

grist.ready({
    //register configuration handler to show configuration panel.
    onEditOptions() {
        showPanel('configuration');
    },
    // Inform about required access level
    requiredAccess: 'full'
});

let option1;
let selectedTableId;

grist.onOptions((customOptions, interactionOptions) => {
    document.getElementById("customLog").innerText = JSON.stringify(customOptions, null, -2);
    document.getElementById("interactionLog").innerText = JSON.stringify(interactionOptions, null, -2);
    showPanel(customOptions ? 'main' : 'error');
    customOptions = customOptions || {};
    document.getElementById("setOption1").value = customOptions.option1 || '';
    document.getElementById("setOption2").value = customOptions.option2 || '';
    document.getElementById("getOption1").innerText = customOptions.option1 || '';
    document.getElementById("getOption2").innerText = customOptions.option2 || '';
    document.getElementById("app").style.display = 'block';
    option1 = customOptions.option1;
});

// Define handler for the Save button.
async function saveOptions() {
    await grist.widgetApi.setOption('option1', document.getElementById("setOption1").value);
    await grist.widgetApi.setOption('option2', document.getElementById("setOption2").value);
    // There is no need to update visible options, as Grist will send us a message that will be handled by the onOptions handler.
    showPanel('main');
}

// Helper to show or hide panels.
function showPanel(name) {
    document.getElementById("error").style.display = 'none';
    document.getElementById("configuration").style.display = 'none';
    document.getElementById("main").style.display = 'none';
    document.getElementById(name).style.display = 'block';
}

grist.on('message', (e) => {
    if (e.tableId) { selectedTableId = e.tableId; }
});

function buildGmapsUrl(address, key) {
  const endpoint = 'https://maps.googleapis.com/maps/api/geocode/json';
  let addressParam = `address=${address}`;
  let keyParam = `key=${key}`;
  return endpoint + "?" + addressParam + "&" + keyParam;
}

function geocode(address, key) {
  url = buildGmapsUrl(address, key);
  console.log(url);
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error(`Could not get geocode: ${error}`);
    })
}

async function updateRecordWithGeocode(record, key) {
  if (!record.Address) {
    throw new Error('Could not read Address');
  }
  const data = await geocode(record.Address, key);
  const latlong = data['results'][0]['geometry']['location'];
  console.log(latlong);
  await grist.docApi.applyUserActions([ ['UpdateRecord', selectedTableId, record.id, {
    'Latitude': latlong['lat'],
    'Longitude': latlong['lng']
  }] ]);
}

grist.onRecord((record) => {
  if (!option1) {
    throw new Error('Please configure Option 1');
  }
  updateRecordWithGeocode(record, option1);
});
