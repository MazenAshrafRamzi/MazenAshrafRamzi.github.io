// Contact API base URL (e.g. a serverless function that stores messages in Neon).
// Empty = the contact form opens the visitor's email app, addressed to Mazen.
window.PORTFOLIO_API = location.hostname === "localhost" ? "" : "https://portfolio-contact-api-theta.vercel.app";
