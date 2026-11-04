# RapidAPI Snippet Pipeline

The PredictKaro dashboard uses a **Zero-Configuration Snippet Pipeline** that entirely abstracts the configuration of API providers. 

Instead of writing provider configs or mapping responses by hand, you just paste raw Node.js (fetch) snippets into text files.

## Workflow: Adding a New Provider

### 1. Create a Snippet File
Go to RapidAPI, subscribe to a data provider, and copy the **Node.js (Fetch)** code snippet exactly as given.

Create a `.txt` file in `frontend/src/config/rapidapi/snippets/` using the following naming convention:
`[Store]-[Priority].txt`
*(Example: `amazon-2.txt` means this is an Amazon provider acting as fallback level 2)*

Paste the snippet. 
**Important**: Ensure the snippet is the `fetch` version, not axios or jQuery.

### 2. Run the Validation Engine
Open your terminal and run:
```bash
npm run validate-snippets
```

**What happens under the hood?**
1. The parser reads your `.txt` snippet.
2. It automatically identifies URL search parameters (like `q`, `query`, `keyword`) and replaces them with a dynamic `{{query}}` token.
3. It extracts your RapidAPI Key directly from the snippet.
4. It receives the real JSON data from the API and runs a **Heuristic Scan**.
5. The Heuristic Scan automatically detects which JSON paths contain the product title, price, image, and url.
6. It generates a perfect configuration mapping at `frontend/src/config/rapidapi/mappings/`.

### 3. Review Mapping (If Needed)
If the API returns extremely unusual JSON, the Heuristic Scan will have low confidence. It will generate a stub in `mappings/` with `"requires_review": true`. You must open that `.mapping.json` file and manually enter the correct JSON paths before it will work.

### 4. You're Done
The `validate-snippets` script compiles everything into `generatedProviders.ts`. The main Next.js search engine now uses your new API, complete with seamless rate-limit fallback protection.

No code modifications required!

## Running Audits
If you ever want to check if your API keys and snippets are valid without executing live API hits, run:
```bash
npm run audit-providers
```
This will statically analyze your configurations for duplicate signatures and missing parameters.
