@echo off
REM Script to remove all Supabase-related files from the Mountain Gear Rental project
REM Place this file in the project root directory and run it

echo Removing Supabase SQL scripts...
del /q supabase_schema.sql
del /q supabase_schema_fixed.sql
del /q supabase_schema_fixed_v2.sql
del /q supabase_schema_clean.sql
del /q supabase_schema_idempotent.sql
del /q supabase_schema_updated.sql
del /q fix_user_profiles.sql
del /q google_oauth_fix.sql
del /q user_trigger_fix.sql
del /q improved_user_trigger_fix.sql
del /q simplified_user_trigger.sql
del /q cleanup_database.sql

echo Removing Supabase auth files...
del /q auth_with_fallback_profile.js
del /q auth_with_fallback_profile.ts
del /q fixed_signup_function.txt
del /q lib\auth.ts.backup
del /q lib\auth.ts.fixed
del /q lib\auth.ts.no-triggers

echo Removing Supabase instructions...
del /q REMOVE_SUPABASE_TRIGGERS_INSTRUCTIONS.md
del /q USER_SIGNUP_FIX_INSTRUCTIONS.md

echo Removing Supabase library...
del /q lib\supabase.ts

echo Renaming updated files...
move /y app\login\page.tsx.new app\login\page.tsx

echo Creating backup of original auth.ts...
copy lib\auth.ts lib\auth.ts.original

echo Updating package.json to remove Supabase dependencies...
REM This requires a separate tool like jq - manual editing may be required

echo Done! Please manually check for any remaining Supabase references.
pause
