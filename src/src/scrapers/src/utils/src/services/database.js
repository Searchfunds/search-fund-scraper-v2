<span class="hljs-keyword">import</span> { createClient } <span class="hljs-keyword">from</span> <span class="hljs-string">'@supabase/supabase-js'</span>;
<span class="hljs-keyword">import</span> dotenv <span class="hljs-keyword">from</span> <span class="hljs-string">'dotenv'</span>;

dotenv.<span class="hljs-title function_">config</span>();

<span class="hljs-keyword">const</span> supabaseUrl = process.<span class="hljs-property">env</span>.<span class="hljs-property">SUPABASE_URL</span> || <span class="hljs-string">'https://jjoprxqcgosdxkvrxhti.supabase.co'</span>;
<span class="hljs-keyword">const</span> supabaseKey = process.<span class="hljs-property">env</span>.<span class="hljs-property">SUPABASE_KEY</span> || <span class="hljs-string">'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqb3ByeHFjZ29zZHhrdnJ4aHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNjM4MTQsImV4cCI6MjA1ODczOTgxNH0.R6lvnVokXU4UOCC07VxiWw9-fKwlxBbblKZlu_ParKc'</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> supabase = <span class="hljs-title function_">createClient</span>(supabaseUrl, supabaseKey);
