# Integration TODO

Backend: https://bobtronics-store-backend.onrender.com/api/v1
API base: NEXT_PUBLIC_API_URL ends with /api/v1. All paths end with a trailing slash.
Status key: VERIFIED = tested against real backend; UNVERIFIED = built from docs only; BROKEN = tested, wrong status/body.

## Schema
- GET /api/schema/ -> 404 Not Found (no OpenAPI schema exposed by backend)
- GET /api/schema/?format=json -> 404 Not Found
- GET /swagger.json -> 404 Not Found
- No schema available; all types are built from assumptions and live testing.

## CORS (verified)
- Origin: http://localhost:3000 sends `access-control-allow-origin: http://localhost:3000` on all responses.
- OPTIONS preflight on /auth/login/ returns allow-headers: accept, authorization, content-type, user-agent, x-csrftoken, x-requested-with, ngrok-skip-browser-warning.
- CORS is working; no backend changes needed.

## Database state
- Empty: no products, no categories, no promotions, no reviews. All list endpoints return empty results.

## Assumptions (unverified until backend has data)
- Backend product id is an integer; frontend Product.id is a string (String(backend product_id)).
- Backend prices are strings in decimal format; frontend converts to Number.
- Backend OrderList.status values: pending, confirmed, processing, shipped, delivered, cancelled.
- Backend Delivery status values: pending, in_transit, out_for_delivery, delivered, failed, returned.
- Backend Service status values: new, in_progress, completed, cancelled.
- Login error detail for unactivated account assumed detectable via response body (not yet tested â€” cannot log in).
- 401 on any apiFetch triggers one /auth/refresh/ attempt; if refresh fails, tokens cleared and redirect to /sign-in.
- Admin role check assumes User.role === "admin" or "super_admin".

## Endpoints (one line each)

### PHASE 1 - Public pages
- GET /health/ -> src/lib/health.ts healthCheck, VERIFIED (200, {"status":"ok"})
- GET /catalog/products/ -> src/services/products.ts getProducts, VERIFIED (200, paginated {"count":0,"results":[]})
- GET /catalog/products/{id}/ -> src/services/products.ts getProduct, VERIFIED (404 for nonexistent id; getProduct returns undefined)
- GET /catalog/categories/ -> src/services/products.ts getCategories, VERIFIED (200, PLAIN ARRAY [] â€” NOT paginated; fixed mapper to handle both shapes)
- GET /catalog/categories/{category_id}/products/ -> src/services/products.ts getRelatedProducts, UNVERIFIED (no categories exist to test with)
- GET /promotions/active/ -> src/services/promotions.ts getActivePromotions, VERIFIED (200, paginated {"count":0,"results":[]})
- GET /catalog/active/ -> src/services/promotions.ts (fallback), VERIFIED (200, same shape as /promotions/active/)
- GET /promotions/products/{product_id}/ -> src/services/promotions.ts getProductDiscount, UNVERIFIED (no products exist to test with)
- GET /reviews/ -> src/services/reviews.ts getReviews, VERIFIED (200, paginated {"count":0,"results":[]})
- GET /reviews/{id}/ -> src/services/reviews.ts getReview, UNVERIFIED (no reviews exist to test with)
- GET /deliveries/track/{tracking_number}/ -> src/services/deliveries.ts trackDelivery, UNVERIFIED (no tracking numbers exist)

### PHASE 2 - Authentication
- POST /auth/login/ -> src/lib/auth.ts login, VERIFIED (200 for valid, 400 for invalid)
  - Error shape: {"success":false,"error":{"status_code":400,"details":{"detail":["Invalid email or password."]}}}
  - Fixed apiFetch to extract message from error.details.detail[0] instead of top-level detail.
- POST /auth/refresh/ -> src/lib/auth.ts refreshAccessToken, UNVERIFIED (needs valid refresh token)
- POST /accounts/register/ -> src/lib/auth.ts register, BROKEN (404 Not Found â€” endpoint does not exist at this path)
- GET /accounts/me/ -> src/lib/auth.ts getMe, UNVERIFIED (needs auth token; user not activated)
- POST /accounts/logout/ -> src/lib/auth.ts logout, UNVERIFIED (needs auth token)
- POST /accounts/activate/ -> src/lib/auth.ts activate, UNVERIFIED (needs uid/token from email)
- GET /accounts/activate/ -> src/lib/auth.ts activateFromEmailLink, UNVERIFIED (query-param shape not confirmed)
- POST /accounts/password-reset/ -> src/lib/auth.ts passwordReset, UNVERIFIED (needs email)
- POST /accounts/password-reset/confirm/ -> src/lib/auth.ts passwordResetConfirm, UNVERIFIED (needs uid/token/new_password)

### PHASE 3 - Cart and wishlist (login required)
- GET /cart/ -> src/hooks/useCart, UNVERIFIED (needs auth token)
- POST /cart/items/ -> src/hooks/useCart, UNVERIFIED (needs auth token)
- PATCH /cart/items/{cart_item_id}/ -> src/hooks/useCart, UNVERIFIED (needs auth token)
- DELETE /cart/items/{cart_item_id}/ -> src/hooks/useCart, UNVERIFIED (needs auth token)
- POST /cart/clear/ -> src/hooks/useCart, UNVERIFIED (needs auth token)
- GET /wishlist/ -> src/hooks/useWishlist, UNVERIFIED (needs auth token)
- POST /wishlist/items/ -> src/hooks/useWishlist, UNVERIFIED (needs auth token)
- DELETE /wishlist/items/{product_id}/ -> src/hooks/useWishlist, UNVERIFIED (needs auth token)
- POST /wishlist/items/{product_id}/move-to-cart/ -> src/hooks/useWishlist, UNVERIFIED (needs auth token)

### PHASE 4 - Orders, checkout, services, reviews (login required)
- POST /orders/checkout/ -> src/services/checkout.ts placeOrder, UNVERIFIED (needs auth token)
- GET /orders/ -> src/services/account.ts getOrders, UNVERIFIED (needs auth token)
- GET /orders/{order_id}/ -> src/services/account.ts getOrder, UNVERIFIED (needs auth token)
- POST /orders/{order_id}/cancel/ -> src/services/account.ts cancelOrder, UNVERIFIED (needs auth token)
- GET /deliveries/orders/{order_id}/ -> src/services/deliveries.ts getDeliveryForOrder, UNVERIFIED (needs auth token)
- GET /services/ -> src/services/services.ts getServices, UNVERIFIED (needs auth token)
- POST /services/ -> src/services/services.ts createService, UNVERIFIED (needs auth token)
- GET /services/{service_id}/ -> src/services/services.ts getService, UNVERIFIED (needs auth token)
- POST /reviews/ -> src/services/reviews.ts createReview, UNVERIFIED (needs auth token)
- Addresses: GET /customers/address/ exists for single residence/phone. No full address CRUD endpoint -> getAddresses returns [] when not mock.

### PHASE 5 - Admin / operations (admin login required)
- GET /catalog/admin/categories/ -> src/services/admin.ts adminListCategories, UNVERIFIED (verify authenticated list shape and browser loading/error states)
- POST /catalog/admin/categories/ -> src/services/admin.ts adminCreateCategory, UNVERIFIED (create body inferred as name/description/image because docs body was not supplied; verify field acceptance)
- GET/PUT/PATCH/DELETE /catalog/admin/categories/{category_id}/ -> src/services/admin.ts, UNVERIFIED (needs admin auth)
- GET /catalog/admin/images/ -> src/services/admin.ts adminListImages, UNVERIFIED (verify list filter and response shape)
- POST /catalog/admin/images/ -> src/services/admin.ts adminCreateImage, UNVERIFIED (multipart names assumed product/image/is_primary; verify upload and stored image response)
- GET/PUT/PATCH/DELETE /catalog/admin/images/{image_id}/ -> src/services/admin.ts, UNVERIFIED (needs admin auth)
- GET /catalog/admin/products/ -> src/services/admin.ts adminListProducts, UNVERIFIED (verify authenticated list shape and browser state)
- POST /catalog/admin/products/ -> src/services/admin.ts adminCreateProduct, UNVERIFIED (body inferred as category/name/description/brand/price/stock_quantity/warranty/is_available; verify exact API docs shape)
- GET/PUT/PATCH/DELETE /catalog/admin/products/{product_id}/ -> src/services/admin.ts, UNVERIFIED (needs admin auth)
- POST /catalog/admin/products/{product_id}/adjust-stock/ -> src/services/admin.ts adminAdjustStock, UNVERIFIED (delta/reason inferred; verify successful adjustment and resulting quantity)
- GET /catalog/admin/products/low-stock/ -> src/services/admin.ts adminLowStock, UNVERIFIED (verify low-stock criteria and response shape)
- GET /promotions/admin/discounts/ (main) -> src/services/admin.ts, UNVERIFIED (needs admin auth)
- POST /promotions/admin/discounts/ -> src/services/admin.ts, UNVERIFIED (needs admin auth)
- GET/PUT/PATCH/DELETE /promotions/admin/discounts/{discount_id}/ -> src/services/admin.ts, UNVERIFIED (needs admin auth)
- NOTE: /catalog/admin/discounts/ is a duplicate; use /promotions/admin/discounts/
- GET /customers/ -> src/services/admin.ts, UNVERIFIED (needs admin auth)
- GET /customers/{user_id}/ -> src/services/admin.ts, UNVERIFIED (needs admin auth)
- GET /services/admin/ -> src/services/admin.ts, UNVERIFIED (needs admin auth)
- GET/PATCH /services/admin/{service_id}/ -> src/services/admin.ts, UNVERIFIED (needs admin auth)
- GET /orders/admin/all/ -> src/services/admin.ts, UNVERIFIED (needs admin auth)
- PATCH /orders/admin/{order_id}/status/ -> src/services/admin.ts, UNVERIFIED (needs admin auth)

### Dashboard, orders, customers, service requests (current integration pass)
- GET /orders/admin/all/ -> `adminListOrders` -> UNVERIFIED (check real array/paginated shape, field aliases, totals, and list refresh after status changes)
- GET /orders/{order_id}/ -> `adminGetOrder` -> UNVERIFIED (check detail wrapper, order item fields, and whether detail includes fields absent from list)
- PATCH /orders/admin/{order_id}/status/ -> `adminPatchOrderStatus` -> UNVERIFIED (check accepted request key/status values, 400 field errors, and 403 handling)
- GET /customers/ -> `adminListCustomers` -> UNVERIFIED (check list shape, identifiers, and which profile fields are returned)
- GET /customers/{user_id}/ -> `adminGetCustomer` -> UNVERIFIED (check detail wrapper and profile field names)
- GET /services/admin/ -> `adminListServices` -> UNVERIFIED (check list shape, customer identifier, appointment and status field names)
- GET /services/admin/{service_id}/ -> `adminGetService` -> UNVERIFIED (check detail wrapper and returned fields)
- PATCH /services/admin/{service_id}/ -> `adminPatchService` -> UNVERIFIED (check accepted patch fields and status values)
- GET /catalog/admin/products/low-stock/ -> `adminLowStock` / `adminLowStockCount` -> UNVERIFIED (check response shape and backend low-stock criteria)

### FIELDS WITH NO BACKEND SOURCE
- Dashboard revenue, sales, previous-period comparisons, revenue time series, category sales, report export data, all-products total, delivery totals/readiness, and recent activity feed: no corresponding endpoint was supplied.
- Orders: customer display name, payment status, delivery status/method, product/SKU line details, and timeline/events are not guaranteed by the documented order fields; UI displays `—` where absent.
- Customers: last-active time, communication preferences, account activity, support conversation, and customer-specific order line details have no supplied source.
- Service requests: appointment date, customer display name, location, assigned specialist, priority, attachment, and activity history have no supplied source.
- These fields are rendered as `—` or an unavailable-state message unless the actual response includes a recognized field alias. All response aliases/status enumerations remain UNVERIFIED until checked against the live backend.

### Other operations pages still using demo interactions/data
- `src/app/operations/deliveries/page.tsx` -> static demo dispatch map; no admin deliveries-list endpoint was supplied (the listed delivery endpoints are per-order detail and public tracking).
- `src/app/operations/payments/page.tsx` -> hardcoded payment rows; no admin payments endpoint was supplied.
- `src/app/operations/reports/page.tsx` -> hardcoded product/report data; no reporting endpoint was supplied.
- `src/app/operations/notifications/page.tsx` -> demo customer notification feed/send interaction; no admin notifications endpoint was supplied.
- `src/app/operations/settings/page.tsx` -> settings save is local demo state; no admin settings endpoint was supplied.
- `src/app/operations/reviews/page.tsx` -> demo review reply interaction; the supplied review endpoints do not include an admin reply endpoint.
- `src/components/operations/OperationsShell.tsx` and `OperationsFrame.tsx` provide shared navigation/layout and do not own these demo datasets.
- These pages were outside the authorized page scope and remain unchanged in this integration pass.

## NO BACKEND ENDPOINT items
- Addresses full CRUD (only GET /customers/address/ exists for single residence/phone) -> getAddresses returns [] when not mock
- Operations dashboard, inventory, payments, notifications, reports, settings pages -> no endpoints, leave mock

## Code fixes applied during verification
1. src/lib/api.ts: apiFetch error extraction now reads error.details.detail[0], error.message, detail, or message (backend returns nested error shape, not flat detail).
2. src/services/products.ts: getCategories() now handles both paginated {count,results} and plain array [] responses (backend returns plain array).
3. src/services/account.ts: Removed silent mock fallbacks â€” getCurrentUser throws on fetch failure; getAddresses/getServiceRequests/getItServices/getTestimonials return [] when not mock (no mock data leakage).
4. No silent mock fallback remains anywhere in the codebase.

- Stock history table in src/app/operations/inventory/page.tsx -> UNVERIFIED / unavailable (no stock history endpoint supplied; UI reports this rather than showing fabricated movements).
- Catalog create/edit/delete and image upload UI in src/app/operations/{categories,products}/... -> UNVERIFIED (test with admin account; verify backend validation, permissions, and refresh behavior).
