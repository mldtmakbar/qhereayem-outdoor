# Complete Guide to Removing Supabase from Mountain Gear Rental

This guide outlines the steps to completely remove Supabase dependencies from your Mountain Gear Rental application and replace them with a local storage-based authentication system.

## Step 1: Run the Removal Script

Run the provided batch script to remove Supabase-related files:

```batch
.\remove_supabase.bat
```

This will:
- Delete all SQL files related to Supabase
- Remove Supabase auth files
- Delete instruction files for Supabase
- Remove the Supabase library file
- Rename updated files

## Step 2: Update Package Dependencies

Follow the instructions in `PACKAGE_UPDATE_INSTRUCTIONS.md` to:
1. Remove Supabase packages from package.json
2. Reinstall dependencies

## Step 3: Test Authentication Functionality

The following auth features have been reimplemented using localStorage:

### Registration
- Test user registration at `/register` 
- New accounts are stored in localStorage

### Login
- Test login with credentials at `/login`
- Authentication state is managed in localStorage

### User Profile
- View and edit profile at `/dashboard/profile`
- Changes are saved to localStorage

## Step 4: Understanding the New Auth System

### File Structure
- `lib/auth-local.ts`: Core authentication logic with localStorage
- `lib/types.ts`: Updated user types without Supabase dependencies
- Modified app pages that use the new auth system

### Key Differences
1. **Data Persistence**: User data is stored in the browser's localStorage instead of a database
2. **Authentication**: Simple email/password pair checking instead of token-based auth
3. **Session Management**: Session is maintained in localStorage
4. **No Server Integration**: This is a client-side only solution

### Developer Notes
- This is a temporary solution - in a production app you'd replace it with a proper backend
- User data will not persist across different browsers or devices
- No real security - this is just for development purposes

## Step 5: Next Steps

To implement a proper backend replacement for Supabase:

1. Set up a server with:
   - User authentication endpoints
   - Database integration
   - JWT token generation and validation

2. Update the auth-local.ts file to communicate with your new backend

3. Implement proper data storage and retrieval for all features that previously used Supabase

## Need Help?

If you encounter any issues during the removal process:

1. Check for remaining Supabase references with:
   ```
   grep -r "supabase" --include="*.ts" --include="*.tsx" .
   ```

2. Look for type errors related to Supabase imports or calls

3. Check browser console for runtime errors
