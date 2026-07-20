import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens
} from "../helpers/storage";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const refresh_token = getRefreshToken();
  if (!refresh_token) return false;

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token })
  });

  if (!res.ok) {
    clearTokens();
    return false;
  }

  const data = await res.json();
  setTokens(data.access_token, data.refresh_token); // BOTH — rotation
  return true;
}

export async function registerUser(userData: any) {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      email,
      phoneNumber,
      password,
      role
    } = userData;

    const response = await apiFetch(`/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        email,
        phone: phoneNumber,
        password,
        roles: [role]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log(errorData);
      return {
        success: false,
        error: errorData.detail || "Registration failed on the server."
      };
    }

    const data = await response.json();
    return { success: true, user: data };
  } catch (err) {
    console.error("Server error during registration:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const doFetch = () =>
    fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${getAccessToken() ?? ""}`
      }
    });

  let res = await doFetch();

  if (res.status === 401) {
    // share one in-flight refresh across concurrent callers
    refreshPromise = refreshPromise ?? refreshTokens();
    const ok = await refreshPromise;
    refreshPromise = null;

    if (!ok) throw new Error("SESSION_EXPIRED");
    res = await doFetch(); // retry once with the new access token
  }

  return res;
}

export async function login(email: string, password: string) {
  const body = new URLSearchParams();
  body.append("username", email); // OAuth2 form calls it "username" — email goes here
  body.append("password", password);

  const res = await apiFetch(`/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!res.ok) {
    throw new Error("Incorrect email or password"); // your 401
  }

  const data = await res.json();
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function forgotPassword(email: string) {
  try {
    const response = await apiFetch(`/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      const errorMessage =
        typeof errorData.detail === "string"
          ? errorData.detail
          : "Failed to send reset link. Please check your email was entered correctly.";

      return {
        success: false,
        error: errorMessage
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message
    };
  } catch (err) {
    return {
      success: false,
      error:
        "Something went wrong. Please check your internet connection and try again."
    };
  }
}
export async function getCurrentUser() {
  const refresh_token = getRefreshToken();
  try {
    const res = await apiFetch(`/auth/user`, {
      headers: { Authorization: `Bearer ${refresh_token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  } catch (e) {
    console.log(e);
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const response = await apiFetch(`/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token,
        new_password: newPassword
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.detail || "Failed to reset password."
      };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
