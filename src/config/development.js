module.exports = {
  auth0 : {
    callbackURL:  'http://localhost:3000/callback'
  }, 
  api : {
    tenantStatusUrl: 'http://localhost:8080/api/tenants/:tenant_id/status', 
    tenantSubscriptionId: 'http://localhost:8080/api/tenants/:tenant_id/subscription'
  }, 
  chargify : {
    v1 : {
      key: 'TLAQURHAUOprug2Pw7PZTdydXSf0eoITwaqp5MBM', 
      password: 'X'
    },
    v2 : {
      keyid: '9ce21d30-e374-0134-45e9-021cdefe7da5',
      secret: 'lju1vdQyoRwDLqhZPO4XxE3naG2KG87fKS1RcYWKbJQ', 
      password: 'm8NTmCO5AltOvAz521DQWt5rS2bzlaHmarocNoL08'
    }
  }
};