<span class="hljs-keyword">import</span> winston <span class="hljs-keyword">from</span> <span class="hljs-string">'winston'</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> logger = winston.<span class="hljs-title function_">createLogger</span>({
  <span class="hljs-attr">level</span>: <span class="hljs-string">'info'</span>,
  <span class="hljs-attr">format</span>: winston.<span class="hljs-property">format</span>.<span class="hljs-title function_">combine</span>(
    winston.<span class="hljs-property">format</span>.<span class="hljs-title function_">timestamp</span>(),
    winston.<span class="hljs-property">format</span>.<span class="hljs-title function_">json</span>()
  ),
  <span class="hljs-attr">transports</span>: [
    <span class="hljs-keyword">new</span> winston.<span class="hljs-property">transports</span>.<span class="hljs-title class_">Console</span>({
      <span class="hljs-attr">format</span>: winston.<span class="hljs-property">format</span>.<span class="hljs-title function_">combine</span>(
        winston.<span class="hljs-property">format</span>.<span class="hljs-title function_">colorize</span>(),
        winston.<span class="hljs-property">format</span>.<span class="hljs-title function_">simple</span>()
      )
    })
  ]
});
