# Lost & Found Platform API Documentation

## Authentication Endpoints (`/api/auth`)

### `POST /api/auth/login`
Authenticates a user and issues JWT Access & Refresh Tokens.
- **Request Body**:
```json
{
  "email": "admin@university.edu",
  "password": "Password@123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "7c9e...",
    "tokenType": "Bearer",
    "userId": 1,
    "email": "admin@university.edu",
    "firstName": "System",
    "lastName": "Admin",
    "role": "ADMIN"
  }
}
```

### `POST /api/auth/register`
Registers a new user account.

### `POST /api/auth/refresh-token`
Exchanges a valid Refresh Token for a new Access Token.

---

## Items Endpoints (`/api/items`)

### `GET /api/items`
Searches and filters campus items with pagination and sorting.
- **Query Parameters**:
  - `query`: Keyword matching title, description, brand, color, serial number
  - `categoryId`: Category ID filter
  - `locationId`: Location ID filter
  - `typeId`: `1` (LOST), `2` (FOUND)
  - `statusId`: Status ID filter
  - `page`: Page index (0-based)
  - `size`: Items per page (default 12)
  - `sortBy`: Property to sort by (`createdAt`, `title`)
  - `sortDir`: `ASC` or `DESC`

### `POST /api/items`
Creates a new Lost or Found item report.

### `GET /api/items/{itemId}`
Retrieves complete details of an item.

---

## Claims Endpoints (`/api/claims`)

### `POST /api/claims`
Submits an ownership claim for an item.
- **Request Body**:
```json
{
  "itemId": 1,
  "proofDescription": "The MacBook has a subtle sticker on the bottom left corner and password starts with 'Uni2026'.",
  "proofDocumentUrl": "https://example.com/receipt.pdf"
}
```

### `POST /api/claims/{claimId}/review`
Reviews a claim (Admin/Staff only).
- **Request Body**:
```json
{
  "claimStatus": "APPROVED",
  "reviewerRemarks": "Verified password and ownership receipt at admin desk."
}
```

### `POST /api/claims/{claimId}/collect`
Marks the item as collected by owner and closes the listing.
