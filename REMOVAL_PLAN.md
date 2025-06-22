# SUPABASE REMOVAL PLAN

This document outlines the steps to completely remove Supabase dependencies from the Mountain Gear Rental application.

## Files to be Deleted

These files are entirely Supabase-related and should be removed:

1. `lib/supabase.ts` - Supabase client initialization
2. `auth_with_fallback_profile.js` - Supabase auth function
3. `auth_with_fallback_profile.ts` - TypeScript version of Supabase auth function
4. `cleanup_database.sql` - Supabase database cleanup script
5. `fix_user_profiles.sql` - Supabase user profiles fix
6. `fixed_signup_function.txt` - Supabase signup fix
7. `google_oauth_fix.sql` - Supabase Google OAuth fix
8. `improved_user_trigger_fix.sql` - Supabase trigger fixes
9. `simplified_user_trigger.sql` - Simplified Supabase trigger
10. `supabase_schema_clean.sql` - Supabase schema
11. `supabase_schema_fixed_v2.sql` - Supabase schema v2
12. `supabase_schema_fixed.sql` - Supabase schema fixed 
13. `supabase_schema_idempotent.sql` - Supabase idempotent schema
14. `supabase_schema_updated.sql` - Supabase updated schema
15. `supabase_schema.sql` - Original Supabase schema
16. `user_trigger_fix.sql` - Supabase user trigger fix
17. `REMOVE_SUPABASE_TRIGGERS_INSTRUCTIONS.md` - Supabase removal instructions
18. `USER_SIGNUP_FIX_INSTRUCTIONS.md` - Supabase user signup fix instructions
19. `lib/auth.ts.backup` - Backup of Supabase auth
20. `lib/auth.ts.fixed` - Fixed version of Supabase auth
21. `lib/auth.ts.no-triggers` - No-triggers version of Supabase auth

## Files to be Modified

These files contain Supabase code that needs to be replaced:

1. `lib/auth.ts` - Core authentication file with Supabase
2. `app/register/page.tsx` - Registration page with Supabase auth calls
3. `app/login/page.tsx` - Login page with Supabase auth calls
4. `app/dashboard/profile/page.tsx` - Profile page with Supabase user data

## Implementation Plan

1. Create replacement authentication system (localStorage based or similar)
2. Update UI components to work with new auth system
3. Remove Supabase dependencies from package.json
4. Delete all Supabase-related files
5. Test application functionality
