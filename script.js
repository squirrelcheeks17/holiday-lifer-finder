function formatDate(date) {
    const parts = date.split("-");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
let allObservations = [];
let animalLifeList = {};

async function loadObservations() {
    const username = document.getElementById("username").value;
    const results = document.getElementById("results");

    results.innerHTML = "Loading animal life list...";

    try {
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
        
animalLifeList = firstSeen;

results.innerHTML = `
    <h3>✅ Animal life list built successfully</h3>

    <p><strong>Total observations:</strong> ${allObservations.length}</p>

    <p><strong>Animal species:</strong> ${lifers.length}</p>

    <p>Your life list is now loaded and ready.</p>

    <p>
        Choose a holiday date range above and click
        <strong>Find holiday lifers</strong>.
    </p>
`;


    } catch (error) {
        results.innerHTML = "Something went wrong.";
        console.log(error);
    }
}


async function findHolidayLifers() {

    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const results = document.getElementById("results");

    if (!startDate || !endDate) {
        results.innerHTML = "Please choose both holiday dates.";
        return;
    }

    if (Object.keys(animalLifeList).length === 0) {
        results.innerHTML = "Please build your life list first.";
        return;
    }

    const holidayLifers = Object.values(animalLifeList).filter(obs => {
        return obs.observed_on >= startDate &&
               obs.observed_on <= endDate;
    });


    results.innerHTML = `
        <h3>⭐ Holiday lifers found</h3>

        <p>
            Dates: ${formatDate(startDate)} to ${formatDate(endDate)}
        </p>

        <p>
            New species: ${holidayLifers.length}
        </p>

        <ul>
        ${holidayLifers.map(obs => `
            <li>
                ⭐ ${obs.taxon.preferred_common_name || obs.taxon.name}
                <br>
                <em>${obs.taxon.name}</em>
                <br>
                First seen: ${formatDate(obs.observed_on)}
                <br>
                Location: ${obs.place_guess || "Unknown"}
            </li>
        `).join("")}
        </ul>
    `;
}
