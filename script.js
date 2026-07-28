async function loadObservations() {
    const username = document.getElementById("username").value;
    const results = document.getElementById("results");

    results.innerHTML = "Loading animal life list...";

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


        // Keep animals only
       const animalObservations = allObservations.filter(obs =>
    obs.taxon &&
    obs.taxon.rank === "species" &&
    obs.taxon.ancestor_ids &&
    obs.taxon.ancestor_ids.includes(1)
);


        // Find first observation of each species
        const firstSeen = {};

        animalObservations
            .sort((a, b) => new Date(a.observed_on) - new Date(b.observed_on))
            .forEach(obs => {

                const taxonID = obs.taxon.id;

                if (!firstSeen[taxonID]) {
                    firstSeen[taxonID] = obs;
                }

            });


        const lifers = Object.values(firstSeen);


        results.innerHTML = `
            <p>🎉 Animal life list created!</p>
            <p>Total observations: ${allObservations.length}</p>
            <p>Animal species: ${lifers.length}</p>
            
            <p><strong>Your first 10 lifers:</strong></p>

            <ul>
            ${lifers.slice(0,10).map(obs => `
                <li>
                    ⭐ ${obs.taxon.name}
                    <br>
                    First seen: ${obs.observed_on}
                </li>
            `).join("")}
            </ul>
        `;


    } catch (error) {
        results.innerHTML = "Something went wrong.";
        console.log(error);
    }
}
