// INFO: Clerk dashboard -> JWT Templates -> create "convex" -> COPY Issuer and PASTE in convex_domain value
const convex = {
  domain: "https://eager-lamb-60.clerk.accounts.dev",
  applicationID: "convex",
};

export default {
  providers: [convex],
};
