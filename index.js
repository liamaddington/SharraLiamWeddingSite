async function loadRSVP() {
	const urlParams = new URLSearchParams(window.location.search);
	const guid = urlParams.get("guid");
	if (!guid) {
		document.getElementById("rsvp-form").innerHTML = "Invalid RSVP link.";
		return;
	}

	const response = await fetch(`https://sharraliam-wedding-site-ckdtccgbeyd7ahem.southeastasia-01.azurewebsites.net/api/GetRSVP?guid=${guid}`);
	const data = await response.json();

	if (response.status !== 200) {
		document.getElementById("rsvp-form").innerHTML = "RSVP not found.";
		return;
	}

	document.getElementById("household").innerText = `RSVP for ${data.householdName}`;
	const form = document.getElementById("guests");
	data.guests.forEach(guest => {
		form.innerHTML += `
			<label>${guest.name}</label>
			<select name="${guest.name}">
				<option value="">Select</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
			</select><br><br>
		`;
	});

	document.getElementById("submit").style.display = "block";
}

async function submitRSVP() {
	const urlParams = new URLSearchParams(window.location.search);
	const guid = urlParams.get("guid");

	const responses = {};
	document.querySelectorAll("#guests select").forEach(select => {
		responses[select.name] = select.value;
	});

	await fetch("https://sharraliam-wedding-site-ckdtccgbeyd7ahem.southeastasia-01.azurewebsites.net/api/SubmitRSVP", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ guid, responses })
	});

	alert("RSVP submitted!");
}