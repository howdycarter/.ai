# Skill: Security Review

## When to use
Before any production launch or when handling user data.

## Workflow

### Step 1: Dependency audit
- Run dependency vulnerability scan (npm audit, OWASP)
- Flag any critical/high findings
- Verify no unnecessary dependencies

### Step 2: Authentication and authorization
- Verify auth is implemented correctly
- Check that all protected routes require authentication
- Verify authorization rules (users can only access their data)
- Check for privilege escalation paths

### Step 3: Input validation
- All user inputs validated server-side
- No raw user input rendered without sanitization
- File uploads validated (type, size, content)
- SQL/NoSQL injection prevention verified

### Step 4: Data exposure
- No API keys in client-side code
- No sensitive data in logs
- No sensitive data in URL parameters
- No excessive data returned from API endpoints
- Check for information leakage in error messages

### Step 5: Infrastructure
- HTTPS enforced
- CORS configured correctly
- Rate limiting in place
- CSP headers configured

### Step 6: Report
Document findings with severity (critical/high/medium/low).
Critical and high must be fixed before launch.
