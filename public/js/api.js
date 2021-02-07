const base_url = "https://api.football-data.org/v2/";

// Blok kode yang akan di panggil jika fetch berhasil
function fetchStatus(response) {
    if (response.status !== 200) {
        console.log(`Error : ${response.status}`);
        // Methond reject() akan membuat block catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}

// Blok kode untuk memparsing json menjadi arrau Javascript
function json(response) {
    return response.json();
}

// Blok kode untuk men-handle kesalahan di blok catch
function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log(`Error : ${error}`);
}

/*
    Menyusun komponen card artikel secara dinamis ke articelsHtml
    di function getCompetitions
*/
function addCardArticleHtml(data) {
    return `
    <div class="col s12 m12 l6">
        <div class="card horizontal">
        <div class="card-logo">
            <img src="${data.team.crestUrl.replace(
                /^http:\/\//i,
                "https://"
            )}"/>
        </div>
        <div class="card-stacked">
            <div class="card-content">
                <span class="card-title">${data.team.name}</span>
                <p>
                    Won ${data.won}
                    Lost ${data.lost}
                    Draw ${data.draw}
                </p>
            </div>
            <div class="card-action">
                <a href="./article.html?id=${
                    data.team.id
                }" class="waves-effect waves-light btn
                ">See More</a>
            </div>
        </div>
        </div>
    </div>`;
}

// Blok kode untuk melakukan request data json
function getPremierLeague() {
    fetch(`${base_url}competitions/2021/standings`, {
        headers: {
            "X-Auth-Token": "6f59ca8fe87043a6a1721e783159d8cd",
        },
    })
        .then(fetchStatus)
        .then(json)
        .then(function (data) {
            // Object/array Javascript dari response.json() masuk lewat data.
            // Menyusun komponen card artikel secara dinamis
            let articlesHTML = "";
            articlesHTML += `<h1>${data.competition.name}</h1>`;
            data.standings.forEach(function (team) {
                // Mengambil data API GROUP A yang Bertipe TOTAL
                if (team.type === "TOTAL") {
                    team.table.forEach(function (data) {
                        articlesHTML += addCardArticleHtml(data);
                    });
                }
            });

            // Menyisipkan kompenen card kedalam elemen dengan id#
            document.getElementById("premierLeague").innerHTML = articlesHTML;
        })
        .catch(error);
}

// Mengambil API data squad lalu menyisipkannya
function addSquad(data, role) {
    let addSquadHtml = "";
    let no = 1;
    data.forEach(function (data) {
        if (data.role === role && data.role === "PLAYER") {
            addSquadHtml += `
            <tr>
                <td>${no}</td>
                <td>${data.name}</td>
                <td>${data.position}</td>
                <td>${data.nationality}</td>
            </tr>`;
            no += 1;
        }

        if (data.role === role && data.role === "COACH") {
            addSquadHtml += `${data.name}`;
        }
    });
    return addSquadHtml;
}

/*
    Menyusun komponen card artikel secara dinamis ke articelsHtlml
    di function getTeamById
*/
function addCardArticleHtmlById(data) {
    return `
    <div class="card">
        <div class="articles-image">
            <img src="${data.crestUrl.replace(/^http:\/\//i, "https://")}" />
        </div>
        <div class="card-content">
            <h1 class="article-title">${data.name}</h1>
            <ul class="collection with-header">
                <li class="collection-header"><h4>Active Competitions</h4></li>
                <li class="collection-item">${
                    data.activeCompetitions[0].name
                }</li>
                <li class="collection-header"><h4>Adress</h4></li>
                <li class="collection-item">${data.address}</li>
                <li class="collection-header"><h4>Phone</h4></li>
                <li class="collection-item">${data.phone}</li>
                <li class="collection-header"><h4>Website</h4></li>
                <li class="collection-item">${data.website}</li>
                <li class="collection-header"><h4>Email</h4></li>
                <li class="collection-item">${data.email}</li>
                <li class="collection-header"><h4>Coach</h4></li>
                <li class="collection-item">${addSquad(
                    data.squad,
                    "COACH"
                )}</li>
                <li class="collection-header"><h4>Squad</h4></li>
                <li class="collection-item">
                    <table class="striped">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Position</th>
                                <th>Nationality</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${addSquad(data.squad, "PLAYER")}
                        </tbody>
                    </table>
                </li>
            </ul>
        </div>
    </div>`;
}

// Mengambil data API sesuai request id
function getTeamById() {
    return new Promise(function (resolve, reject) {
        // Ambil nilai query parameter (?id=)
        const urlParams = new URLSearchParams(window.location.search);
        const idParam = urlParams.get("id");

        fetch(`${base_url}teams/${idParam}`, {
            headers: {
                "X-Auth-Token": "6f59ca8fe87043a6a1721e783159d8cd",
            },
        })
            .then(fetchStatus)
            .then(json)
            .then(function (data) {
                // Menyusun komponen card artikel secara dinamis
                let articlesHTML = addCardArticleHtmlById(data);

                // sisipkan komponen card ke dalam elemen dengan id #content
                document.getElementById(
                    "body-content"
                ).innerHTML = articlesHTML;

                // Kirim object data hasil pasrsing json agar bisa disimpan ke indexed db
                resolve(data);
            });
    });
}

// mengambil data activeCompetitions lalu mengembalikan nilainya
function addActiveCompetitions(data) {
    let activeCompetitions = "";
    data.forEach(function (competition) {
        activeCompetitions += `<p>${competition.name}</p>`;
    });
    return activeCompetitions;
}

// menyusun komponen card
function savedTeamHtml(data) {
    // Menyusun komponen card artikel secara dinamis
    let articlesHTML = "";

    if (data.length === 0) {
        articlesHTML += `<h3 class="empty">Empty</h3>`;
    } else {
        data.forEach(function (team) {
            articlesHTML += `
            <div class="col s12 m12 l6">
                <div class="card horizontal">
                <div class="card-logo">
                    <img src="${team.crestUrl.replace(
                        /^http:\/\//i,
                        "https://"
                    )}"/>
                </div>
                <div class="card-stacked">
                    <div class="card-content">
                        <span class="card-title">${team.name}</span>
                        <h4>Active Competitions :</h4>
                        ${addActiveCompetitions(team.activeCompetitions)}
                    </div>
                    <div class="card-action">
                        <a href="./article.html?id=${
                            team.id
                        }&saved=true" class="waves-effect waves-light btn
                        ">See More</a>
                    </div>
                </div>
                </div>
            </div>`;
        });
    }
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("favoriteTeam").innerHTML = articlesHTML;
}
// Mengambil data yang sudah tersimpan di index db
function getSavedArticles() {
    getAll().then(function (data) {
        savedTeamHtml(data);
    });
}

// Mengambil data sesuai request id yang sudah tersimpan di index db
function getSavedArticlesById() {
    return new Promise(function (resolve, reject) {
        const urlParams = new URLSearchParams(window.location.search);
        const idParam = urlParams.get("id");

        getById(idParam).then(function (data) {
            let articlesHTML = addCardArticleHtmlById(data);

            // Sisipkan komponen card ke dalam elemen dengan id #body-content
            document.getElementById("body-content").innerHTML = articlesHTML;

            // Kirim object data hasil pasrsing json agar bisa disimpan ke indexed db
            resolve(data);
        });
    });
}
