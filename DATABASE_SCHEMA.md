# Database Schema Documentation

## Overview
This document describes the MongoDB database schema for the Chit-Chat application. The application uses MongoDB with Mongoose ODM (Object Data Modeling) library for Node.js.

## Database: MongoDB
- **Connection**: Managed via Mongoose
- **Configuration**: `/Backend/config/db.js`

---

## Collections

### 1. Users Collection

**Model File**: `/Backend/model/userModel.js`  
**Collection Name**: `users`

#### Schema Definition

| Field Name | Data Type | Required | Unique | Default | Description |
|------------|-----------|----------|--------|---------|-------------|
| `_id` | ObjectId | Yes | Yes | Auto-generated | MongoDB unique identifier |
| `name` | String | Yes | No | - | User's full name |
| `email` | String | Yes | Yes | - | User's email address (used for login) |
| `password` | String | Yes | No | - | Hashed password (bcrypt) |
| `pic` | String | Yes | No | "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" | URL to user's profile picture |
| `isAdmin` | Boolean | Yes | No | false | Admin status flag |
| `createdAt` | Date | Yes | No | Auto-generated | Timestamp when user was created |
| `updatedAt` | Date | Yes | No | Auto-generated | Timestamp when user was last updated |

#### Indexes
- **Primary Index**: `_id` (automatic)
- **Unique Index**: `email` (enforces unique email addresses)

#### Password Handling
- Passwords are hashed using bcrypt with salt rounds of 10
- Pre-save middleware automatically hashes passwords before saving
- Instance method `matchPassword()` for password verification

#### Example Document
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  "pic": "https://example.com/profile-pics/john.jpg",
  "isAdmin": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Chats Collection

**Model File**: `/Backend/model/chatModel.js`  
**Collection Name**: `chats`

#### Schema Definition

| Field Name | Data Type | Required | Default | Description |
|------------|-----------|----------|---------|-------------|
| `_id` | ObjectId | Yes | Auto-generated | MongoDB unique identifier |
| `chatName` | String | Yes | - | Name of the chat (trimmed) |
| `isGroupChat` | Boolean | No | false | Flag indicating if this is a group chat |
| `users` | Array[ObjectId] | No | [] | Array of User references (participants) |
| `latestMessage` | ObjectId | No | null | Reference to the most recent Message |
| `groupAdmin` | ObjectId | No | null | Reference to User who is the group admin |
| `createdAt` | Date | Yes | Auto-generated | Timestamp when chat was created |
| `updatedAt` | Date | Yes | Auto-generated | Timestamp when chat was last updated |

#### Relationships
- **users**: References `User` collection (many-to-many relationship)
- **latestMessage**: References `Message` collection (one-to-one relationship)
- **groupAdmin**: References `User` collection (many-to-one relationship)

#### Indexes
- **Primary Index**: `_id` (automatic)

#### Chat Types
- **One-on-One Chat**: `isGroupChat: false`, exactly 2 users
- **Group Chat**: `isGroupChat: true`, 2 or more users, requires `groupAdmin`

#### Example Documents

**One-on-One Chat:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "chatName": "John & Jane",
  "isGroupChat": false,
  "users": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439013"
  ],
  "latestMessage": "507f1f77bcf86cd799439020",
  "createdAt": "2024-01-15T10:35:00.000Z",
  "updatedAt": "2024-01-15T14:22:00.000Z"
}
```

**Group Chat:**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "chatName": "Project Team",
  "isGroupChat": true,
  "users": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439013",
    "507f1f77bcf86cd799439015",
    "507f1f77bcf86cd799439016"
  ],
  "latestMessage": "507f1f77bcf86cd799439021",
  "groupAdmin": "507f1f77bcf86cd799439011",
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T15:45:00.000Z"
}
```

---

### 3. Messages Collection

**Model File**: `/Backend/model/messageModel.js`  
**Collection Name**: `messages`

#### Schema Definition

| Field Name | Data Type | Required | Description |
|------------|-----------|----------|-------------|
| `_id` | ObjectId | Yes | MongoDB unique identifier (auto-generated) |
| `sender` | ObjectId | No | Reference to User who sent the message |
| `content` | String | No | Message text content (trimmed) |
| `chat` | ObjectId | No | Reference to Chat this message belongs to |
| `createdAt` | Date | Yes | Timestamp when message was sent (auto-generated) |
| `updatedAt` | Date | Yes | Timestamp when message was last updated (auto-generated) |

#### Relationships
- **sender**: References `User` collection (many-to-one relationship)
- **chat**: References `Chat` collection (many-to-one relationship)

#### Indexes
- **Primary Index**: `_id` (automatic)

#### Example Document
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "sender": "507f1f77bcf86cd799439011",
  "content": "Hey, how are you doing?",
  "chat": "507f1f77bcf86cd799439012",
  "createdAt": "2024-01-15T14:22:00.000Z",
  "updatedAt": "2024-01-15T14:22:00.000Z"
}
```

---

## Entity Relationship Diagram

```
┌─────────────────┐
│     Users       │
│─────────────────│
│ _id (PK)        │
│ name            │
│ email (UNIQUE)  │
│ password        │
│ pic             │
│ isAdmin         │
│ createdAt       │
│ updatedAt       │
└────────┬────────┘
         │
         │ 1:N (sender)
         │
         ├──────────────────┐
         │                  │
         │                  │ N:N (participants)
         │                  │
         │         ┌────────▼────────┐
         │         │     Chats       │
         │         │─────────────────│
         │         │ _id (PK)        │
         │         │ chatName        │
         │         │ isGroupChat     │
         │         │ users[] (FK)    │
         │         │ latestMessage   │
         │         │ groupAdmin (FK) │
         │         │ createdAt       │
         │         │ updatedAt       │
         │         └────────┬────────┘
         │                  │
         │                  │ 1:N
         │                  │
         │         ┌────────▼────────┐
         └────────►│    Messages     │
                   │─────────────────│
                   │ _id (PK)        │
                   │ sender (FK)     │
                   │ content         │
                   │ chat (FK)       │
                   │ createdAt       │
                   │ updatedAt       │
                   └─────────────────┘
```

## Relationships Summary

1. **User → Message**: One-to-Many
   - One user can send many messages
   - Each message has one sender

2. **Chat → Message**: One-to-Many
   - One chat can have many messages
   - Each message belongs to one chat

3. **User ↔ Chat**: Many-to-Many
   - One user can participate in many chats
   - One chat can have many users (participants)

4. **User → Chat (Admin)**: One-to-Many
   - One user can be admin of many group chats
   - Each group chat has one admin

5. **Chat → Message (Latest)**: One-to-One
   - Each chat references its latest message
   - Used for displaying chat previews

---

## Data Validation Rules

### User Model
- **name**: Cannot be empty
- **email**: Must be unique across all users
- **password**: Minimum requirements enforced at application level
- **pic**: Must be a valid URL string

### Chat Model
- **chatName**: Trimmed automatically to remove leading/trailing whitespace
- **users**: Array must contain valid User ObjectIds
- **groupAdmin**: Required only when `isGroupChat` is true

### Message Model
- **content**: Trimmed automatically to remove leading/trailing whitespace
- **sender** and **chat**: Must reference existing documents

---

## Performance Considerations

### Recommended Indexes
For optimal query performance, consider adding the following indexes:

1. **Messages Collection**:
   ```javascript
   db.messages.createIndex({ "chat": 1, "createdAt": -1 })
   ```
   - Speeds up message retrieval for a specific chat, sorted by time

2. **Chats Collection**:
   ```javascript
   db.chats.createIndex({ "users": 1 })
   ```
   - Speeds up finding all chats for a specific user

3. **Messages Collection**:
   ```javascript
   db.messages.createIndex({ "sender": 1 })
   ```
   - Speeds up finding all messages from a specific user

---

## Security Notes

1. **Password Security**:
   - Passwords are hashed using bcrypt with 10 salt rounds
   - Plain text passwords are never stored
   - Pre-save middleware ensures passwords are always hashed

2. **Authentication**:
   - JWT tokens used for user authentication
   - Token generation handled by `/Backend/config/generateToken.js`

3. **Data Validation**:
   - Mongoose schema validation ensures data integrity
   - Required fields enforced at database level
   - Unique constraints prevent duplicate emails

---

## Migration Notes

### Initial Setup
1. Ensure MongoDB is running
2. Set `MONGO_URI` environment variable in `.env` file
3. Run the application - Mongoose will automatically create collections

### Schema Updates
- Mongoose handles schema migrations automatically for new fields
- Adding new required fields to existing collections requires data migration
- Always backup database before making schema changes

---

## Connection Configuration

**File**: `/Backend/config/db.js`

```javascript
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
```

**Environment Variables Required**:
- `MONGO_URI`: MongoDB connection string (e.g., `mongodb://localhost:27017/chatapp`)

---

## Query Examples

### Find all chats for a user
```javascript
Chat.find({ users: { $elemMatch: { $eq: userId } } })
  .populate('users', '-password')
  .populate('latestMessage')
  .populate('groupAdmin')
```

### Find all messages in a chat
```javascript
Message.find({ chat: chatId })
  .populate('sender', 'name pic email')
  .populate('chat')
  .sort({ createdAt: 1 })
```

### Create a new one-on-one chat
```javascript
const chat = await Chat.create({
  chatName: 'sender',
  isGroupChat: false,
  users: [userId1, userId2]
})
```

### Create a new group chat
```javascript
const groupChat = await Chat.create({
  chatName: 'Group Name',
  isGroupChat: true,
  users: [userId1, userId2, userId3],
  groupAdmin: userId1
})
```

---

## Timestamps

All collections use Mongoose timestamps feature:
- `createdAt`: Automatically set when document is created
- `updatedAt`: Automatically updated when document is modified

Enable by adding `{ timestamps: true }` to schema options.

---

## Additional Notes

1. **ObjectId References**: All foreign keys use MongoDB ObjectId type
2. **Population**: Mongoose `.populate()` method used to resolve references
3. **Soft Deletes**: Not implemented - deletes are permanent
4. **Audit Trail**: Only creation and update timestamps are tracked

---

*Last Updated: November 2024*
*Database Schema Version: 2.0.0*
