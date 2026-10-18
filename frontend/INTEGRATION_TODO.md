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
- Product/category images -> diagnosis: mixed A/C/D/E. Some `primary_image`/`image` values are null (A); product mapping used `images[]` and ignored `primary_image` (E); valid absolute image URLs from `encrypted-tbn0.gstatic.com` and `t4.ftcdn.net` were missing from Next.js `remotePatterns` (C); one product value points to a Google search page returning `200 text/html`, not an image (D). Fixed by mapping `primary_image`, resolving relative URLs from `NEXT_PUBLIC_API_URL`, adding only verified image hosts, and showing placeholders for absent/failed images. Retest after restarting the dev server; replace the Google search URL with a direct image URL in backend data.
- GET /catalog/categories/{category_id}/products/ -> src/services/products.ts getRelatedProducts, UNVERIFIED (no categories exist to test with)
- GET /promotions/active/ -> src/services/promotions.ts getActivePromotions, VERIFIED (200, paginated {"count":0,"results":[]})
- GET /catalog/active/ -> src/services/promotions.ts (fallback), VERIFIED (200, same shape as /promotions/active/)
- GET /promotions/products/{product_id}/ -> src/services/promotions.ts getProductDiscount, UNVERIFIED (no products exist to test with)
- GET /reviews/ -> `src/services/reviews.ts` `getReviews`, VERIFIED (200 with paginated `{count:0,results:[]}`; code handles plain arrays too). The real list is shown on Operations / Reviews; populated item field aliases remain UNVERIFIED, so check the browser's development-only `[shape] GET /reviews/` field-name log when a review exists.
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
- POST /services/ -> `src/services/services.ts` `createService`, called by `src/components/services/ServiceRequestForm.tsx`, UNVERIFIED (test with a signed-in customer; confirm `name` and `service_type: "other"` semantics; appointment, location, phone, and email are included in description because the current input type has no separate fields; file attachments are not uploaded)
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
- GET /catalog/admin/products/low-stock/?threshold=5 -> `adminLowStock` / `adminLowStockCount`, VERIFIED (user supplied paginated response with 3 products; query parameter and response shape confirmed; the intended business cutoff and whether comparison is `<` or `<=` remain UNVERIFIED)
- GET /promotions/admin/discounts/ (main) -> src/services/admin.ts, UNVERIFIED (needs admin auth)
- POST /promotions/admin/discounts/ -> src/services/admin.ts, UNVERIFIED (needs admin auth)
- GET/PUT/PATCH/DELETE /promotions/admin/discounts/{discount_id}/ -> src/services/admin.ts, UNVERIFIED (needs admin auth)
- NOTE: /catalog/admin/discounts/ is a duplicate; use /promotions/admin/discounts/
- GET /customers/ -> src/services/admin.ts `adminListCustomers`, VERIFIED (browser response confirmed admin-authenticated paginated `{count,next,previous,results}` shape; result fields include `user_id`, `first_name`, `last_name`, and `email`)
- GET /customers/{user_id}/ -> src/services/admin.ts `adminGetCustomer`, VERIFIED (browser response confirmed detail fields `user_id`, `first_name`, `last_name`, `email`, `phone`, `residence`, `created_at`, `updated_at`, `is_active`, `role`, `total_orders`, `total_spent`, and `recent_orders`; recent order entries were empty in the observed response)
- GET /services/admin/ -> src/services/admin.ts `adminListServices`, VERIFIED (browser response confirmed authenticated paginated `{count,next,previous,results}` envelope; current result set is empty, so service fields remain UNVERIFIED)
- GET/PATCH /services/admin/{service_id}/ -> src/services/admin.ts, UNVERIFIED (needs admin auth)
- GET /orders/admin/all/ -> src/services/admin.ts `adminListOrders`, VERIFIED (browser response confirmed authenticated paginated `{count,next,previous,results}` envelope; current result set is empty, so order fields remain UNVERIFIED)
- PATCH /orders/admin/{order_id}/status/ -> src/services/admin.ts, UNVERIFIED (needs admin auth)

### Dashboard, orders, customers, service requests (current integration pass)
- GET /orders/admin/all/ -> `adminListOrders` -> VERIFIED (user supplied browser response confirmed paginated envelope and empty result; verify field aliases/totals when orders exist)
- GET /orders/{order_id}/ -> `adminGetOrder` -> UNVERIFIED (check detail wrapper, order item fields, and whether detail includes fields absent from list)
- PATCH /orders/admin/{order_id}/status/ -> `adminPatchOrderStatus` -> UNVERIFIED (check accepted request key/status values, 400 field errors, and 403 handling)
- GET /customers/ -> `adminListCustomers` -> VERIFIED (user supplied browser response; paginated list and customer id/name/email mapping confirmed; other profile fields remain UNVERIFIED)
- GET /customers/{user_id}/ -> `adminGetCustomer` -> VERIFIED (user supplied browser response; confirmed profile fields and empty `recent_orders` array; non-empty recent-order entry shape remains UNVERIFIED)
- GET /services/admin/ -> `adminListServices` -> VERIFIED (user supplied browser response confirmed paginated envelope and empty result; verify customer, appointment, and status field names when requests exist)
- GET /services/admin/{service_id}/ -> `adminGetService` -> UNVERIFIED (check detail wrapper and returned fields)
- PATCH /services/admin/{service_id}/ -> `adminPatchService` -> UNVERIFIED (check accepted patch fields and status values)
- GET /catalog/admin/products/low-stock/?threshold=5 -> `adminLowStock` / `adminLowStockCount` -> VERIFIED (user supplied successful paginated response; confirms `product_id`, `category`, `category_name`, `name`, `brand`, string `price`, `stock_quantity`, `warranty`, and `is_available` fields); threshold value `5` is accepted, but intended default and `<` versus `<=` behavior remain UNVERIFIED

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
- `src/app/operations/reviews/page.tsx` -> loads real `GET /reviews/` list; publish, hide, reply, and status tabs are disabled because no moderation endpoints/status contract was supplied.
- `src/components/operations/OperationsShell.tsx` and `OperationsFrame.tsx` provide shared navigation/layout and do not own these demo datasets.
- These pages were outside the authorized page scope and remain unchanged in this integration pass.
- Dashboard verification: user confirmed the low-stock alert displays `3` from the verified `/catalog/admin/products/low-stock/?threshold=5` response.

### Reviews list assumptions
- `src/services/reviews.ts` `getReviews` accepts either a plain array or a paginated object with `results`.
- `// UNVERIFIED: confirm populated review field aliases against the live backend.` The mapper checks `feedback_id`/`review_id`/`id`, author aliases `user_name`/`author`/`user`/`customer_name`, product aliases `product_name`/`product`, rating/score, `created_at`/date/created, comment/text/review, and status/status_display. Missing display values render as `—`; a numeric user id is displayed as `user-<id>` and numeric product id as `#<id>`.
- Publish/hide/reply actions and review status filtering have no supplied backend endpoint or verified status field; buttons and status tabs are disabled and labeled unavailable.

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

## Integration pass 2026-10-19 (remaining endpoints wired)
Live checks this pass: GET /catalog/products/ (6 products), /catalog/products/{id}/ (detail has description, warranty, images[]), /catalog/products/?search= and ?category= (both filter), /catalog/categories/ (plain array), /catalog/categories/{id}/products/, /promotions/active/ and /reviews/ (both paginated, empty), /promotions/products/{id}/ (has_discount=false shape), /health/ (ok), /deliveries/track/{unknown}/ (404 error envelope).

### Fixed: account pages now really call the backend
- src/app/account/page.tsx, account/orders/page.tsx, account/orders/[id]/page.tsx, account/[section]/page.tsx, checkout/page.tsx were server components, but authApiFetch returns {} on the server (no browser token), so GET /orders/, /orders/{id}/ and /accounts/me/ never ran. They are now client components with loading/error/empty states.
- src/services/account.ts maps backend order statuses (pending/confirmed/processing/shipped/delivered/cancelled) onto the UI statuses and builds the timeline from the status. estimatedDelivery, paymentMethod and paymentReference have NO BACKEND SOURCE and render as "to be confirmed"/"—".

### Newly wired endpoints
- POST /accounts/logout/ -> AccountSidebar "Logout" button and OperationsFrame "Sign out", UNVERIFIED (needs a signed-in session).
- POST /accounts/activate/ -> src/app/(auth)/activate/page.tsx (reads ?uid=&token= or manual entry), UNVERIFIED (email link format unknown). GET /accounts/activate/ -> activateFromEmailLink now sends ?uid=&token=, UNVERIFIED.
- POST /accounts/password-reset/ -> src/app/(auth)/forgot-password/page.tsx (linked from the sign-in form), UNVERIFIED.
- POST /accounts/password-reset/confirm/ -> src/app/(auth)/reset-password/page.tsx (?uid=&token=), UNVERIFIED.
- POST /accounts/token/refresh/ -> fallback in refreshAccessToken when /auth/refresh/ returns 404, UNVERIFIED.
- GET /promotions/active/ -> applyPromotions on home, shop and related products (discounted price + "Save" badge on cards), VERIFIED empty list; populated fields UNVERIFIED.
- GET /promotions/products/{product_id}/ -> product page price block, VERIFIED has_discount=false shape.
- GET/POST/PATCH/DELETE /promotions/admin/discounts/ -> new src/app/operations/promotions/page.tsx (nav entry "Promotions"), UNVERIFIED (discount_type values assumed "percentage"/"fixed"; dates sent as ISO strings).
- GET/PATCH/DELETE /catalog/admin/images/ -> src/components/operations/ProductImagesPanel.tsx inside the product edit panel on operations/products, UNVERIFIED (?product= filter assumed; client-side filter as backup).
- POST /wishlist/items/{product_id}/move-to-cart/ -> useWishlist.moveToCart + "Move to Cart" button on the account wishlist grid, UNVERIFIED.
- GET /cart/ -> useCart now accepts a plain list or {items|results|cart_items: []}, UNVERIFIED. /cart/clear/ tries DELETE then POST on 405.
- GET /reviews/ -> home page testimonials (latest 3) and src/components/product/ProductReviews.tsx (per product, ?product= filter + client filter), VERIFIED empty list.
- POST /reviews/ -> ProductReviews "Write a review" form (now uses authApiFetch, shows sign-in prompt on 401), UNVERIFIED.
- GET /services/ -> account overview "Your IT request" card and new src/app/account/it-requests/page.tsx, UNVERIFIED.
- GET /services/{service_id}/ -> new src/app/account/it-requests/[id]/page.tsx, UNVERIFIED.
- POST /services/ -> contact page form now reads its fields (was sending empty values) and shows the backend error / sign-in hint, UNVERIFIED.
- POST /orders/{order_id}/cancel/ -> "Cancel order" button on account/orders/[id] (shown for Processing/Packed), UNVERIFIED.
- GET /deliveries/orders/{order_id}/ -> delivery card on account/orders/[id] (now uses authApiFetch; 404 = no delivery yet), UNVERIFIED.
- GET /deliveries/track/{tracking_number}/ -> new public src/app/track/page.tsx (sidebar "Track Order" and order page "Track package" link), VERIFIED 404 envelope only.
- GET /health/ -> OperationsFrame sidebar status card ("All systems operational" / "Backend unreachable"), VERIFIED.
- GET /accounts/me/ residence/phone -> getAddresses returns the profile residence as the single default address (checkout prefill, addresses section), UNVERIFIED.
- GET /catalog/categories/ -> Header categories menu (was mock data), VERIFIED.

### Still NO BACKEND ENDPOINT (unchanged, demo state)
- Profile edit / change password (only GET /accounts/me/ exists), address book CRUD, saved payment methods, support tickets, customer notifications, newsletter, Google sign-in.
- Operations: payments, deliveries list/courier assignment, reports, notifications, settings, review moderation (publish/hide/reply), stock history, dashboard revenue/sales.
- IT services catalogue (the three service cards are static copy); order estimated delivery date, payment method/reference; product ratings/review counts on cards (reviews are only loaded per product page).
- Local (signed-out) cart is not merged into the backend cart on sign-in.

## Images and home page design (2026-10-19)
- Why uploaded images did not display: the backend only stores an image URL (POST /catalog/admin/images/ with image_url); there is no file upload. Product 4 ("sumsung s26 Ultra") was saved with a Google *search results* link (returns text/html, not an image), so browsers cannot render it. Products 5, 6, 8 and 10 have no image attached at all. Product 9 (gstatic thumbnail) and the category images render fine.
- Fix: the Add product form and the product image panel now preview the pasted link and warn when it is not an image file. Use "Copy image address" on the picture itself (link ends in .jpg/.png/.webp).
- Home page background: /images/background.png is the Figma node 1667-197 (1280 x 3466). It was shown with cover + fixed, so only its flat top strip was visible; it now spans the page width and scrolls with the page, and the home wrapper tint was removed.
- Category cards fall back to the bundled photos for phones/laptops/accessories/gaming when the backend category has no image; taglines are clamped to two lines.
- IT services block is static site content (src/lib/it-services.ts) rendered inside a white panel as in the design.
