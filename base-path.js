export const BASE_PATH =
  process.env.BASE_PATH ??
  (process.env.NODE_ENV === "production"
    ? "/IO-31_appRECORD-ArtemRyabets-FIOT-2026"
    : "");
