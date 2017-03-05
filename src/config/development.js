module.exports = {
  auth0 : {
    callbackURL:  'http://localhost:3000/callback'
  }, 
  api : {
    tenantStatusUrl: 'http://localhost:8080/api/tenants/:tenant_id/status'
  }
};