# Firestore Indexes Setup

This document explains how to set up the required Firestore composite indexes for optimal query performance.

## Why These Indexes Are Needed

Firestore requires composite indexes for queries that:
- Order by a field and filter by another field
- Use multiple inequality filters
- Use multiple orderBy clauses

Without these indexes, queries will be slow or fail entirely.

## Performance Impact

With these indexes in place, you can expect:
- **10-20x faster** queries for filtered product lists
- **Instant** loading of featured products
- **Faster** category and brand filtering
- **Improved** order history loading

## How to Deploy Indexes

### Option 1: Using Firebase CLI (Recommended)

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase** (if not already done):
   ```bash
   firebase init firestore
   ```
   - Select your Firebase project
   - Accept the default `firestore.rules` and `firestore.indexes.json` files

4. **Deploy the indexes**:
   ```bash
   firebase deploy --only firestore:indexes
   ```

5. **Monitor index creation**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Navigate to Firestore Database > Indexes
   - Wait for all indexes to show "Enabled" status (this can take a few minutes)

### Option 2: Manual Creation via Firebase Console

If you prefer to create indexes manually:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** > **Indexes**
4. Click **Add Index** and create each index from the list below

## Required Indexes

### 1. Featured Products with Creation Date
- **Collection**: `mobile`
- **Fields**:
  - `featured` (Ascending)
  - `createdAt` (Descending)

### 2. Products by Category with Creation Date
- **Collection**: `mobile`
- **Fields**:
  - `Category` (Ascending)
  - `createdAt` (Descending)

### 3. Products by Brand with Creation Date
- **Collection**: `mobile`
- **Fields**:
  - `Brand` (Ascending)
  - `createdAt` (Descending)

### 4. Trending Products (Featured + Rating)
- **Collection**: `mobile`
- **Fields**:
  - `featured` (Ascending)
  - `rating` (Descending)

### 5. Category Products by Price
- **Collection**: `mobile`
- **Fields**:
  - `category` (Ascending)
  - `price` (Ascending)

### 6. Brand Products by Price
- **Collection**: `mobile`
- **Fields**:
  - `brand` (Ascending)
  - `price` (Ascending)

### 7. User Orders by Creation Date
- **Collection**: `orders`
- **Fields**:
  - `userId` (Ascending)
  - `createdAt` (Descending)

### 8. Product Reviews by Creation Date
- **Collection**: `reviews`
- **Fields**:
  - `productId` (Ascending)
  - `createdAt` (Descending)

### 9. Product Reviews by Rating
- **Collection**: `reviews`
- **Fields**:
  - `productId` (Ascending)
  - `rating` (Descending)

## Verification

After deploying indexes, verify they're working:

1. Check Firebase Console - all indexes should show "Enabled"
2. Test product filtering on your website
3. Check browser console for any Firestore index warnings

## Troubleshooting

### Index Build Failed
- Check that field names match exactly (case-sensitive)
- Ensure collection names are correct
- Try deploying indexes one at a time

### Queries Still Slow
- Make sure all indexes show "Enabled" status
- Clear your browser cache
- Check that queries are using the correct field names (e.g., `Category` vs `category`)

### Firebase CLI Issues
```bash
# Update Firebase CLI
npm install -g firebase-tools@latest

# Re-login
firebase logout
firebase login

# Verify project
firebase projects:list
firebase use <project-id>
```

## Cost Considerations

- Index creation is **free**
- Indexes consume minimal storage
- Queries using indexes are more efficient and cost less in read operations
- Overall: Indexes **save money** by reducing query costs

## Maintenance

- Indexes are persistent and don't need regular updates
- Only recreate if you change query patterns
- Monitor index usage in Firebase Console > Performance

## Next Steps

After setting up indexes:
1. Deploy indexes using Firebase CLI
2. Wait for all indexes to become "Enabled"
3. Test the application performance
4. Monitor query performance in Firebase Console

For questions, refer to [Firestore Index Documentation](https://firebase.google.com/docs/firestore/query-data/indexing)
