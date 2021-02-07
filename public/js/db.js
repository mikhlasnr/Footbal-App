// Membuat Object Store
const dbPromised = idb.open("footbal-App", 1, function (upgradeDb) {
    const articlesObjectStore = upgradeDb.createObjectStore("team", {
        keyPath: "id",
    });

    articlesObjectStore.createIndex("name", "name", {
        unique: false,
    });
});

// Menyimpan data ke Object store yang sudah dibuat
function saveForLater(data) {
    dbPromised
        .then(function (db) {
            const tx = db.transaction("team", "readwrite");
            const store = tx.objectStore("team");
            console.log(data);
            store.put(data);
            return tx.complete;
        })
        .then(function () {
            console.log(data);

            M.toast({
                html: `Berhasil di Simpan.`,
            });
        })
        .catch(function () {
            M.toast({
                html: "Tim Gagal tersimpan!",
            });
        });
}

// mengambil semua data yang ada di object store
function getAll() {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                const tx = db.transaction("team", "readonly");
                const store = tx.objectStore("team");

                return store.getAll();
            })
            .then(function (articles) {
                console.log(articles);
                resolve(articles);
            });
    });
}

// mengambil data sesuai request id yang ada di object store
function getById(id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                const tx = db.transaction("team", "readonly");
                const store = tx.objectStore("team");
                console.log(id);
                const idParam = parseInt(id);

                return store.get(idParam);
            })
            .then(function (article) {
                console.log(article);
                resolve(article);
            });
    });
}

// menghapus data sesuai request id yang ada di object store
function delFavoriteTeam(team) {
    dbPromised
        .then(function (db) {
            let tx = db.transaction("team", "readwrite");
            let store = tx.objectStore("team");

            store.delete(team.id);
            return tx.complete;
        })
        .then(function () {
            M.toast({
                html: `Tim dihapus dari Favorit.`,
            });
        })
        .catch(function () {
            M.toast({
                html: "Tim gagal dihapus!",
            });
        });
}
