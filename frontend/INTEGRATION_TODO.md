# Integration TODO

Backend: https://bobtronics-store-backend.onrender.com/api/v1
API base: NEXT_PUBLIC_API_URL ends with /api/v1. All paths end with a trailing slash.
Status key: VERIFIED = tested against real backend; UNVERIFIED = built from docs only; BROKEN = tested, wrong status/body.

## Current live verification snapshot (2026-10-21)

This snapshot is authoritative and supersedes earlier dated UNVERIFIED/BROKEN notes below where results conflict. Live probes used 90-second requests with one retry, printed statuses/field names only, and created only AI TEST records.

### VERIFIED
- Public: `GET /catalog/products/` 200; product detail and category products 200; `GET /catalog/categories/` 200 plain array; `GET /promotions/products/4/` 200 with `has_discount`, product, price, discount, savings, and date fields.
- Auth: customer/admin `POST /auth/login/` 200, keys `message`, `user`, `tokens` (tokens at `tokens.access` and `tokens.refresh`); customer `POST /auth/refresh/` 200, keys `access`, `refresh`; `GET /accounts/me/` 200 with `user_id`, `first_name`, `last_name`, `email`, `phone`, `residence`, `role`, `created_at`, `updated_at`; fresh-token `POST /accounts/logout/` 200.
- Customer cart: `GET /cart/` 200, `success/data` wrapper with `items`, `total_items`, `total_price`, `has_out_of_stock_items`; `POST /cart/items/` 201, `PATCH /cart/items/{id}/` 200, `DELETE /cart/items/{id}/` 200 on this run's items.
- Customer wishlist: `GET /wishlist/` 200, `success/data` wrapper with `items`, `total_saved`; `POST /wishlist/items/` 201; move-to-cart 200. Moving removes the wishlist record; the subsequent DELETE returned 404 for that already-removed item. `useWishlist` now unwraps the real envelope and presents load errors/retry.
- Customer orders: `POST /orders/checkout/` 201 with the form's `shipping_address`, `phone`, and `delivery_method`; order detail keys include `items`, `delivery`, payment fields, and dates. `GET /orders/` 200 paginated; `GET /orders/{id}/` 200; `POST /orders/{id}/cancel/` 200. Exactly one test order was placed and canceled.
- Customer delivery: `GET /deliveries/orders/{id}/` 200; tracking by that order's number 200. `GET /customers/address/` 200 with `residence`, `phone`.
- Services: customer list/create/detail 200/201/200; `service_type: "other"` accepted. Admin list/detail/PATCH work; invalid status is 400 on `status`; accepted values are `new`, `in_progress`, `completed`.
- Reviews: customer create 201; list, product-filtered list, and detail 200. Fields are `feedback_id`, `user`, `product`, `rating`, `comment`, `created_at`, `updated_at`; `user` and `product` are scalar IDs. `OPTIONS /reviews/{created_id}/` is 200 with `Allow: GET, HEAD, OPTIONS`.
- Admin orders/customers: order list/detail, customer list/detail 200. Invalid order status is 400 on `status`; accepted values are `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`.
- Admin deliveries: delivery list, couriers, and fees 200. Fee records use `method`, `name`, `fee`, `estimated_days`.
- Admin catalog: categories, products, images list 200. Product create with the Add Product form's fields 201; stock adjustment 200; stock history 200 with `movement_id`, `delta`, `quantity_before`, `resulting_stock_quantity`, `movement_type`, `reason`, `user`, `created_at`. The AI TEST movement was present. Image list filter `?product=` is accepted and paginated.
- Admin discounts: list 200; AI TEST discount create 201, detail 200, delete 204.
- Profile/password validation: invalid-type `PATCH /accounts/me/` returns 400 on `first_name`; wrong-current-password returns 400 on `current_password`. No profile or password was changed.
- Admin review moderation is absent: review detail OPTIONS allows only GET, HEAD, OPTIONS. No active page uses the `DemoDataBadge` component; review moderation controls remain disabled.
- Post-integration regression: customer and admin login/logout, customer profile, public products/categories, customer cart/orders, admin customer list/detail, admin orders, and admin deliveries/couriers/fees all returned 200 (logout 200) after the final code changes.

### BROKEN / NOT PROVIDED
- `GET /deliveries/methods/` -> 404 Not Found. `getDeliveryMethods()` now uses the verified `GET /deliveries/fees/` fields instead.
- `PATCH /deliveries/admin/{id}/` with invalid status -> 400, field `status`, message `Request validation failed`. Courier-key probes `courier`, `courier_id`, `assigned_courier`, `assigned_courier_id` each returned 500. Do not add courier assignment controls; no accepted courier field was confirmed.
- `DELETE /services/{id}/` -> 405, `Method "DELETE" not allowed.` The AI TEST service request cannot be removed.
- `DELETE /catalog/admin/products/{id}/` for the created AI TEST product -> 409, `This item cannot be deleted because other records depend on it. Deactivate it instead.` The product was deactivated and its stock restored to zero; it remains due to its stock-history records.
- Review moderation has no write method; there is no publish/hide/reply endpoint.

### UNVERIFIED / SAFETY-SKIPPED
- `DELETE /cart/clear/` and `POST /cart/clear/` were skipped: the customer account is not confirmed dedicated to testing. This run individually removed the item it added; checkout consumed its own cart line.
- Successful `PATCH /accounts/me/` and successful `POST /accounts/change-password/` are unverified; no real account values/password were changed.
- Account activation, password-reset flows, and successful Google sign-in require email-link/reset tokens or a real third-party credential; they were not exercised.
- Product/category/image update methods other than the tested product PATCH, discount PUT/PATCH, and image mutations were not exercised because they would require modifying existing records or additional AI TEST records.
- Active promotion item mapping remains unverified for populated public results. Review status and verified-purchase status are not returned; missing values display as `—` and no purchase-verification label is shown.
- Delivery status values beyond the invalid-status validation, successful delivery status changes, and accepted courier assignment remain unverified.

### Test records and integration follow-up
- Order `3`: created from the customer's AI TEST cart line, read in customer/admin paths, canceled successfully.
- Service request `2` and review `1`: created as AI TEST records; service DELETE returned 405; review OPTIONS showed no DELETE/write method. Both remain.
- Product `13`: created, adjusted `0 → 1`, history confirmed, stock reset to `0`, deactivated; deletion was refused with 409.
- Discount `3`: created against product `13` and deleted with 204.
- Cart line `10` was individually deleted; line `11` was consumed by checkout. Wishlist product `12` was moved to cart (removing the wishlist entry); cart clear was not called.
- A reused name `AI TEST Product` was rejected on `name`; retrying with a unique AI TEST name succeeded. No existing AI TEST record was modified or deleted.
- Integration fix: the live `{success, data}` wishlist envelope was previously read as empty; `useWishlist` now unwraps `data.items` and exposes loading/error/retry. Review cards no longer claim “Verified purchase/customer” because that field is absent. Delivery fee mapping now uses the observed `method`, `name`, `fee`, `estimated_days` fields rather than the missing `/deliveries/methods/` route.

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
- Populated catalog: the earlier live pass returned six products and categories; review and promotion lists were observed empty in earlier responses. Current filtered product requests return 200 and include average_rating and review_count.

## Assumptions (unverified until backend has data)
- Backend product id is an integer; frontend Product.id is a string (String(backend product_id)).
- Backend prices are strings in decimal format; frontend converts to Number.
- Backend OrderList.status values: pending, confirmed, processing, shipped, delivered, cancelled.
- Backend Delivery status values: pending, in_transit, out_for_delivery, delivered, failed, returned.
- Backend Service status values: new, in_progress, completed, cancelled.
- Login error detail for unactivated account assumed detectable via response body (not yet tested â€” cannot log in).
- 401 on any apiFetch triggers one /auth/refresh/ attempt; if refresh fails, tokens cleared and redirect to /sign-in.
- Admin guard requires `profile.role === "super_admin"`.

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
- POST /accounts/register/ -> src/lib/auth.ts register, VERIFIED (2026-10-19: empty unauthenticated body returned 400 with required fields first_name, last_name, email, password, password_confirm; endpoint exists)
- GET /accounts/me/ -> src/lib/auth.ts getMe, VERIFIED (200, fields: user_id, first_name, last_name, email, phone, residence, role, created_at, updated_at)
- POST /accounts/logout/ -> src/lib/auth.ts logout, UNVERIFIED (needs auth token)
- POST /accounts/activate/ -> src/lib/auth.ts activate, UNVERIFIED (needs uid/token from email)
- GET /accounts/activate/ -> src/lib/auth.ts activateFromEmailLink, UNVERIFIED (query-param shape not confirmed)
- POST /accounts/password-reset/ -> src/lib/auth.ts passwordReset, UNVERIFIED (needs email)
- POST /accounts/password-reset/confirm/ -> src/lib/auth.ts passwordResetConfirm, UNVERIFIED (needs uid/token/new_password)

### PHASE 3 - Cart and wishlist (login required)
- GET /cart/ -> src/hooks/useCart, VERIFIED (200, shape {success, data}, data fields: items, total_items, total_price, has_out_of_stock_items)
- POST /cart/items/ -> src/hooks/useCart, VERIFIED (201 with in-stock product, shape {success, message, data}, data fields: cart_item_id, product, quantity, subtotal, is_in_stock, added_at; 400 if out of stock)
- PATCH /cart/items/{cart_item_id}/ -> src/hooks/useCart, UNVERIFIED (needs auth token + existing cart_item_id)
- DELETE /cart/items/{cart_item_id}/ -> src/hooks/useCart, UNVERIFIED (needs auth token + existing cart_item_id)
- DELETE /cart/clear/ -> src/hooks/useCart, UNVERIFIED (test credentials were unavailable in the integration shell; customer cart clear was not re-tested)
- POST /cart/clear/ -> src/hooks/useCart, VERIFIED from prior live check (200, shape {success, message, deleted_count}); this pass could not re-test because test credentials were unavailable
- GET /wishlist/ -> src/hooks/useWishlist, UNVERIFIED (needs auth token)
- POST /wishlist/items/ -> src/hooks/useWishlist, UNVERIFIED (needs auth token)
- DELETE /wishlist/items/{product_id}/ -> src/hooks/useWishlist, UNVERIFIED (needs auth token)
- POST /wishlist/items/{product_id}/move-to-cart/ -> src/hooks/useWishlist, UNVERIFIED (needs auth token)

### PHASE 4 - Orders, checkout, services, reviews (login required)
- POST /orders/checkout/ -> src/services/checkout.ts placeOrder, UNVERIFIED (needs auth token)
- GET /orders/ -> src/services/account.ts getOrders, VERIFIED (200, paginated {count,next,previous,results}, first result fields: order_id, customer_email, customer_name, order_date, status, status_display, total_amount, total_items, shipping_address, phone, payment_status, payment_method, payment_reference, delivery_status, estimated_delivery, created_at)
- GET /orders/{order_id}/ -> src/services/account.ts getOrder, VERIFIED (200, shape {success, data}, data fields: order_id, customer_email, customer_name, order_date, status, status_display, total_amount, shipping_address, phone, payment_status, payment_method, payment_reference, estimated_delivery, items, delivery, created_at, updated_at)
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
- GET /deliveries/admin/ -> src/services/admin.ts adminListDeliveries, VERIFIED from supplied/live response (paginated; fields: delivery_id, order, delivery_address, delivery_method, tracking_number, status, shipping_fee, shipped_at, delivered_at, created_at, updated_at); current pass could not re-test without test credentials
- GET /catalog/admin/products/ -> src/services/admin.ts adminListProducts, VERIFIED (200, paginated, fields: product_id, category, category_name, name, description, brand, price, stock_quantity, warranty, is_available, average_rating, review_count, images, created_at, updated_at)
- GET /promotions/admin/discounts/ -> src/services/admin.ts adminListDiscounts, VERIFIED (200, shape {success, error}, empty results)
- GET /services/admin/ -> src/services/admin.ts adminListServices, VERIFIED (200, shape {success, error}, empty results)
- GET /deliveries/fees/ -> VERIFIED (200, shape {success, data}, data type: array(3))

### Admin endpoints with recorded 404 results
- GET /admin/dashboard/ -> 404
- GET /dashboard/admin/ -> 404
- GET /dashboard/ -> 404
- GET /reviews/admin/ -> 404 (no admin reviews endpoint)
- GET /admin/reviews/ -> 404
- GET /catalog/admin/stock-history/ -> 404 (older probe used this incorrect path; does not establish the product-specific endpoint status)
- GET /stock-history/ -> 404 (older alternate path)
- GET /deliveries/couriers/ -> 404 (older probe used this incorrect path; does not establish `/deliveries/admin/couriers/` status)
- GET /catalog/admin/products/{product_id}/stock-history/ -> UNVERIFIED (correct path supplied for product 4; admin login could not be tested because TEST_ADMIN_* variables were unavailable to this shell)
- GET /deliveries/admin/couriers/ -> UNVERIFIED (correct path supplied; admin login could not be tested because TEST_ADMIN_* variables were unavailable to this shell)
- GET /admin/deliveries/fees/ -> 404 (use /deliveries/fees/ instead)

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
- Orders: product/SKU line details and timeline/events have no supplied source; confirmed order fields (including customer name, payment status/method/reference, delivery status, and estimated delivery) are shown and missing values render as `â€”`.
- Customers: communication preferences, account activity, support conversation, and customer-specific order line details have no supplied source. `last_login`, `total_orders`, and `total_spent` are mapped from the supplied customer fields.
- Service requests: appointment date, customer display name, location, assigned specialist, priority, attachment, and activity history have no supplied source.
- These fields are rendered as `â€”` or an unavailable-state message unless the actual response includes a verified field. Remaining response aliases/status enumerations are UNVERIFIED until checked against the live backend.

### Other operations pages still using demo interactions/data
- `src/app/operations/deliveries/page.tsx` -> GET /deliveries/admin/, GET /deliveries/admin/couriers/, GET /deliveries/fees/ and PATCH /deliveries/admin/{id}/. List and fee shapes are supplied as verified; courier GET and status PATCH are UNVERIFIED because test credentials were unavailable. Status updates require confirmation and show field errors.
- `src/app/operations/payments/page.tsx` -> hardcoded payment rows; no admin payments endpoint was supplied.
- `src/app/operations/reports/page.tsx` -> hardcoded product/report data; no reporting endpoint was supplied.
- `src/app/operations/notifications/page.tsx` -> demo customer notification feed/send interaction; no admin notifications endpoint was supplied.
- `src/app/operations/settings/page.tsx` -> settings save is local demo state; no admin settings endpoint was supplied.
- `src/app/operations/reviews/page.tsx` -> loads real `GET /reviews/` list; publish, hide, reply, and status tabs are disabled because no moderation endpoints/status contract was supplied.
- `src/components/operations/OperationsShell.tsx` and `OperationsFrame.tsx` provide shared navigation/layout and do not own these demo datasets.
- These demo datasets and interactions were not changed; a Demo data badge makes the missing backend source visible. The real deliveries page no longer uses the former demo dataset.
- Dashboard verification: user confirmed the low-stock alert displays `3` from the verified `/catalog/admin/products/low-stock/?threshold=5` response.

### Reviews list assumptions
- `src/services/reviews.ts` `getReviews` accepts either a plain array or a paginated object with `results`.
- `// UNVERIFIED: confirm populated review field aliases against the live backend.` The mapper checks `feedback_id`/`review_id`/`id`, author aliases `user_name`/`author`/`user`/`customer_name`, product aliases `product_name`/`product`, rating/score, `created_at`/date/created, comment/text/review, and status/status_display. Missing display values render as `â€”`; a numeric user id is displayed as `user-<id>` and numeric product id as `#<id>`.
- Publish/hide/reply actions and review status filtering have no supplied backend endpoint or verified status field; buttons and status tabs are disabled and labeled unavailable.

## NO BACKEND ENDPOINT items
- Addresses full CRUD (only GET /customers/address/ exists for single residence/phone) -> getAddresses returns [] when not mock
- Operations dashboard, inventory, payments, notifications, reports, settings pages -> no endpoints, leave mock

## Code fixes applied during verification
1. src/lib/api.ts: apiFetch error extraction now reads error.details.detail[0], error.message, detail, or message (backend returns nested error shape, not flat detail).
2. src/services/products.ts: getCategories() now handles both paginated {count,results} and plain array [] responses (backend returns plain array).
3. src/services/account.ts: Removed silent mock fallbacks â€” getCurrentUser throws on fetch failure; getAddresses/getServiceRequests/getItServices/getTestimonials return [] when not mock (no mock data leakage).
4. No silent mock fallback remains anywhere in the codebase.

- Stock history table in `src/app/operations/inventory/page.tsx` -> UNVERIFIED (correct product-specific path was supplied, but admin credentials were unavailable in this shell so no authenticated status was observed; UI avoids fabricated movements).
- Catalog create/edit/delete and image upload UI in src/app/operations/{categories,products}/... -> UNVERIFIED (test with admin account; verify backend validation, permissions, and refresh behavior).

## Integration pass 2026-10-19 (remaining endpoints wired)
Live checks this pass: GET /catalog/products/ (6 products), /catalog/products/{id}/ (detail has description, warranty, images[]), /catalog/products/?search= and ?category= (both filter), /catalog/categories/ (plain array), /catalog/categories/{id}/products/, /promotions/active/ and /reviews/ (both paginated, empty), /promotions/products/{id}/ (has_discount=false shape), /health/ (ok), /deliveries/track/{unknown}/ (404 error envelope).

### Fixed: account pages now really call the backend
- src/app/account/page.tsx, account/orders/page.tsx, account/orders/[id]/page.tsx, account/[section]/page.tsx, checkout/page.tsx were server components, but authApiFetch returns {} on the server (no browser token), so GET /orders/, /orders/{id}/ and /accounts/me/ never ran. They are now client components with loading/error/empty states.
- src/services/account.ts maps backend order statuses (pending/confirmed/processing/shipped/delivered/cancelled) and maps payment_status, payment_method, payment_reference, delivery_status, and estimated_delivery from the supplied verified order shape. Missing values render as "â€”".

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
- Operations: payments, reports, notifications, settings, review moderation (publish/hide/reply), courier assignment, stock history pending correct-path authenticated test; dashboard sales comparisons/time series.
- IT services catalogue (the three service cards are static copy); order estimated delivery date, payment method/reference; product ratings/review counts on cards (reviews are only loaded per product page).
- Local (signed-out) cart is not merged into the backend cart on sign-in.

## Integration follow-up (2026-10-19)
- `POST /accounts/register/` empty-body probe -> VERIFIED 400; required field names: first_name, last_name, email, password, password_confirm.
- `GET /catalog/products/?brand=Samsung`, `?min_price=1`, `?max_price=999999999`, `?in_stock=true` -> VERIFIED 200; product result fields include average_rating and review_count.
- `GET /catalog/products/?category=3` -> VERIFIED 200. `?category=phones` -> 400; category filter must send backend category ID. Shop now maps category slugs to IDs returned from `/catalog/categories/`.
- `GET /reviews/?product=4` and `/promotions/active/?page_size=2` -> VERIFIED 200 (paginated result envelopes).
- Authenticated re-tests were not possible: TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD, TEST_CUSTOMER_EMAIL, and TEST_CUSTOMER_PASSWORD were not present in the shell environment. No credentials were requested or printed; authenticated statuses remain as previously recorded until rerun in the IDE terminal.
- Login accepts both `{message,user,tokens:{access,refresh}}` and `{success,data:{access,refresh}}`; the successful login shape was not re-tested because the test variables were absent from this shell. The attempted request without credentials returned 400 `{success,error}` and does not verify a successful login envelope.
- `PATCH /accounts/me/` and `POST /accounts/change-password/` are built from the supplied field contract and marked UNVERIFIED; neither was live-tested or sent to an existing account.

## Images and home page design (2026-10-19)
- Why uploaded images did not display: the backend only stores an image URL (POST /catalog/admin/images/ with image_url); there is no file upload. Product 4 ("sumsung s26 Ultra") was saved with a Google *search results* link (returns text/html, not an image), so browsers cannot render it. Products 5, 6, 8 and 10 have no image attached at all. Product 9 (gstatic thumbnail) and the category images render fine.
- Fix: the Add product form and the product image panel now preview the pasted link and warn when it is not an image file. Use "Copy image address" on the picture itself (link ends in .jpg/.png/.webp).
- Home page background: /images/background.png is the Figma node 1667-197 (1280 x 3466). It was shown with cover + fixed, so only its flat top strip was visible; it now spans the page width and scrolls with the page, and the home wrapper tint was removed.
- Category cards fall back to the bundled photos for phones/laptops/accessories/gaming when the backend category has no image; taglines are clamped to two lines.
- IT services block is static site content (src/lib/it-services.ts) rendered inside a white panel as in the design.

## Latest integration status (2026-10-19)
- GET /catalog/products/?brand=Samsung -> `src/services/products.ts` / Shop, VERIFIED (200; list fields include average_rating and review_count).
- GET /catalog/products/?min_price=1 -> Shop, VERIFIED (200).
- GET /catalog/products/?max_price=999999999 -> Shop, VERIFIED (200).
- GET /catalog/products/?in_stock=true -> Shop, VERIFIED (200).
- GET /catalog/products/?category=3 -> Shop, VERIFIED (200). A category slug returned 400; the UI now sends the backend category_id.
- GET /reviews/?product=4 -> product detail reviews, VERIFIED (200, paginated).
- GET /promotions/active/?page_size=2 -> promotion list, VERIFIED (200, paginated).
- POST /accounts/register/ with {} and no Authorization -> VERIFIED (400; required fields: first_name, last_name, email, password, password_confirm; endpoint exists).
- PATCH /accounts/me/ -> profile form, UNVERIFIED (uses supplied fields; no existing profile was changed).
- POST /accounts/change-password/ -> change password form, UNVERIFIED (uses supplied fields; no password was changed).
- GET /catalog/admin/products/4/stock-history/ -> admin product stock history, UNVERIFIED (correct path needs admin auth; test credentials unavailable to shell; no status was observed).
- GET /deliveries/admin/couriers/ -> Operations / Deliveries, UNVERIFIED (correct path needs admin auth; test credentials unavailable to shell).
- PATCH /deliveries/admin/{delivery_id}/ -> Operations / Deliveries status form, UNVERIFIED (status body based on supplied contract; requires confirmation; no existing delivery was changed).
- GET /deliveries/fees/ -> Operations / Deliveries fee schedule, VERIFIED from prior live result (200, `{success,data}` with three items).
- Login top-level keys could not be checked on a successful live login in this shell. Login code accepts `tokens.access/refresh` and `data.access/refresh`; admin guard uses `profile.role === "super_admin"`.
- Authenticated re-tests of login, /accounts/me/, /cart/, /orders/, /customers/, /orders/admin/all/, and /deliveries/admin/ were unavailable because TEST_ADMIN_* and TEST_CUSTOMER_* were absent. Do not treat the 401 unauthenticated probes as regressions.

## Live verification and integration update (2026-10-19, credential-backed)
This snapshot supersedes older UNVERIFIED entries below where the same endpoint is listed. Live scripts printed statuses, response keys/field names and test IDs only; credentials and tokens were never printed or saved. Render requests used a 90-second timeout and one retry.

### VERIFIED LIVE
- POST /auth/login/ -> customer and admin login, 200; response top-level keys message, tokens, user; tokens are at tokens.access and tokens.refresh. Used by src/lib/auth.ts.
- POST /auth/refresh/ -> customer, 200; response keys access, refresh. Used by src/lib/auth.ts.
- POST /accounts/logout/ -> customer, 200. Used by src/lib/auth.ts logout().
- GET /accounts/me/ -> customer, 200; keys user_id, email, first_name, last_name, phone, residence, role, created_at, updated_at. Used by src/services/account.ts and profile pages.
- PATCH /accounts/me/ -> invalid email only returned 200 with writable response fields first_name, last_name, phone, residence; invalid email was ignored and GET /accounts/me/ confirmed it remained unchanged. Valid profile updates remain UNVERIFIED. Used by AccountProfileForm.
- GET /catalog/products/ and GET /catalog/products/4/ -> public, 200. List result keys: product_id, category, category_name, name, brand, price, stock_quantity, is_available, primary_image, average_rating, review_count. Product 4 accepted cart and checkout tests.
- GET /catalog/categories/ -> public, 200, plain array; fields category_id, name, description, image, created_at, updated_at. Used by Header and shop filters.
- GET /cart/ -> customer, 200, success/data envelope with items, total_items, total_price, has_out_of_stock_items. POST /cart/items/ with product_id and quantity -> 201; PATCH /cart/items/{cart_item_id}/ -> 200; DELETE same item -> 200. Used by src/hooks/useCart.tsx.
- GET /wishlist/ -> customer, 200. POST /wishlist/items/ with product_id -> 201; POST /wishlist/items/{product_id}/move-to-cart/ -> 200. Move removed the wishlist entry; a following DELETE returned 404 because it was already removed. Used by src/hooks/useWishlist.tsx.
- POST /orders/checkout/ -> customer, 201 using shipping_address, phone, delivery_method; response wraps order in data. GET /orders/ -> 200; GET /orders/{id}/ -> 200 with data wrapper; POST /orders/{id}/cancel/ -> 200 with data wrapper. Used by src/services/checkout.ts and src/services/account.ts.
- GET /deliveries/orders/{id}/ and GET /deliveries/track/{tracking_number}/ -> customer, 200. Order delivery is an object with delivery_method, delivery_method_display, status/status_display, estimated_delivery, and tracking_number. Used by order detail and tracking pages.
- GET /services/ -> customer, 200 paginated. POST /services/ with name, description, service_type='other' -> 201 success/data envelope; GET /services/{id}/ -> 200. Used by src/services/services.ts and service request forms.
- POST /accounts/change-password/ with wrong current_password and the form's password_confirm key -> 400, field current_password. No password changed. Used by AccountProfileForm.
- GET /orders/admin/all/ -> admin, 200 paginated. GET /customers/ and GET /customers/{user_id}/ -> admin, 200. Used by Operations Orders and Customers.
- PATCH /orders/admin/{id}/status/ -> admin: invalid status returned 400 for field status; pending, confirmed, processing, shipped, delivered, and cancelled each returned 2xx on the AI TEST order. Used by Operations order detail; its dropdown values match this live set.
- GET /deliveries/admin/, GET /deliveries/admin/couriers/, GET /deliveries/fees/ -> admin, 200. Courier records expose courier_id, email, name, phone, status. Used by Operations Deliveries.
- GET /catalog/admin/products/4/stock-history/ -> admin, 200 paginated. A created AI TEST product returned 201, stock adjustment returned 200, and its history returned 200 with delta, quantity_before, resulting_stock_quantity, reason, user, created_at, movement_id, movement_type. The AI TEST movement appeared. Integrated in Operations Products edit panel.
- GET /services/admin/ -> admin, 200 paginated. PATCH /services/admin/{id}/ -> invalid status returned 400 for status; new, in_progress, completed accepted with 2xx on the AI TEST request. Used by Operations IT Requests.
- GET /promotions/admin/discounts/ -> admin, 200 paginated. POST with the admin form fields and date-only start_date/end_date -> 201; GET detail -> 200. Used by Operations Promotions.
- GET /reviews/ and GET /reviews/?product=4 -> customer/admin, 200 paginated. Used by product reviews and Operations Reviews.
- OPTIONS /reviews/{id}/ -> admin, 200; Allow: GET, HEAD, OPTIONS. No moderation write method exists; remove the misleading Demo data badge from the live list; keep moderation actions disabled.

### BROKEN OR LIMITED LIVE RESULTS
- POST /reviews/ -> customer, 400; response field: product. The form displays backend field errors; successful review creation was not verified.
- PATCH /deliveries/admin/{id}/ with invalid status -> admin, 400; status error: "AI_TEST_INVALID" is not a valid choice. PATCH probes for courier, courier_id, assigned_courier, and assigned_courier_id returned 500, so courier assignment is not integrated.
- DELETE /promotions/admin/discounts/{id}/ -> admin, 404, although the created discount was absent from detail and list afterward (GET detail then said "No Discount matches the given query."). The UI now checks the list after 404 before treating deletion as complete.
- DELETE /catalog/admin/products/{id}/ -> admin, 409: "This item cannot be deleted because other records depend on it. Deactivate it instead." The AI TEST product is retained because it has stock-history dependency records.
- DELETE /services/{id}/ -> customer, 405; service requests cannot be cleaned up through this route.
- POST /auth/logout/ -> 404; the supported route is /accounts/logout/ (200).

### UNVERIFIED / SAFETY SKIPPED
- PATCH /accounts/me/ with valid field values remains unverified; only an invalid email was sent and ignored (200). No real profile values were changed.
- POST /accounts/change-password/ remains unverified for successful changes; only a wrong current password was tested.
- /cart/clear/ DELETE/POST methods were skipped because the account is not confirmed to be dedicated for testing. Cart items created by the run were individually deleted.
- Courier assignment remains unverified because courier field probes returned 500; do not expose assignment controls until the backend confirms a field.
- Admin review moderation is absent from OPTIONS; publish/hide/reply remain disabled and marked Demo data.

### Additional read-only checks of documented missing routes (2026-10-19)
- GET /reports/summary/?period=30d, GET /reports/export/?type=sales&format=csv, GET /payments/admin/, GET /notifications/admin/, GET /settings/admin/, GET /reviews/admin/1/, GET /customers/addresses/, GET /customers/payment-methods/, GET /support/tickets/, GET /notifications/, and GET /newsletter/subscribe/ all returned 404. The observed response is HTML: `<h1>Not Found</h1><p>The requested resource was not found on this server.</p>`.
- OPTIONS /payments/initiate/, OPTIONS /reviews/admin/1/, OPTIONS /cart/apply-promo/, and OPTIONS /cart/promo/ returned 404 with the same Not Found page. These routes are absent.
- POST /auth/google/ accepts required `credential` (empty-body probe returned 400; OPTIONS allows POST). Google Identity Services is connected in `src/components/auth/AuthExperience.tsx`; `src/lib/auth.ts` sends the credential and handles the same token/user envelopes as `/auth/login/`. UNVERIFIED: successful Google response shape is assumed to match login, and no real Google credential flow has been tested. Confirm a successful sign-in and adjust parsing if the backend response differs.


### Operations demo data correction
- Payments now reads payment fields from verified GET /orders/admin/all/ through adminListOrders; dedicated GET /payments/admin/ remains missing, so settlement details are unavailable.
- Notifications, Reports, and Settings no longer show fabricated values or claim local changes are saved; their backend endpoints returned 404.
- Operations Reviews displays the live GET /reviews/ list. Moderation remains unavailable because the API has no write methods.\n