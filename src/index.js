<span class="hljs-keyword">import</span> express <span class="hljs-keyword">from</span> <span class="hljs-string">'express'</span>;
<span class="hljs-keyword">import</span> cron <span class="hljs-keyword">from</span> <span class="hljs-string">'node-cron'</span>;
<span class="hljs-keyword">import</span> { scrapeSearchFunder } <span class="hljs-keyword">from</span> <span class="hljs-string">'./scrapers/searchfunder.js'</span>;
<span class="hljs-keyword">import</span> { logger } <span class="hljs-keyword">from</span> <span class="hljs-string">'./utils/logger.js'</span>;
<span class="hljs-keyword">import</span> { supabase } <span class="hljs-keyword">from</span> <span class="hljs-string">'./services/database.js'</span>;
<span class="hljs-keyword">import</span> dotenv <span class="hljs-keyword">from</span> <span class="hljs-string">'dotenv'</span>;

dotenv.<span class="hljs-title function_">config</span>();

<span class="hljs-keyword">const</span> app = <span class="hljs-title function_">express</span>();
<span class="hljs-keyword">const</span> port = process.<span class="hljs-property">env</span>.<span class="hljs-property">PORT</span> || <span class="hljs-number">3000</span>;

<span class="hljs-comment">// Health check endpoint</span>
app.<span class="hljs-title function_">get</span>(<span class="hljs-string">'/'</span>, <span class="hljs-function">(<span class="hljs-params">req, res</span>) =></span> {
  res.<span class="hljs-title function_">send</span>(<span class="hljs-string">'Search Fund Scraper is running'</span>);
});

<span class="hljs-comment">// Manual trigger endpoint</span>
app.<span class="hljs-title function_">get</span>(<span class="hljs-string">'/scrape'</span>, <span class="hljs-title function_">async</span> (req, res) => {
  <span class="hljs-keyword">try</span> {
    logger.<span class="hljs-title function_">info</span>(<span class="hljs-string">'Manual scrape triggered'</span>);
    <span class="hljs-keyword">await</span> <span class="hljs-title function_">scrapeSearchFunder</span>();
    res.<span class="hljs-title function_">send</span>(<span class="hljs-string">'Scraping completed successfully'</span>);
  } <span class="hljs-keyword">catch</span> (error) {
    logger.<span class="hljs-title function_">error</span>(<span class="hljs-string">'Error during manual scrape:'</span>, error);
    res.<span class="hljs-title function_">status</span>(<span class="hljs-number">500</span>).<span class="hljs-title function_">send</span>(<span class="hljs-string">'Error during scraping'</span>);
  }
});

<span class="hljs-comment">// Schedule scraping every 6 hours</span>
cron.<span class="hljs-title function_">schedule</span>(<span class="hljs-string">'0 */6 * * *'</span>, <span class="hljs-title function_">async</span> () => {
  <span class="hljs-keyword">try</span> {
    logger.<span class="hljs-title function_">info</span>(<span class="hljs-string">'Starting scheduled scrape'</span>);
    <span class="hljs-keyword">await</span> <span class="hljs-title function_">scrapeSearchFunder</span>();
    logger.<span class="hljs-title function_">info</span>(<span class="hljs-string">'Scheduled scrape completed'</span>);
  } <span class="hljs-keyword">catch</span> (error) {
    logger.<span class="hljs-title function_">error</span>(<span class="hljs-string">'Error during scheduled scrape:'</span>, error);
  }
});

app.<span class="hljs-title function_">listen</span>(port, <span class="hljs-function">() =></span> {
  logger.<span class="hljs-title function_">info</span>(<span class="hljs-string">`Server running on port <span class="hljs-subst">${port}</span>`</span>);
});
