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

	document.getElementById("guestCount").innerHTML = `${data.guests.length} seat${data.guests.length > 1 ? "s" : ""}`;

	data.guests.forEach(guest => {
		form.innerHTML += `
			<label style="padding-right: 40px;" class="guest-label">${guest.name}</label>
			<label class="guest-label">
            	<input class="radio-rsvp" type="radio" name="${guest.name}" value="Accept" ${guest.response === 'Accept' ? 'checked' : ''} required> Accept
        	</label>
        	<label class="guest-label">
        	    <input class="radio-rsvp" type="radio" name="${guest.name}" value="Regretfully Decline" ${guest.response === 'Regretfully Decline' ? 'checked' : ''}> Regretfully Decline
        	</label>
			<br><br>
		`;
	});

	document.getElementById("submit").style.display = "block";
}

async function submitRSVP() {
	const urlParams = new URLSearchParams(window.location.search);
	const guid = urlParams.get("guid");

	const responses = {};
	document.querySelectorAll("input[type=radio]:checked").forEach(input => {
		responses[input.name] = input.value;
	});

	await fetch("https://sharraliam-wedding-site-ckdtccgbeyd7ahem.southeastasia-01.azurewebsites.net/api/SubmitRSVP", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ guid, responses })
	});

	alert("RSVP submitted!");
}