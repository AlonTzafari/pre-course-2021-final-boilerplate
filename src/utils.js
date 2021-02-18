const API_KEY = "$2b$10$HQwOejfJc5AdOgPXf8yJvO9vLU7G6WvMojCjBiPXEdreVE0A7bM96"; // Assign this variable to your JSONBIN.io API key if you choose to use it.
const DB_NAME = "my-todo";
const DB_URL = "http://localhost:3000/v3/b/mybin";

// Gets data from persistent storage by the given key and returns it
async function getPersistent(key) { 
  const init = {
    method: "GET",
    headers: {
      "X-Master-Key": API_KEY
    }
  };
  const request = new Request(DB_URL, init);
  const loadIcon = document.querySelector("#loading");
  const errorIcon = document.querySelector("#error");
  loadIcon.style.visibility = "visible";
  errorIcon.style.visibility = "hidden";
  let response;
  try {
    response = await fetch(request);
    response = await response.json();
    loadIcon.style.visibility = "hidden";
    return response.record[key];
  } catch (e) {
    errorIcon.style.visibility = "visible";
    loadIcon.style.visibility = "hidden";
    console.log(response);
    console.log(e);
  }
}

// Saves the given data into persistent storage by the given key.
// Returns 'true' on success.
async function setPersistent(key, data) {
  const sendObject = {};
  sendObject[key] = data;
  if(data.length === 0) sendObject[key] = null;
  const dataString = JSON.stringify(sendObject); 
  const init = {
    method: "PUT",
    body: dataString,
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY,
      "X-Bin-Versioning": false
    }
  };
  const request = new Request(DB_URL, init);
  const loadIcon = document.querySelector("#loading");
  loadIcon.style.visibility = "visible";
  const response = await fetch(request);
  loadIcon.style.visibility = "hidden";
  return response.ok;
}