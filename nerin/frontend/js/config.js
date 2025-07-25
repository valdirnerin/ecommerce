/*
 * Carga la configuración global desde el backend y aplica ajustes en la
 * interfaz (número de WhatsApp, Google Analytics, Meta Pixel). Esta
 * función se ejecuta al cargar cada página y expone la configuración
 * en `window.NERIN_CONFIG` para que otros módulos puedan consultarla.
 */

async function loadConfig() {
  try {
    const res = await fetch('/api/config');
    if (!res.ok) throw new Error('No se pudo obtener la configuración');
    const cfg = await res.json();
    // Exponer a nivel global
    window.NERIN_CONFIG = cfg;
    // Actualizar enlace de WhatsApp flotante si existe
    if (cfg.whatsappNumber) {
      const waBtn = document.querySelector('#whatsapp-button a');
      if (waBtn) {
        const phone = cfg.whatsappNumber.replace(/[^0-9]/g, '');
        waBtn.href = `https://wa.me/${phone}`;
      }
    }
    // Insertar Google Analytics
    if (cfg.googleAnalyticsId) {
      const gaScript1 = document.createElement('script');
      gaScript1.async = true;
      gaScript1.src = `https://www.googletagmanager.com/gtag/js?id=${cfg.googleAnalyticsId}`;
      document.head.appendChild(gaScript1);
      const gaScript2 = document.createElement('script');
      gaScript2.innerHTML =
        `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);} ;
gtag('js', new Date());
gtag('config', '${cfg.googleAnalyticsId}');`;
      document.head.appendChild(gaScript2);
    }
    // Insertar Meta/Facebook Pixel
    if (cfg.metaPixelId) {
      const fbScript = document.createElement('script');
      fbScript.innerHTML =
        `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n, arguments):n.queue.push(arguments);}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '${cfg.metaPixelId}'); fbq('track', 'PageView');`;
      document.head.appendChild(fbScript);
    }
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', loadConfig);