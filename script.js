async function loadObservations() {
    const username = document.getElementById("username").value;
    const results = document.getElementById("results");

    results.innerHTML = "Loading all observations...";

    try {
        let allObservations = [];
        let page = 1;
        let totalPages = 1;

        while (page <= totalPages) {
            const response = await fetch(
                `https://api.inaturalist.org/v1/observations?user_id=${username}&per_page=200&page=${page}`
            );

            const data = await response.json();

            allObservations = allObservations.concat(data.results);

            totalPages = Math.ceil(data.total_results / 200);
            page++;
        }

   const species = new Set(
    allObservations
        .map(obs => obs.taxon?.name)
        .filter(name => name)
);


// Find first ever observation of each species
const firstSeen = {};

allObservations
    .sort((a, b) => new Date(a.observed_on) - new Date(b.observed_on))
    .forEach(obs => {
        const name = obs.taxon?.name;

        if (name && !firstSeen[name]) {
            firstSeen[name] = obs;
        }
    });

const liferCount = Object.keys(firstSeen).length;
        results.innerHTML = `
            <p>🎉 Loaded all observations!</p>
            <p>Total observations: ${allObservations.length}</p>
<p>Total species: ${species.size}</p>
<p>Total lifers in your life list: ${liferCount}</p>
        `;

    } catch (error) {
        results.innerHTML = "Something went wrong.";
        console.log(error);
    }
}
