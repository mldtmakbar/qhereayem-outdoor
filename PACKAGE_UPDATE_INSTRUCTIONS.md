# Removing Supabase Dependencies from package.json

After running the `remove_supabase.bat` script, you need to manually update your package.json file to remove all Supabase-related dependencies. Follow these steps:

1. Open your `package.json` file in a text editor

2. Remove the following dependencies (if they exist):
   ```json
   "@supabase/auth-helpers-nextjs": "...",
   "@supabase/auth-helpers-react": "...",
   "@supabase/auth-ui-react": "...",
   "@supabase/auth-ui-shared": "...",
   "@supabase/supabase-js": "..."
   ```

3. After removing these dependencies, run:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```
   to update your node_modules directory and lock files.

## Final Cleanup

1. If you're using TypeScript, make sure to fix any remaining type errors related to Supabase.

2. Search the codebase for any remaining "supabase" references:
   ```bash
   grep -r "supabase" --include="*.ts" --include="*.tsx" .
   ```

3. Replace any remaining files that might be using the Supabase client with versions that use the new localStorage-based authentication.

4. If you need to preserve any data from Supabase, make sure you've exported it before disconnecting from the Supabase service.

## Important Files to Check

1. Check the following files and update them to use the new auth system:
   - `app/dashboard/profile/page.tsx` (for user profile data)
   - Any API routes that used Supabase
   - Any components that directly used the Supabase client

2. Update any initialization code or context providers that were initializing Supabase.

## Testing

After removing all Supabase dependencies, test all functionality:

1. User registration
2. User login
3. User profile updates
4. Data access that previously relied on Supabase
