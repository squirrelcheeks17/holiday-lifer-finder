async function loadObservations() {
    const username = document.getElementById("username").value;
    const results = document.getElementById("results");

    results.innerHTML = "Loading observations...";

    try {
        const response = await fetch(
            `https://api.inaturalist.org/v1/observations?user_id=${username}&per_page=1`
        );

        const data = await response.json();

        results.innerHTML = `
            <p>Found your observations!</p>
            <p>Total observations: ${data.total_results}</p>
        `;

    } catch (error) {
        results.innerHTML = "Something went wrong.";
        console.log(error);
    }
}
