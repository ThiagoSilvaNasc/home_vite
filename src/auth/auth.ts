// src/auth/auth.ts

export const fakeAuth = {
    login(username: string, password: string): boolean {
      return username === "admin" && password === "admin";
    },
    isAuthenticated(): boolean {
      return localStorage.getItem("auth") === "true";
    },
    logout(): void {
      localStorage.removeItem("auth");
    },
  };
  