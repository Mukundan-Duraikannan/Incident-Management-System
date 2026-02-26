const API_URL = "http://localhost:8000";

export const loginUser = async (email, password) => {

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      username: email,
      password: password
    })
  });
   const data = await response.json();
   localStorage.setItem("accessToken", data.access_token);
   localStorage.setItem("refreshToken", data.refresh_token);

  return data;
};

export const registerUser = async (name, email, password) => {

  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      email,
      password
    })
  });

  return response.json();
};

export const forgotPassword = async (email) => {

  const response = await fetch(`${API_URL}/forgotpassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  });

  return response.json();
};

export const resetPassword = async (email, otp, newPassword) => {

  const response = await fetch(`${API_URL}/resetpassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      otp,
      newPassword
    })
  });

  return response.json();
};

export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refreshToken");

  const res = await fetch(`${API_URL}/refresh` ,{
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ refresh_token: refresh })
  });
  if (!res.ok) throw new Error("Refresh failed");
  const data = await res.json();
  localStorage.setItem("accessToken", data.access_token);
  return data.access_token;
};

export const authFetch = async (url, options = {}) => {
  let access = localStorage.getItem("accessToken");

  let response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${access}`
    }
  });

  if (response.status === 401) {
    try {
      access = await refreshAccessToken();

      response = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${access}`
        }
      });

    } catch (err) {
      localStorage.clear();
      window.location.href = "/login";
    }
  }

  return response;
};