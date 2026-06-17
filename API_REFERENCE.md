# API Reference Guide
## Smart Booking System - New Endpoints

---

## Smart Booking Endpoints

### 1. Get Smart Slot Suggestions
```
GET /api/smart/suggestions

Query Parameters:
  - facilityServiceId (required): string - Facility ID
  - date (required): string - Date in YYYY-MM-DD format

Response:
{
  "suggestions": [
    {
      "_id": "...",
      "startTime": "09:00",
      "endTime": "10:00",
      "occupancyLevel": "low",
      "occupancyPercentage": 25,
      "availableSpots": 15,
      "recommendation": "Less crowded ✓"
    },
    ...
  ]
}

Example Usage:
GET /api/smart/suggestions?facilityServiceId=abc123&date=2024-04-15
```

### 2. Get Occupancy Information
```
GET /api/smart/occupancy

Query Parameters:
  - facilityServiceId (required): string
  - date (required): string - YYYY-MM-DD

Response:
{
  "slots": [
    {
      "_id": "...",
      "startTime": "09:00",
      "endTime": "10:00",
      "capacity": 20,
      "booked": 5,
      "occupancyLevel": "low",
      "occupancyPercentage": 25,
      "statusIcon": "🟢",
      "isAvailable": true,
      "isFull": false
    },
    ...
  ]
}

Example Usage:
GET /api/smart/occupancy?facilityServiceId=abc123&date=2024-04-15
```

### 3. Check for Booking Conflicts
```
POST /api/smart/check-conflicts

Body:
{
  "slotId": "slot123",
  "date": "2024-04-15"
}

Response:
{
  "hasConflict": true,
  "conflicts": [
    {
      "id": "booking123",
      "facility": "Gym",
      "time": "09:00 - 10:00",
      "status": "approved"
    }
  ]
}

Example Usage:
curl -X POST http://localhost:5000/api/smart/check-conflicts \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"slotId":"slot123","date":"2024-04-15"}'
```

### 4. Get Priority Booking Statistics (Admin)
```
GET /api/smart/priority-stats

Authorization: Bearer token (Admin/Staff only)

Response:
{
  "totalPriority": 15,
  "byStatus": {
    "pending": 8,
    "approved": 5,
    "rejected": 2
  },
  "unverified": 3,
  "bookings": [
    {
      "_id": "...",
      "userId": { "name": "John Doe", "email": "john@uni.edu" },
      "facilityServiceId": { "name": "Medical Center" },
      "date": "2024-04-20",
      "isPriority": true,
      "priorityVerified": false,
      "status": "pending"
    },
    ...
  ]
}

Example Usage:
GET /api/smart/priority-stats
Authorization: Bearer adminToken
```

---

## Notification Endpoints

### 1. Get Notifications
```
GET /api/notifications

Query Parameters:
  - unreadOnly (optional): "true" - Only unread notifications
  - limit (optional): number - Default 50, max 100

Response:
{
  "notifications": [
    {
      "_id": "notif123",
      "userId": "user123",
      "message": "Your booking has been approved",
      "type": "booking_approved",
      "isRead": false,
      "bookingId": "booking123",
      "facilityServiceId": { "name": "Gym" },
      "priority": "normal",
      "createdAt": "2024-04-15T10:30:00Z"
    },
    ...
  ],
  "unreadCount": 3
}

Examples:
GET /api/notifications
GET /api/notifications?unreadOnly=true
GET /api/notifications?limit=20
```

### 2. Get Unread Count
```
GET /api/notifications/unread/count

Response:
{
  "unreadCount": 5
}

Example Usage:
GET /api/notifications/unread/count
```

### 3. Get Notifications for Booking
```
GET /api/notifications/booking/:bookingId

Response:
[
  {
    "_id": "...",
    "message": "Your booking request submitted",
    "type": "booking_submitted",
    "isRead": true,
    "createdAt": "..."
  },
  ...
]

Example Usage:
GET /api/notifications/booking/booking123
```

### 4. Mark Notification as Read
```
PUT /api/notifications/:id/read

Response:
{
  "message": "Notification marked as read",
  "notification": { ... }
}

Example Usage:
curl -X PUT http://localhost:5000/api/notifications/notif123/read \
  -H "Authorization: Bearer token"
```

### 5. Mark All Notifications as Read
```
PUT /api/notifications/read-all

Response:
{
  "message": "All notifications marked as read"
}

Example Usage:
curl -X PUT http://localhost:5000/api/notifications/read-all \
  -H "Authorization: Bearer token"
```

### 6. Delete Notification
```
DELETE /api/notifications/:id

Response:
{
  "message": "Notification deleted"
}

Example Usage:
curl -X DELETE http://localhost:5000/api/notifications/notif123 \
  -H "Authorization: Bearer token"
```

### 7. Create Notification (Admin)
```
POST /api/notifications

Authorization: Bearer token (Admin/Staff only)

Body:
{
  "userId": "user123",
  "facilityServiceId": "facility123",
  "message": "Your booking slot has been cancelled",
  "type": "slot_cancelled",
  "priority": "high"
}

Response:
{
  "_id": "notif123",
  "userId": "user123",
  "message": "...",
  "type": "slot_cancelled",
  "priority": "high",
  "isRead": false,
  "bookingId": null,
  "facilityServiceId": "facility123",
  "createdAt": "..."
}

Example Usage:
curl -X POST http://localhost:5000/api/notifications \
  -H "Authorization: Bearer adminToken" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "message": "Your slot has been cancelled",
    "type": "slot_cancelled",
    "priority": "high"
  }'
```

---

## Booking Endpoints (Enhanced)

### 1. Get All Bookings (Admin) - Enhanced
```
GET /api/bookings

Query Parameters:
  - status (optional): "pending", "approved", "rejected", "completed", "cancelled"
  - sortBy (optional): "priority" (default) or "date"

Response:
[
  {
    "_id": "booking123",
    "userId": { "name": "John Doe", "email": "john@uni.edu" },
    "facilityServiceId": { "name": "Gym", "type": "sport" },
    "slotId": { "startTime": "09:00", "endTime": "10:00" },
    "date": "2024-04-20",
    "status": "pending",
    "isPriority": true,
    "priorityReason": "Medical urgent",
    "priorityVerified": false,
    "createdAt": "..."
  },
  ...
]

Examples:
GET /api/bookings
GET /api/bookings?status=pending
GET /api/bookings?sortBy=date
GET /api/bookings?status=pending&sortBy=priority
```

### 2. Update Booking Status (Enhanced)
```
PUT /api/bookings/:id/status

Body:
{
  "status": "approved" or "rejected",
  "rejectReason": "string (required if rejected)",
  "priorityVerified": boolean (optional)
}

Response:
{
  "_id": "booking123",
  "status": "approved",
  "isPriority": true,
  "priorityVerified": true,
  "notificationSent": {
    "approved": false,
    ...
  },
  ...
}

Examples:
// Approve booking
curl -X PUT http://localhost:5000/api/bookings/booking123/status \
  -H "Authorization: Bearer adminToken" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved", "priorityVerified": true}'

// Reject booking
curl -X PUT http://localhost:5000/api/bookings/booking123/status \
  -H "Authorization: Bearer adminToken" \
  -H "Content-Type: application/json" \
  -d '{"status": "rejected", "rejectReason": "Duplicate booking"}'

// Mark priority as invalid
curl -X PUT http://localhost:5000/api/bookings/booking123/status \
  -H "Authorization: Bearer adminToken" \
  -H "Content-Type: application/json" \
  -d '{"status": "rejected", "priorityVerified": false}'
```

### 3. Create Booking (Enhanced)
```
POST /api/bookings

Body:
{
  "slotId": "slot123",
  "date": "2024-04-20",
  "participants": 1,
  "isPriority": false,
  "priorityReason": "string (required if isPriority is true)"
}

Response:
{
  "_id": "booking123",
  "userId": "user123",
  "slotId": "slot123",
  "date": "2024-04-20",
  "status": "pending",
  "isPriority": false,
  "priorityVerified": false,
  "notificationSent": {
    "submitted": false,
    ...
  },
  ...
}

Example Usage:
// Regular booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "slotId": "slot123",
    "date": "2024-04-20",
    "participants": 1,
    "isPriority": false
  }'

// Priority booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "slotId": "slot123",
    "date": "2024-04-20",
    "participants": 1,
    "isPriority": true,
    "priorityReason": "Medical urgent - need doctor appointment"
  }'
```

---

## Notification Types Reference

### Booking Related
- `booking_submitted` - Sent when booking created
- `booking_approved` - Sent when approved by admin
- `booking_rejected` - Sent when rejected by admin
- `booking_cancelled` - Sent when student cancels

### Time Related
- `reminder_30min` - 30 minutes before booking
- `reminder_1day` - 24 hours before booking

### Priority Related
- `priority_request` - Alert to admin about priority request
- (Downgrade priority when verified as false)

### Availability Related
- `waitlist_available` - Slot became available from waitlist
- `schedule_changed` - Slot moved to different time
- `slot_cancelled` - Entire slot cancelled

---

## Notification Priority Levels

```
"priority": "low"     // General informational
"priority": "normal"  // Standard notifications (default)
"priority": "high"    // Important/urgent notifications
```

---

## Error Responses

### Common Errors
```
401 Unauthorized
{
  "message": "Token is invalid/expired"
}

403 Forbidden
{
  "message": "Not authorized to access this resource"
}

400 Bad Request
{
  "message": "Detailed error message about what went wrong"
}

404 Not Found
{
  "message": "Resource not found"
}

500 Server Error
{
  "message": "Error getting suggestions",
  "error": "Detailed error message"
}
```

---

## Rate Limiting

- Smart suggestions: 5 requests per minute per user
- Occupancy data: 10 requests per minute per user
- Notifications: 20 requests per minute per user
- Admin endpoints: 15 requests per minute per admin

---

## Authentication

All endpoints (except login/register) require:
```
Authorization: Bearer <JWT_TOKEN>
```

Token obtained from login endpoint and stored in localStorage as:
```javascript
{
  "token": "eyJhbGc...",
  "user": { ... }
}
```

---

## Example Frontend Integration

### Get Smart Suggestions
```javascript
const { data } = await api.get('/smart/suggestions', {
  params: { 
    facilityServiceId: facilityId, 
    date: '2024-04-15' 
  }
});
console.log(data.suggestions);
```

### Check Conflicts
```javascript
const { data } = await api.post('/smart/check-conflicts', {
  slotId: selectedSlot._id,
  date: '2024-04-15'
});
if (data.hasConflict) {
  // Show conflict warning
  console.log(data.conflicts);
}
```

### Get Notifications
```javascript
const { data } = await api.get('/notifications', {
  params: { unreadOnly: true }
});
console.log(`${data.unreadCount} unread notifications`);
```

### Submit Priority Booking
```javascript
const { data } = await api.post('/bookings', {
  slotId: slot._id,
  date: '2024-04-15',
  isPriority: true,
  priorityReason: 'Medical urgent'
});
```

---

**Last Updated:** 2024
**API Version:** 1.0
**Status:** production-ready
