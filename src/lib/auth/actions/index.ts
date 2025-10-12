/**
 * Authentication Actions - Centralized exports
 * 
 * This file re-exports all authentication actions from their respective modules.
 * Import from this file to access any auth action.
 * 
 * Example:
 *   import { registerAction, signInAction } from "@/lib/auth/actions";
 */

export { registerAction } from "./register";
export { signInAction } from "./login";
export { signOutAction } from "./sign-out";
export { passwordResetAction } from "./password-reset";
export { changePasswordAction } from "./change-password";

