/**
 * Facebook SDK Loader
 * Carga asíncrona del SDK de Facebook para Login
 */

const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || '';

let fbSDKLoaded = false;
let fbSDKLoading = false;
let fbSDKPromise = null;

/**
 * Carga el Facebook SDK de forma asíncrona
 * @returns {Promise<void>}
 */
export function loadFacebookSDK() {
  if (fbSDKLoaded) return Promise.resolve();
  if (fbSDKLoading) return fbSDKPromise;

  if (!FACEBOOK_APP_ID) {
    return Promise.reject(new Error('VITE_FACEBOOK_APP_ID no configurado'));
  }

  fbSDKLoading = true;

  fbSDKPromise = new Promise((resolve, reject) => {
    // Callback global que Facebook llama cuando el SDK está listo
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: false,
        version: 'v19.0',
      });
      fbSDKLoaded = true;
      fbSDKLoading = false;
      resolve();
    };

    // Insertar el script de Facebook
    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/es_ES/sdk.js';
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      fbSDKLoading = false;
      reject(new Error('Error al cargar el SDK de Facebook'));
    };

    // Evitar cargar duplicados
    if (!document.getElementById('facebook-jssdk')) {
      document.head.appendChild(script);
    }
  });

  return fbSDKPromise;
}

/**
 * Inicia el flujo de login con Facebook
 * @returns {Promise<{ accessToken: string, userID: string }>}
 */
export function facebookLogin() {
  return new Promise((resolve, reject) => {
    if (!window.FB) {
      reject(new Error('Facebook SDK no está cargado'));
      return;
    }

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          const { accessToken, userID } = response.authResponse;
          resolve({ accessToken, userID });
        } else {
          reject(new Error('Login con Facebook cancelado por el usuario'));
        }
      },
      { scope: 'email,public_profile' }
    );
  });
}

/**
 * Verifica si Facebook SDK está listo
 */
export function isFacebookSDKReady() {
  return fbSDKLoaded && !!window.FB;
}
