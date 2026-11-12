// Contact API base URL (e.g. a serverless function that stores messages in Neon).
// Empty = the contact form opens the visitor's email app, addressed to Mazen.
window.PORTFOLIO_API = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? "" : "https://portfolio-contact-api-theta.vercel.app";
