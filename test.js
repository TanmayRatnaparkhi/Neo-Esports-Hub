// tests/test.js
// Basic test harness for client-side functions
// Run in browser console or include in a test runner environment.
// This file includes a sample test for coupon validation logic.

(async function(){
  console.log('Neo Esports Hub - basic tests');

  // Test 1: coupon validation
  try{
    if(typeof window.validateCouponClient !== 'function'){
      console.warn('validateCouponClient not found — ensure app.js loaded.');
    } else {
      const r1 = await window.validateCouponClient('NEO50');
      console.assert(r1.valid === true, 'NEO50 should be valid');
      const r2 = await window.validateCouponClient('NEO100');
      console.assert(r2.valid === true, 'NEO100 should be valid');
      const r3 = await window.validateCouponClient('notacode');
      console.assert(r3.valid === false, 'random should be invalid');
      console.log('Coupon validation tests OK', {r1,r2,r3});
    }
  }catch(err){
    console.error('Coupon tests error', err);
  }

  // You can extend tests to check CSV export, search debounce, etc.
  console.log('All basic tests executed.');
})();
