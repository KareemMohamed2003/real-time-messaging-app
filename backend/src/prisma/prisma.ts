import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
//  use PrismaClientInitializationError to chec that these if these cases happen
//  The provided credentials for the database are invalid
// There is no database server running under the provided hostname and port
// database host Error
// P1001
// "Can't reach database server at {database_host}:{database_port} Please make sure your database server is running at {database_host}:{database_port}."
