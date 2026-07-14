import { apiFetch, apiFetchForm } from "./api";

export type User = {
  id: string;
  phoneNumber: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: "USER" | "ANFITRIONA" | "ADMIN";
  isProfileComplete: boolean;
};

export type LoginResponse = { access_token: string; user: User };
export type SendOtpResponse = { message: string };
export type VerifyOtpResponse =
  | { access_token: string; user: User }
  | { needsProfile: true; tempToken: string };

export async function loginWithEmail(email: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ─── OTP (registro por correo) ───────────────────────────────────────────────

export async function sendOtp(email: string) {
  return apiFetch<SendOtpResponse>("/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function verifyOtp(email: string, code: string) {
  return apiFetch<VerifyOtpResponse>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

// Completar registro de USUARIO tras verificar OTP (token temporal)
export async function completeRegistration(input: {
  tempToken: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
}) {
  return apiFetch<LoginResponse>("/auth/complete-registration", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// Completar registro de CREADOR (anfitriona) tras verificar OTP (multipart + idDoc)
export type AnfitrionaProfileFields = {
  firstName: string;
  lastName: string;
  username: string;
  cedula: string;
  dateOfBirth: string;
  referralCode?: string;
  password: string;
  confirmPassword: string;
};

export async function completeAnfitrionaRegistration(
  fields: AnfitrionaProfileFields & { tempToken: string },
  idDoc: File,
) {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== "") form.append(key, value as string);
  });
  form.append("idDoc", idDoc);
  return apiFetchForm<LoginResponse>(
    "/auth/complete-anfitrione-registration",
    form,
  );
}

// ─── Google ──────────────────────────────────────────────────────────────────

export async function googleLogin(idToken: string) {
  return apiFetch<LoginResponse>("/auth/google-login", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
}

export async function googleLoginAnfitriona(idToken: string) {
  return apiFetch<LoginResponse>("/auth/google-login-anfitriona", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
}

// Completar perfil de USUARIO que entró con Google (Bearer token)
export async function completeGoogleClientProfile(
  input: {
    firstName: string;
    lastName?: string;
    phoneNumber?: string;
    password: string;
    confirmPassword: string;
  },
  token: string,
) {
  return apiFetch<LoginResponse>(
    "/auth/complete-google-client-profile",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    token,
  );
}

// Completar perfil de CREADOR que entró con Google (multipart + idDoc, Bearer token)
export async function completeGoogleAnfitrionaProfile(
  fields: Omit<AnfitrionaProfileFields, "password" | "confirmPassword">,
  idDoc: File,
  token: string,
) {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== "") form.append(key, value as string);
  });
  form.append("idDoc", idDoc);
  return apiFetchForm<LoginResponse>(
    "/auth/complete-google-anfitriona-profile",
    form,
    token,
  );
}

// ─── Recuperación de contraseña ──────────────────────────────────────────────

export async function forgotPassword(email: string) {
  return apiFetch<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(email: string, code: string, newPassword: string) {
  return apiFetch<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, code, newPassword }),
  });
}
