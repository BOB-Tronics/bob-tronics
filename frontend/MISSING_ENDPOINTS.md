# Missing backend endpoints

Backend: https://bobtronics-store-backend.onrender.com/api/v1
Date: 2026-10-19

Every endpoint in the current API list is integrated in the frontend. The screens below still
show demo or placeholder state because the backend has no endpoint for them. Paths follow the
style of the existing API (trailing slash, `/admin/` prefix for staff-only routes). Field names
are suggestions; the frontend will be adapted to whatever the backend returns.

## Priority

1. Payment flow at checkout (the store cannot take money today).
2. Image file upload for products (admins can only paste links).
3. Admin deliveries list and courier assignment.
4. Everything else is account polish and admin convenience.

## Customer account

| Screen | Endpoint | Purpose / fields |
|---|---|---|
| Profile → Personal information | `PATCH /accounts/me/` | Update `first_name`, `last_name`, `phone`, `residence` |
| Profile → Security | `POST /accounts/change-password/` | `current_password`, `new_password`, `password_confirm` |
| Addresses | `GET /customers/addresses/`, `POST /customers/addresses/`, `PATCH /customers/addresses/{id}/`, `DELETE /customers/addresses/{id}/` | Address book: `label`, `recipient`, `street`, `city`, `code`, `phone`, `is_default`. Today only the single `residence` on the profile exists |
| Payments → Saved methods | `GET /customers/payment-methods/`, `POST /customers/payment-methods/`, `DELETE /customers/payment-methods/{id}/` | `type` (mobile_money / card), `provider`, masked `number`, `account_name`, `is_default` |
| Payments → Recent transactions | `payment_status`, `payment_method`, `payment_reference` on `GET /orders/` and `GET /orders/{order_id}/` | Shown on the order page and in the account payments table |
| Orders | `estimated_delivery` on `GET /orders/{order_id}/` | Order page shows "to be confirmed" now |
| Support | `GET /support/tickets/`, `POST /support/tickets/`, `GET /support/tickets/{id}/` | `subject`, `message`, `related_order` (optional), `status`, `created_at`, `updated_at` |
| Notifications | `GET /notifications/`, `PATCH /notifications/{id}/read/` | Customer notification feed: `title`, `body`, `created_at`, `is_read` |
| Newsletter (home page) | `POST /newsletter/subscribe/` | `email` |

## Catalogue and shop

| Screen | Endpoint | Purpose / fields |
|---|---|---|
| Product cards | `average_rating`, `review_count` on `GET /catalog/products/` and `/catalog/products/{id}/` | Cards show "No reviews yet" because ratings only exist per review |
| Product reviews | Confirm `?product={id}` filter on `GET /reviews/` | The frontend sends it and also filters in the browser |
| Shop filters (optional) | `?brand=`, `?min_price=`, `?max_price=`, `?in_stock=` on `GET /catalog/products/` | Filtering runs in the browser today; fine for small catalogues |
| Promotions (optional) | `?page_size=` on `GET /promotions/active/` | To load all active discounts in one request |

## Checkout and payment

| Screen | Endpoint | Purpose / fields |
|---|---|---|
| Checkout → Pay | `POST /payments/initiate/` | `order_id`, `method` (mobile_money / card), `phone` or card token; returns `payment_id`, `status`, provider redirect or prompt |
| Checkout → Pay | `GET /payments/{payment_id}/status/` (or a webhook that updates the order) | Poll until `paid` / `failed` |
| Cart → Discount code | `POST /cart/apply-promo/` and `DELETE /cart/promo/` | `code`; returns discount amount and new totals. The box only knows a demo code today |
| Checkout | Delivery fee on `POST /orders/checkout/` response or `GET /deliveries/fees/` | The frontend hard-codes RWF 80 |

## Admin (operations)

| Screen | Endpoint | Purpose / fields |
|---|---|---|
| Dashboard | `GET /reports/summary/?period=30d` | `revenue`, `sales_count`, `orders_count`, previous-period values, `revenue_series[]`, `sales_by_category[]`, `recent_activity[]` |
| Reports | `GET /reports/export/?type=sales&format=csv` | Downloadable file |
| Payments | `GET /payments/admin/`, `GET /payments/admin/{id}/` | All transactions: `reference`, `order_id`, `customer`, `method`, `amount`, `status`, `created_at` |
| Deliveries | `GET /deliveries/admin/` | List every delivery with order, customer, address, courier, status, tracking number |
| Deliveries | `PATCH /deliveries/admin/{id}/` | Assign `courier`, set `dispatch_date`, `note`, `status`, `tracking_number` |
| Deliveries | `GET /deliveries/admin/couriers/` (optional) | Courier list for the assign dropdown |
| Inventory → Stock history | `GET /catalog/admin/products/{product_id}/stock-history/` | `delta`, `reason`, `user`, `created_at`, resulting `stock_quantity` |
| Reviews | `PATCH /reviews/admin/{id}/` with `status` (pending / published / hidden) | Publish and hide buttons |
| Reviews | `POST /reviews/admin/{id}/reply/` | `message`; reply shown under the review |
| Notifications | `GET /notifications/admin/`, `POST /notifications/admin/send/` | `recipient` (user_id or `all`), `title`, `body` |
| Settings | `GET /settings/admin/`, `PATCH /settings/admin/` | Store name, contact email/phone, address, delivery fee, opening hours |
| Products → Images | Multipart file upload on `POST /catalog/admin/images/` (`image` file field, alongside the existing `image_url`) | Lets admins upload a picture instead of pasting a link |
| Customers | `last_login` on `GET /customers/` and `/customers/{user_id}/` | "Last active" column shows a dash |
| Orders | `customer_name`, `payment_status`, `delivery_status` on `GET /orders/admin/all/` | Columns show a dash when absent |

## Authentication

| Screen | Endpoint | Purpose / fields |
|---|---|---|
| Sign in with Google | `POST /auth/google/` | `id_token` from Google; returns the same `user` + `tokens` shape as `/auth/login/` |
| Activation email | No new endpoint. The link in the email should open `https://<frontend>/activate?uid=<uid>&token=<token>` | The page posts both values to `/accounts/activate/` |
| Password reset email | No new endpoint. The link should open `https://<frontend>/reset-password?uid=<uid>&token=<token>` | The page posts to `/accounts/password-reset/confirm/` |

## Also needed for deployment

- CORS: add the production frontend domain to the backend allow-list (localhost:3000 works today).
- Confirm the method for `POST /cart/clear/` (the frontend tries DELETE, then POST).
- Confirm accepted `discount_type` values on `/promotions/admin/discounts/` (frontend assumes `percentage` and `fixed`).
