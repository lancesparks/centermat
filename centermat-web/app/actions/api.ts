"use server";

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

    const response = await fetch("http://127.0.0.1:8000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.INTERNAL_API_KEY}` // Safe on server
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
      return {
        success: false,
        error: errorData.message || "Registration failed on the server."
      };
    }

    const data = await response.json();
    return { success: true, user: data };
  } catch (err) {
    console.error("Server error during registration:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function login(email: string, password: string) {
  const body = new URLSearchParams();
  body.append("username", email); // OAuth2 form calls it "username" — email goes here
  body.append("password", password);

  const res = await fetch(`http://127.0.0.1:8000/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!res.ok) {
    throw new Error("Incorrect email or password"); // your 401
  }
  return res.json(); // { access_token, token_type }
}

export async function forgotPassword(email: string) {
  try {
    const response = await fetch("http://127.0.0.1:8000/auth/forgot-password", {
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

export async function resetPassword(token: string, newPassword: string) {
  try {
    const response = await fetch("http://127.0.0.1:8000/auth/reset-password", {
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
