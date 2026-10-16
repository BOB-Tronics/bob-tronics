# Integration TODO

Backend contract: https://bobtronics-store-backend.onrender.com/api/v1 (OpenAPI 3.0.3 schema downloaded from /api/schema/ on 2026-10-16).
All paths end with a trailing slash. API_URL already ends with /api/v1.
Status key: VERIFIED = tested against real backend; UNVERIFIED = built from docs only.

## Assumptions (unverified until backend works)
- Mock switch NEXT_PUBLIC_USE_MOCK added to .env.local: "true" uses existing mocks, "false" calls real backend. Default "true".
- Backend product id is an integer; frontend Product.id is a string (String(backend product_id)).
- Backend prices are strings in decimal format; frontend converts to Number.
- Backend OrderList.status values: pending, confirmed, processing, shipped, delivered, cancelled.
- Backend Delivery status values: pending, in_transit, out_for_delivery, delivered, failed, returned.
- Backend Service status values: new, in_progress, completed, cancelled.
- Login error detail for unactivated account assumed to be detectable via response body containing "activat" (case-insensitive).
- 401 on any apiFetch triggers one /auth/refresh/ attempt; if refresh fails, tokens cleared and redirect to /sign-in.
- Admin role check assumes User.role === "admin" or "super_admin".

## Endpoints (one line each)

PHASE 1 - Public pages
- GET /catalog/products/{id}/ , src/services/products.ts getProduct, UNVERIFIED, check response field names match BackendProduct
- GET /catalog/categories/{category_id}/products/ , src/services/products.ts getRelatedProducts, UNVERIFIED, check it returns products array excluding current
- GET /promotions/active/ , src/services/promotions.ts getActivePromotions, UNVERIFIED, check whether /promotions/active/ or /catalog/active/ returns deals
- GET /catalog/active/ , src/services/promotions.ts, UNVERIFIED, duplicate of /promotions/active/, check which one works
- GET /promotions/products/{product_id}/ , src/services/promotions.ts getProductDiscount, UNVERIFIED, check ProductDiscountDetail shape
- GET /health/ , src/lib/health.ts healthCheck, UNVERIFIED, tiny helper no UI
- GET /deliveries/track/{tracking_number}/ , src/services/deliveries.ts trackDelivery, UNVERIFIED, add only if tracking UI exists; service function added regardless
- GET /reviews/ , src/services/reviews.ts getReviews, UNVERIFIED, check PaginatedFeedbackList shape
- GET /reviews/{id}/ , src/services/reviews.ts getReview, UNVERIFIED

PHASE 2 - Authentication
- POST /auth/login/ , src/lib/auth.ts login, UNVERIFIED, check LoginResponse {user, tokens:{access,refresh}}
- POST /auth/refresh/ , src/lib/auth.ts refresh, UNVERIFIED, check TokenRefresh {access,refresh}
- POST /accounts/register/ , src/lib/auth.ts register, UNVERIFIED, check RegistrationResponse {message, user}
- GET /accounts/me/ , src/lib/auth.ts getMe, UNVERIFIED, check User shape {user_id, first_name, last_name, email, phone, residence, role}
- POST /accounts/logout/ , src/lib/auth.ts logout, UNVERIFIED, body {refresh}
- POST /accounts/activate/ (+ GET), src/lib/auth.ts activate, UNVERIFIED, body {uid, token}
- POST /accounts/password-reset/ , src/lib/auth.ts passwordReset, UNVERIFIED, body {email}
- POST /accounts/password-reset/confirm/ , src/lib/auth.ts passwordResetConfirm, UNVERIFIED, body {uid, token, new_password, password_confirm}

PHASE 3 - Cart and wishlist (login required)
- GET /cart/ , src/hooks/useCart, UNVERIFIED, returns CartItem[] array
- POST /cart/items/ , src/hooks/useCart, UNVERIFIED, body CartItemAdd {product_id, quantity?}
- PATCH /cart/items/{cart_item_id}/ , src/hooks/useCart, UNVERIFIED, body {quantity}
- DELETE /cart/items/{cart_item_id}/ , src/hooks/useCart, UNVERIFIED
- POST /cart/clear/ , src/hooks/useCart, UNVERIFIED, DELETE method per schema
- GET /wishlist/ , src/hooks/useWishlist, UNVERIFIED, returns WishlistItem[]
- POST /wishlist/items/ , src/hooks/useWishlist, UNVERIFIED, body {product_id}
- DELETE /wishlist/items/{product_id}/ , src/hooks/useWishlist, UNVERIFIED
- POST /wishlist/items/{product_id}/move-to-cart/ , src/hooks/useWishlist, UNVERIFIED, body {quantity?}

PHASE 4 - Orders, checkout, services, reviews (login required)
- POST /orders/checkout/ , src/services/checkout.ts placeOrder, UNVERIFIED, body OrderCheckout {shipping_address?, phone?, delivery_method?}
- GET /orders/ , src/services/account.ts getOrders, UNVERIFIED, returns PaginatedOrderList
- GET /orders/{order_id}/ , src/services/account.ts getOrder, UNVERIFIED, returns Order
- POST /orders/{order_id}/cancel/ , src/services/account.ts cancelOrder, UNVERIFIED
- GET /deliveries/orders/{order_id}/ , src/services/deliveries.ts getDeliveryForOrder, UNVERIFIED, returns Delivery
- GET /services/ , src/services/services.ts getServices, UNVERIFIED, returns PaginatedServiceList
- POST /services/ , src/services/services.ts createService, UNVERIFIED, body ServiceCreate {name, description, service_type}
- GET /services/{service_id}/ , src/services/services.ts getService, UNVERIFIED, returns Service
- POST /reviews/ , src/services/reviews.ts createReview, UNVERIFIED, body Feedback {product, rating, comment}
- Addresses: GET /customers/address/ , src/services/account.ts getAddresses, UNVERIFIED, NO BACKEND ENDPOINT for full address CRUD -> leave mock

PHASE 5 - Admin / operations (admin login required)
- GET/POST /catalog/admin/categories/ , src/services/admin.ts, UNVERIFIED
- GET/PUT/PATCH/DELETE /catalog/admin/categories/{category_id}/ , src/services/admin.ts, UNVERIFIED
- GET/POST /catalog/admin/images/ , src/services/admin.ts, UNVERIFIED
- GET/PUT/PATCH/DELETE /catalog/admin/images/{image_id}/ , src/services/admin.ts, UNVERIFIED
- GET/POST /catalog/admin/products/ , src/services/admin.ts, UNVERIFIED
- GET/PUT/PATCH/DELETE /catalog/admin/products/{product_id}/ , src/services/admin.ts, UNVERIFIED
- POST /catalog/admin/products/{product_id}/adjust-stock/ , src/services/admin.ts, UNVERIFIED, body {delta, reason?}
- GET /catalog/admin/products/low-stock/ , src/services/admin.ts, UNVERIFIED, query ?threshold=N
- GET /promotions/admin/discounts/ (main), src/services/admin.ts, UNVERIFIED
- POST /promotions/admin/discounts/ , src/services/admin.ts, UNVERIFIED
- GET/PUT/PATCH/DELETE /promotions/admin/discounts/{discount_id}/ , src/services/admin.ts, UNVERIFIED
- NOTE: /catalog/admin/discounts/ is a duplicate; noted in TODO, use /promotions/admin/discounts/
- GET /customers/ , src/services/admin.ts, UNVERIFIED, returns PaginatedAdminCustomerList
- GET /customers/{user_id}/ , src/services/admin.ts, UNVERIFIED, returns AdminCustomerDetail
- GET /services/admin/ , src/services/admin.ts, UNVERIFIED, returns PaginatedServiceList
- GET/PATCH /services/admin/{service_id}/ , src/services/admin.ts, UNVERIFIED, body PatchedAdminServiceUpdate {status, estimated_cost?, final_cost?}
- GET /orders/admin/all/ , src/services/admin.ts, UNVERIFIED, returns PaginatedOrderList
- PATCH /orders/admin/{order_id}/status/ , src/services/admin.ts, UNVERIFIED, body {status}

## NO BACKEND ENDPOINT items
- Addresses full CRUD (only GET /customers/address/ exists for the authenticated customer's single residence/phone) -> leave Account addresses on mock data
- Operations dashboard, inventory, payments, notifications, reports, settings pages -> no endpoints, leave mock
