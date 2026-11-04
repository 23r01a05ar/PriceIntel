export interface ParsedProviderConfig {
  host: string;
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  body?: string;
}

// Extract base path and query parameters from a full URL path
function extractEndpointAndParams(fullPath: string): { endpoint: string, queryParams: Record<string, string> } {
  try {
    // Prefix with a dummy domain to use URL parser
    const url = new URL(fullPath, 'http://dummy.com');
    const queryParams: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    return {
      endpoint: url.pathname,
      queryParams
    };
  } catch (e) {
    return { endpoint: fullPath, queryParams: {} };
  }
}

class PythonParser {
  static parse(snippet: string): ParsedProviderConfig | null {
    const hostMatch = snippet.match(/HTTPSConnection\("([^"]+)"\)/);
    const methodMatch = snippet.match(/conn\.request\("([^"]+)"/);
    const pathMatch = snippet.match(/conn\.request\("[^"]+",\s*"([^"]+)"/);
    
    // Extract headers (basic extraction for Python dictionaries)
    const headers: Record<string, string> = {};
    const headersBlockMatch = snippet.match(/headers\s*=\s*{([^}]+)}/);
    if (headersBlockMatch) {
      const headerLines = headersBlockMatch[1].split(',');
      headerLines.forEach(line => {
        const match = line.match(/'([^']+)'\s*:\s*"([^"]+)"/);
        if (match) {
          headers[match[1]] = match[2];
        }
      });
    }

    let body: string | undefined = undefined;
    const payloadMatch = snippet.match(/payload\s*=\s*"(.*)"/);
    if (payloadMatch) {
      // payloadMatch[1] contains the string inside the double quotes.
      // E.g., for JSON: {\"queries\":[\"build a website\"...]}
      // We need to unescape any python escaped quotes so it's a valid JSON string or URL string
      let rawBody = payloadMatch[1];
      rawBody = rawBody.replace(/\\"/g, '"');
      body = rawBody;
    }

    if (!hostMatch || !methodMatch || !pathMatch) return null;

    const { endpoint, queryParams } = extractEndpointAndParams(pathMatch[1]);

    return {
      host: hostMatch[1],
      method: methodMatch[1],
      endpoint,
      headers,
      queryParams,
      body
    };
  }
}

class NodeParser {
  static parse(snippet: string): ParsedProviderConfig | null {
    // Example regex for native fetch or axios or unirest inside Node.js
    // For now we assume a standard fetch options object block
    const hostMatch = snippet.match(/hostname:\s*['"]([^'"]+)['"]/);
    const pathRegexMatch = snippet.match(/path:\s*['"]([^'"]+)['"]/);
    const methodMatch = snippet.match(/method:\s*['"]([^'"]+)['"]/);

    if (!hostMatch || !pathRegexMatch || !methodMatch) return null;
    
    const { endpoint, queryParams } = extractEndpointAndParams(pathRegexMatch[1]);

    // Very naive header parser for node snippets
    const headers: Record<string, string> = {};
    const headersBlock = snippet.match(/headers:\s*{([^}]+)}/);
    if (headersBlock) {
      const headerLines = headersBlock[1].split(',');
      headerLines.forEach(line => {
        const match = line.match(/['"]?([^'"]+)['"]?\s*:\s*['"]([^'"]+)['"]/);
        if (match) {
          headers[match[1]] = match[2];
        }
      });
    }

    return {
      host: hostMatch[1],
      method: methodMatch[1],
      endpoint,
      headers,
      queryParams
    };
  }
}

class CurlParser {
  static parse(snippet: string): ParsedProviderConfig | null {
    const urlMatch = snippet.match(/curl\s+(?:--request\s+([A-Z]+)\s+)?(?:--url\s+)?'([^']+)'/);
    if (!urlMatch) return null;

    const method = urlMatch[1] || 'GET';
    const fullUrlString = urlMatch[2];

    try {
      const url = new URL(fullUrlString);
      const queryParams: Record<string, string> = {};
      url.searchParams.forEach((val, key) => {
        queryParams[key] = val;
      });

      const headers: Record<string, string> = {};
      const headerMatches = Array.from(snippet.matchAll(/--header\s+'([^:]+):\s*([^']+)'/g));
      headerMatches.forEach(match => {
        headers[match[1]] = match[2];
      });

      let body: string | undefined = undefined;
      const dataMatch = snippet.match(/--data\s+'([^']+)'/);
      if (dataMatch) {
        body = dataMatch[1];
      }

      return {
        host: url.hostname,
        endpoint: url.pathname,
        method,
        headers,
        queryParams,
        body
      };
    } catch (e) {
      return null;
    }
  }
}

export function parseSnippet(snippet: string): ParsedProviderConfig | null {
  if (!snippet || snippet.trim() === '') return null;

  if (snippet.includes('http.client') || snippet.includes('requests.get')) {
    return PythonParser.parse(snippet);
  } else if (snippet.includes('curl ')) {
    return CurlParser.parse(snippet);
  } else if (snippet.includes('require(') || snippet.includes('fetch(')) {
    return NodeParser.parse(snippet);
  }

  // Fallback try all
  return PythonParser.parse(snippet) || NodeParser.parse(snippet) || CurlParser.parse(snippet);
}
