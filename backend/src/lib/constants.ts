import { CorsOptions } from "cors";

export const clientOrigin = "http://localhost:3000";

export const corsOptions: CorsOptions = {
  origin: clientOrigin,
  credentials: true, //access-control-allow-credentials:true
};
