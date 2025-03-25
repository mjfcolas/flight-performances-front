import {Environment} from "../../app/environment";

export class AnalyticsService {

  constructor(
    private document: Document,
    private readonly environment: Environment
  ) {
  }

  load(): void {
    if (!this.environment.enableAnalytics || !this.environment.matomoConfiguration) {
      return;
    }

    const script = this.document.createElement('script');
    script.type = 'text/javascript';
    script.text = `
    var _paq = window._paq = window._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(["disableCookies"]);
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function() {
    var u="//${this.environment.matomoConfiguration.url}/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '${this.environment.matomoConfiguration.siteId}']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
    })();
    `;

    this.document.head.appendChild(script);
  }
}
