<span class="hljs-keyword">import</span> puppeteer <span class="hljs-keyword">from</span> <span class="hljs-string">'puppeteer'</span>;
<span class="hljs-keyword">import</span> { logger } <span class="hljs-keyword">from</span> <span class="hljs-string">'../utils/logger.js'</span>;
<span class="hljs-keyword">import</span> { supabase } <span class="hljs-keyword">from</span> <span class="hljs-string">'../services/database.js'</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">async</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">scrapeSearchFunder</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> browser = <span class="hljs-keyword">await</span> puppeteer.<span class="hljs-title function_">launch</span>({
    <span class="hljs-attr">args</span>: [
      <span class="hljs-string">'--no-sandbox'</span>,
      <span class="hljs-string">'--disable-setuid-sandbox'</span>,
      <span class="hljs-string">'--disable-dev-shm-usage'</span>,
      <span class="hljs-string">'--disable-accelerated-2d-canvas'</span>,
      <span class="hljs-string">'--disable-gpu'</span>
    ]
  });

  <span class="hljs-keyword">try</span> {
    <span class="hljs-keyword">const</span> page = <span class="hljs-keyword">await</span> browser.<span class="hljs-title function_">newPage</span>();
    
    <span class="hljs-comment">// Set viewport and user agent</span>
    <span class="hljs-keyword">await</span> page.<span class="hljs-title function_">setViewport</span>({ <span class="hljs-attr">width</span>: <span class="hljs-number">1280</span>, <span class="hljs-attr">height</span>: <span class="hljs-number">800</span> });
    <span class="hljs-keyword">await</span> page.<span class="hljs-title function_">setUserAgent</span>(<span class="hljs-string">'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'</span>);

    <span class="hljs-comment">// Navigate to SearchFunder</span>
    <span class="hljs-keyword">await</span> page.<span class="hljs-title function_">goto</span>(<span class="hljs-string">'https://www.searchfunder.com/opportunities'</span>, {
      <span class="hljs-attr">waitUntil</span>: <span class="hljs-string">'networkidle0'</span>,
      <span class="hljs-attr">timeout</span>: <span class="hljs-number">60000</span>
    });

    <span class="hljs-comment">// Extract opportunities</span>
    <span class="hljs-keyword">const</span> opportunities = <span class="hljs-keyword">await</span> page.<span class="hljs-title function_">evaluate</span>(<span class="hljs-function">() =></span> {
      <span class="hljs-keyword">const</span> items = <span class="hljs-variable language_">document</span>.<span class="hljs-title function_">querySelectorAll</span>(<span class="hljs-string">'.opportunity-item'</span>);
      <span class="hljs-keyword">return</span> <span class="hljs-title class_">Array</span>.<span class="hljs-title function_">from</span>(items).<span class="hljs-title function_">map</span>(<span class="hljs-function"><span class="hljs-params">item</span> =></span> ({
        <span class="hljs-attr">title</span>: item.<span class="hljs-title function_">querySelector</span>(<span class="hljs-string">'.title'</span>)?.<span class="hljs-property">textContent</span>?.<span class="hljs-title function_">trim</span>() || <span class="hljs-string">''</span>,
        <span class="hljs-attr">description</span>: item.<span class="hljs-title function_">querySelector</span>(<span class="hljs-string">'.description'</span>)?.<span class="hljs-property">textContent</span>?.<span class="hljs-title function_">trim</span>() || <span class="hljs-string">''</span>,
        <span class="hljs-attr">region</span>: item.<span class="hljs-title function_">querySelector</span>(<span class="hljs-string">'.region'</span>)?.<span class="hljs-property">textContent</span>?.<span class="hljs-title function_">trim</span>() || <span class="hljs-string">''</span>,
        <span class="hljs-attr">industry</span>: item.<span class="hljs-title function_">querySelector</span>(<span class="hljs-string">'.industry'</span>)?.<span class="hljs-property">textContent</span>?.<span class="hljs-title function_">trim</span>() || <span class="hljs-string">''</span>,
        <span class="hljs-attr">fundType</span>: item.<span class="hljs-title function_">querySelector</span>(<span class="hljs-string">'.fund-type'</span>)?.<span class="hljs-property">textContent</span>?.<span class="hljs-title function_">trim</span>() || <span class="hljs-string">''</span>,
        <span class="hljs-attr">sourceUrl</span>: item.<span class="hljs-title function_">querySelector</span>(<span class="hljs-string">'a.source'</span>)?.<span class="hljs-property">href</span> || <span class="hljs-string">''</span>,
        <span class="hljs-attr">contact</span>: item.<span class="hljs-title function_">querySelector</span>(<span class="hljs-string">'.contact'</span>)?.<span class="hljs-property">textContent</span>?.<span class="hljs-title function_">trim</span>() || <span class="hljs-string">''</span>,
        <span class="hljs-attr">date</span>: <span class="hljs-keyword">new</span> <span class="hljs-title class_">Date</span>().<span class="hljs-title function_">toISOString</span>()
      }));
    });

    <span class="hljs-comment">// Save to Supabase</span>
    <span class="hljs-keyword">for</span> (<span class="hljs-keyword">const</span> opp <span class="hljs-keyword">of</span> opportunities) {
      <span class="hljs-keyword">const</span> { data, error } = <span class="hljs-keyword">await</span> supabase
        .<span class="hljs-title function_">from</span>(<span class="hljs-string">'opportunities'</span>)
        .<span class="hljs-title function_">upsert</span>([opp], {
          <span class="hljs-attr">onConflict</span>: <span class="hljs-string">'source_url'</span>,
          <span class="hljs-attr">returning</span>: <span class="hljs-literal">true</span>
        });

      <span class="hljs-keyword">if</span> (error) {
        logger.<span class="hljs-title function_">error</span>(<span class="hljs-string">'Error saving opportunity:'</span>, error);
      } <span class="hljs-keyword">else</span> {
        logger.<span class="hljs-title function_">info</span>(<span class="hljs-string">'Saved opportunity:'</span>, data[<span class="hljs-number">0</span>].<span class="hljs-property">title</span>);
      }
    }

    logger.<span class="hljs-title function_">info</span>(<span class="hljs-string">`Scraped <span class="hljs-subst">${opportunities.length}</span> opportunities`</span>);
  } <span class="hljs-keyword">catch</span> (error) {
    logger.<span class="hljs-title function_">error</span>(<span class="hljs-string">'Scraping error:'</span>, error);
    <span class="hljs-keyword">throw</span> error;
  } <span class="hljs-keyword">finally</span> {
    <span class="hljs-keyword">await</span> browser.<span class="hljs-title function_">close</span>();
  }
}
