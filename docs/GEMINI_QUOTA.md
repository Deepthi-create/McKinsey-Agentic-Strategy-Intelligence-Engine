# Gemini Quota Handling

The backend defaults to `GEMINI_MODEL=gemini-2.5-flash-lite`, then retries `gemini-2.5-flash` if the configured model is unavailable or quota-limited. Google AI Studio projects may have zero free-tier quota for some models until billing/quota is enabled.

When Gemini returns a quota error:

- the API returns HTTP `429`
- the backend retries the next model in `GEMINI_MODEL_FALLBACKS`
- the response includes `retryAfterSeconds` when Google provides retry timing and all models fail
- research planning falls back to a deterministic, source-governed plan for human review
- extraction, aggregation, and report writing still require working Gemini quota because those steps must not fabricate evidence

Production options:

- enable billing/quota on the configured Google AI project
- use configured Gemini models with available quota by setting `GEMINI_MODEL` and `GEMINI_MODEL_FALLBACKS`
- reduce prompt size with `EXTRACTION_PROMPT_CONTENT_CHARS`
