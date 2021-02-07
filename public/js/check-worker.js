if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").then(
        function () {
            console.log("Pendaftaran ServiceWorker berhasil");
        },
        function () {
            console.log("Pendaftaran ServiceWorker gagal");
        }
    );
    navigator.serviceWorker.ready.then(function () {
        console.log("ServiceWorker sudah siap bekerja.");
    });
} else {
    console.log("ServiceWorker belum didukung browser ini.");
}
