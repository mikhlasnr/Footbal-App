// REGISTER SERVICE WORKER
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then(function () {
                console.log("Pendaftaran ServiceWorker berhasil");
            })
            .catch(function () {
                console.log("Pendaftaran ServiceWorker gagal");
            });
    });
} else {
    console.log("ServiceWorker belum didukung browser ini.");
}

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const isFromSaved = urlParams.get("saved");
    const btnSave = document.getElementById("save");
    const btnDelete = document.getElementById("delete");

    let item = null;

    if (isFromSaved) {
        // Hide fab jika dimuat dari indexed db
        btnSave.style.display = "none";

        // ambil artikel lalu tampilkan
        item = getSavedArticlesById();
    } else {
        // Hide fab jika dimuat dari indexed db
        btnDelete.style.display = "none";

        // ambil artikel
        item = getTeamById();
    }

    // event untuk save artikel team
    btnSave.onclick = function () {
        console.log("Tombol FAB di klik.");
        item.then(function (article) {
            saveForLater(article);
        });
        btnSave.classList.add("disabled");
    };

    // event untuk save artikel team
    btnDelete.onclick = function () {
        console.log("Tombol FAB di klik.");
        item.then(function (article) {
            delFavoriteTeam(article);
        });
        btnDelete.classList.add("disabled");
    };
});
