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

  return response.json();
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
