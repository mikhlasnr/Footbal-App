var webPush = require("web-push");

var vapidKeys = {
    publicKey:
        "BGtaWrilcruCH6ItDz4gBpn4bVqsvrrk6xiys3hZDS0bdv3dAT8xEle8BkEMzIVpXTlVjGYBbpiX8SdIogC5onM",
    privateKey: "hj1zYdv8d5wy5_8aVI7Wi12knPYLYYZexILrqGlfj2E",
};

webPush.setVapidDetails(
    "mailto:https://f93495ff4eff.ngrok.io/",
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

var pushSubscription = {
    endpoint:
        "https://fcm.googleapis.com/fcm/send/cMwwlH2a598:APA91bGdBME8tCcB6s4BcxzVQdDAM5XRaka3_jE9v_3DzJEJIKh1pYbvpwBzg_VeNk0-NFnfm_GOTBL68eHjE0D0wIgDKaBFF8D9tHYTAIyoPcAzzA6j-FjLnNxvrEZ4lb9be5OYTZ4y",
    keys: {
        p256dh:
            "BAeUSpUPfpwl5+6k8sWYKRHNt4Xg84oI6+/v7hA9avuqPu1m+jJVow+SBcWQ8JXHR9bLH31Of594TQ//HeWjbjM=",
        auth: "A62ZKTNzmYUM7/c2vFSjfw==",
    },
};

var payload = "Selamat datang di FootbalApp!";

var options = {
    gcmAPIKey: "110680491959",
    TTL: 60,
};

webPush.sendNotification(pushSubscription, payload, options);
