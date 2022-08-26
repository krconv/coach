// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

import { Workbox } from "workbox-window";

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);
const isAvailable = "serviceWorker" in navigator;
const workerUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
const workbox = isAvailable ? new Workbox(workerUrl) : null;

export const init = () => {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener("load", () => {
      if (isLocalhost) {
        isServiceWorkerMissing().then((isMissing) => {
          if (isMissing) {
            // when running locally via yarn start, service worker won't exist;
            // unregister it to prevent problems

            navigator.serviceWorker.ready.then((registration) => {
              registration.unregister().then(() => {
                window.location.reload();
              });
            });
          } else {
            registerServiceWorker();
          }
        });
      } else {
        registerServiceWorker();
      }
    });
  }
};

const isServiceWorkerMissing = async () => {
  try {
    const response = await fetch(workerUrl, {
      headers: { "Service-Worker": "script" },
    });
    const contentType = response.headers.get("content-type");
    const isValidServiceWorker =
      response.status === 200 && contentType?.includes("javascript");

    return !isValidServiceWorker;
  } catch (err: any) {
    console.log(
      "No internet connection found. App is running in offline mode."
    );
    return false;
  }
};

const registerServiceWorker = () => {
  workbox
    ?.register()
    .then((registration) => {
      if (!registration) {
        throw new Error();
      }

      // ensure the case when the updatefound event was missed is also handled
      // by re-invoking the prompt when there's a waiting Service Worker
      if (registration.waiting) {
        updateAndReload();
      }

      // check for updates every 30 seconds
      setInterval(() => {
        registration.update();
      }, 30000);

      // subscribe to any registration changes for service workers
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === "installed") {
              const serviceWorkerAlreadyExists =
                navigator.serviceWorker.controller;
              if (serviceWorkerAlreadyExists) {
                console.log("A new update is available.");
                updateAndReload();
              } else {
                // first install, worker should activate automatically
                console.log("Content is cached for offline use.");
              }
            }
          };
        }
      };

      // if a service worker already exists, reload the page once it's been activated
      if (navigator.serviceWorker) {
        let refreshing = false;
        navigator.serviceWorker.oncontrollerchange = () => {
          if (!refreshing) {
            console.log("Reloading due to an app update...");
            window.location.reload();
            refreshing = true;
          }
        };
      }
    })
    .catch((error) => {
      console.error("Error during service worker registration:", error);
    });
};

export const updateAndReload = () => {
  if ("serviceWorker" in navigator) {
    console.log("Updating..");
    workbox?.messageSkipWaiting();
  }
};
